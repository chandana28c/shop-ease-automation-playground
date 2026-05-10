import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useApp } from "@/context/AppContext";
import { apiPlaceOrder } from "@/lib/mockApi";
import { sendOrderConfirmationEmail } from "@/lib/emailjs";
import { formatPrice } from "@/lib/format";
import type { ShippingInfo } from "@/lib/types";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
  head: () => ({ meta: [{ title: "Checkout — ShopEase" }] }),
});

function CheckoutPage() {
  const { user, cart, cartSubtotal, clearCart } = useApp();
  const router = useRouter();
  const [shipping, setShipping] = useState<ShippingInfo>({
    fullName: user?.name ?? "",
    address: "",
    city: "",
    zip: "",
    country: "United States",
  });
  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "cod">("card");
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvc: "" });
  const [upiId, setUpiId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.navigate({ to: "/login", search: { redirect: "/checkout" } });
    }
  }, [user, router]);

  if (!user) return null;

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center" data-testid="checkout-empty">
        <h1 className="text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Add something before checking out.</p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!shipping.fullName || !shipping.address || !shipping.city || !shipping.zip) {
      setError("Please fill in every shipping field");
      return;
    }
    // Mock payment validation — no real processor is contacted.
    if (paymentMethod === "card") {
      const digits = card.number.replace(/\s+/g, "");
      if (!/^\d{12,19}$/.test(digits)) {
        setError("Enter a valid card number (12–19 digits)");
        return;
      }
      if (!card.name.trim()) { setError("Enter the name on the card"); return; }
      if (!/^\d{2}\/\d{2}$/.test(card.expiry)) {
        setError("Expiry must be in MM/YY format"); return;
      }
      if (!/^\d{3,4}$/.test(card.cvc)) { setError("CVC must be 3 or 4 digits"); return; }
    } else if (paymentMethod === "upi") {
      if (!/^[\w.\-]+@[\w]+$/.test(upiId)) {
        setError("Enter a valid UPI ID, e.g. name@bank"); return;
      }
    }
    setSubmitting(true);
    try {
      const order = await apiPlaceOrder({ user: user!, items: cart, shipping });
      // Fire-and-forget order-confirmation email via EmailJS — non-blocking.
      sendOrderConfirmationEmail(order, user!.email)
        .then(() => toast.success("Confirmation email sent"))
        .catch((err) => {
          console.warn("EmailJS send failed:", err);
          toast.message("Order placed — email could not be sent");
        });
      clearCart();
      router.navigate({ to: "/order-success/$id", params: { id: order.id } });
    } catch (err) {
      setError((err as Error).message);
      toast.error((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 animate-fade-in" data-testid="checkout-page">
      <h1 className="mb-6 text-3xl font-bold">Checkout</h1>
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border bg-card p-5">
          <h2 className="text-lg font-semibold">Shipping information</h2>
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="fullName">Full name</label>
            <input
              id="fullName"
              data-testid="checkout-name-input"
              required
              value={shipping.fullName}
              onChange={(e) => setShipping((s) => ({ ...s, fullName: e.target.value }))}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="address">Address</label>
            <input
              id="address"
              data-testid="checkout-address-input"
              required
              value={shipping.address}
              onChange={(e) => setShipping((s) => ({ ...s, address: e.target.value }))}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="city">City</label>
              <input
                id="city"
                data-testid="checkout-city-input"
                required
                value={shipping.city}
                onChange={(e) => setShipping((s) => ({ ...s, city: e.target.value }))}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium" htmlFor="zip">ZIP / Postal code</label>
              <input
                id="zip"
                data-testid="checkout-zip-input"
                required
                value={shipping.zip}
                onChange={(e) => setShipping((s) => ({ ...s, zip: e.target.value }))}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="country">Country</label>
            <input
              id="country"
              data-testid="checkout-country-input"
              value={shipping.country}
              onChange={(e) => setShipping((s) => ({ ...s, country: e.target.value }))}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          {error && (
            <p data-testid="checkout-error" className="rounded-md border border-destructive/40 bg-destructive/10 p-2 text-sm text-destructive">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting}
            data-testid="checkout-submit-btn"
            className="mt-2 w-full rounded-md bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            {submitting ? "Placing order…" : `Place order — ${formatPrice(cartSubtotal)}`}
          </button>
        </form>

        <aside className="h-fit rounded-xl border border-border bg-card p-5" data-testid="checkout-summary">
          <h2 className="mb-4 text-lg font-semibold">Order summary</h2>
          <ul className="space-y-2 text-sm" data-testid="checkout-items">
            {cart.map((i) => (
              <li key={i.product.id} className="flex justify-between gap-4">
                <span className="line-clamp-1 text-foreground/80">
                  {i.product.name} <span className="text-muted-foreground">× {i.quantity}</span>
                </span>
                <span>{formatPrice(i.product.price * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd>{formatPrice(cartSubtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Shipping</dt>
              <dd className="text-success">Free</dd>
            </div>
            <div className="mt-2 flex justify-between border-t border-border pt-2 text-base font-semibold">
              <dt>Total</dt>
              <dd data-testid="checkout-total">{formatPrice(cartSubtotal)}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}

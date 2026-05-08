import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp } from "@/context/AppContext";
import { formatPrice } from "@/lib/format";

export const Route = createFileRoute("/cart")({
  component: CartPage,
  head: () => ({ meta: [{ title: "Your Cart — ShopEase" }] }),
});

function CartPage() {
  const { cart, updateQty, removeFromCart, cartSubtotal, user } = useApp();

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center" data-testid="cart-empty">
        <h1 className="text-3xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">
          Looks like you haven't added anything yet.
        </p>
        <Link
          to="/products"
          className="mt-6 inline-block rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 animate-fade-in" data-testid="cart-page">
      <h1 className="mb-6 text-3xl font-bold">Your cart</h1>
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <ul className="space-y-3" data-testid="cart-items">
          {cart.map((item) => (
            <li
              key={item.product.id}
              data-testid="cart-item"
              data-product-id={item.product.id}
              className="flex gap-4 rounded-xl border border-border bg-card p-4"
            >
              <img
                src={item.product.image}
                alt={item.product.name}
                className="h-24 w-24 rounded-lg object-cover"
              />
              <div className="flex flex-1 flex-col">
                <Link
                  to="/products/$id"
                  params={{ id: item.product.id }}
                  className="font-medium hover:text-primary"
                  data-testid="cart-item-name"
                >
                  {item.product.name}
                </Link>
                <p className="text-sm text-muted-foreground" data-testid="cart-item-price">
                  {formatPrice(item.product.price)}
                </p>
                <div className="mt-auto flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      data-testid="cart-qty-decrease"
                      aria-label="Decrease quantity"
                      onClick={() => updateQty(item.product.id, item.quantity - 1)}
                      className="h-8 w-8 rounded-md border border-input bg-background text-foreground hover:bg-secondary"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      data-testid="cart-qty-input"
                      onChange={(e) => {
                        const v = parseInt(e.target.value, 10);
                        if (!Number.isNaN(v) && v > 0) updateQty(item.product.id, v);
                      }}
                      className="h-8 w-14 rounded-md border border-input bg-background text-center text-sm"
                    />
                    <button
                      type="button"
                      data-testid="cart-qty-increase"
                      aria-label="Increase quantity"
                      onClick={() => updateQty(item.product.id, item.quantity + 1)}
                      className="h-8 w-8 rounded-md border border-input bg-background text-foreground hover:bg-secondary"
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    data-testid="cart-remove-btn"
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-sm font-medium text-destructive hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div
                className="self-start font-semibold"
                data-testid="cart-line-total"
              >
                {formatPrice(item.product.price * item.quantity)}
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-xl border border-border bg-card p-5" data-testid="cart-summary">
          <h2 className="mb-4 text-lg font-semibold">Order summary</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd data-testid="cart-subtotal">{formatPrice(cartSubtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Shipping</dt>
              <dd className="text-success">Free</dd>
            </div>
            <div className="mt-3 flex justify-between border-t border-border pt-3 text-base font-semibold">
              <dt>Total</dt>
              <dd data-testid="cart-total">{formatPrice(cartSubtotal)}</dd>
            </div>
          </dl>
          <Link
            to={user ? "/checkout" : "/login"}
            search={user ? undefined : ({ redirect: "/checkout" } as never)}
            data-testid="cart-checkout-btn"
            className="mt-5 block w-full rounded-md bg-primary py-3 text-center text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            {user ? "Proceed to checkout" : "Login to checkout"}
          </Link>
        </aside>
      </div>
    </div>
  );
}

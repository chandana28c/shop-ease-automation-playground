import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { useApp } from "@/context/AppContext";
import { apiGetOrder } from "@/lib/mockApi";
import { formatPrice, formatDate } from "@/lib/format";
import type { Order } from "@/lib/types";

export const Route = createFileRoute("/order-success/$id")({
  component: OrderSuccessPage,
  head: () => ({
    meta: [
      { title: "Order Placed — ShopEase" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function OrderSuccessPage() {
  const { id } = Route.useParams();
  const { user } = useApp();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const confettiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    if (!user) {
      router.navigate({ to: "/login" });
      return;
    }
    apiGetOrder(user.id, id)
      .then((o) => {
        if (!cancelled) setOrder(o);
      })
      .catch(() => {
        if (!cancelled) setOrder(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, user, router]);

  // Fire confetti on mount — gold, green, blue palette, 4–5 seconds.
  useEffect(() => {
    const colors = ["#f5b400", "#22c55e", "#0ea5e9", "#10b981", "#facc15"];
    const duration = 4500;
    const end = Date.now() + duration;

    const tick = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 70,
        startVelocity: 55,
        origin: { x: 0, y: 0.7 },
        colors,
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 70,
        startVelocity: 55,
        origin: { x: 1, y: 0.7 },
        colors,
      });
      if (Date.now() < end) requestAnimationFrame(tick);
    };

    // Initial big burst
    confetti({
      particleCount: 160,
      spread: 100,
      origin: { y: 0.6 },
      colors,
    });
    tick();
  }, []);

  if (loading) {
    return (
      <div data-testid="loading-spinner" className="mx-auto max-w-2xl px-4 py-20 text-center text-muted-foreground">
        Finalizing your order…
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">We couldn't find that order</h1>
        <Link to="/products" className="mt-4 inline-block text-primary hover:underline">
          Back to shop
        </Link>
      </div>
    );
  }

  return (
    <div
      className="relative mx-auto max-w-2xl px-4 py-16 text-center animate-fade-in"
      data-testid="order-success-page"
    >
      {/* The confetti canvas-confetti library renders to a fixed canvas; this
          container exists so Selenium can assert the success layout is present. */}
      <div
        ref={confettiRef}
        data-testid="confetti-container"
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      />

      <div
        className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-success text-success-foreground shadow-lg animate-pop-in"
        data-testid="success-checkmark"
        aria-hidden
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-12 w-12"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <h1
        data-testid="order-success-message"
        className="mt-6 text-3xl font-bold sm:text-4xl"
      >
        🎉 Order Placed Successfully!
      </h1>
      <p className="mx-auto mt-3 max-w-md text-muted-foreground">
        A confirmation email has been sent to your registered email address.
      </p>

      <dl
        className="mx-auto mt-8 grid max-w-md gap-3 rounded-xl border border-border bg-card p-5 text-left"
        data-testid="order-summary"
      >
        <div className="flex justify-between text-sm">
          <dt className="text-muted-foreground">Order ID</dt>
          <dd className="font-medium" data-testid="order-id">{order.id}</dd>
        </div>
        <div className="flex justify-between text-sm">
          <dt className="text-muted-foreground">Placed on</dt>
          <dd>{formatDate(order.createdAt)}</dd>
        </div>
        <div className="flex justify-between text-sm">
          <dt className="text-muted-foreground">Estimated delivery</dt>
          <dd data-testid="estimated-delivery">{formatDate(order.estimatedDelivery)}</dd>
        </div>
        <div className="mt-2 flex justify-between border-t border-border pt-3 text-base font-semibold">
          <dt>Total</dt>
          <dd data-testid="order-total">{formatPrice(order.total)}</dd>
        </div>
      </dl>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          data-testid="continue-shopping-btn"
          className="rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Continue shopping
        </Link>
        <Link
          to="/orders"
          data-testid="view-orders-btn"
          className="rounded-md border border-input bg-background px-5 py-3 text-sm font-semibold text-foreground hover:bg-secondary"
        >
          View order history
        </Link>
      </div>
    </div>
  );
}

import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import { apiListOrders } from "@/lib/mockApi";
import { formatPrice, formatDate } from "@/lib/format";
import type { Order } from "@/lib/types";

export const Route = createFileRoute("/orders")({
  component: OrdersPage,
  head: () => ({ meta: [{ title: "Your Orders — ShopEase" }] }),
});

function OrdersPage() {
  const { user, authLoading } = useApp();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.navigate({ to: "/login", search: { redirect: "/orders" } });
      return;
    }
    apiListOrders(user.id)
      .then(setOrders)
      .finally(() => setLoading(false));
  }, [user, authLoading, router]);

  if (loading) {
    return (
      <div data-testid="loading-spinner" className="mx-auto max-w-3xl px-4 py-16 text-center text-muted-foreground">
        Loading your orders…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 animate-fade-in" data-testid="orders-page">
      <h1 className="mb-6 text-3xl font-bold">Your orders</h1>
      {orders.length === 0 ? (
        <div data-testid="orders-empty" className="rounded-xl border border-border bg-card p-10 text-center text-muted-foreground">
          <p>You haven't placed any orders yet.</p>
          <Link
            to="/products"
            className="mt-4 inline-block rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Start shopping
          </Link>
        </div>
      ) : (
        <ul className="space-y-3" data-testid="orders-list">
          {orders.map((o) => (
            <li
              key={o.id}
              data-testid="order-history-row"
              data-order-id={o.id}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">Order</p>
                  <p className="font-semibold" data-testid="order-row-id">{o.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Placed</p>
                  <p>{formatDate(o.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="font-semibold" data-testid="order-row-total">{formatPrice(o.total)}</p>
                </div>
                <Link
                  to="/orders/$id"
                  params={{ id: o.id }}
                  data-testid="order-row-view-btn"
                  className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-secondary"
                >
                  View details
                </Link>
              </div>
              <p className="mt-2 line-clamp-1 text-sm text-muted-foreground">
                {o.items.map((i) => `${i.product.name} × ${i.quantity}`).join(" · ")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

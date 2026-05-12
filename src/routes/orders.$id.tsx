import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import { apiGetOrder } from "@/lib/mockApi";
import { formatPrice, formatDate } from "@/lib/format";
import type { Order } from "@/lib/types";

export const Route = createFileRoute("/orders/$id")({
  component: OrderDetail,
  head: () => ({ meta: [{ title: "Order Detail — ShopEase" }] }),
});

function OrderDetail() {
  const { id } = Route.useParams();
  const { user, authLoading } = useApp();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const fallbackImage = "https://loremflickr.com/600/450/product?lock=404";

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.navigate({ to: "/login" });
      return;
    }
    apiGetOrder(user.id, id)
      .then(setOrder)
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id, user, authLoading, router]);

  if (loading) {
    return (
      <div data-testid="loading-spinner" className="mx-auto max-w-3xl px-4 py-16 text-center text-muted-foreground">
        Loading order…
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Order not found</h1>
        <Link to="/orders" className="mt-3 inline-block text-primary hover:underline">
          Back to orders
        </Link>
      </div>
    );
  }

  return (
    <div
      className="mx-auto max-w-3xl px-4 py-10 animate-fade-in"
      data-testid="order-detail-page"
      data-order-id={order.id}
    >
      <Link to="/orders" className="text-sm text-primary hover:underline">
        ← All orders
      </Link>
      <h1 className="mt-2 text-3xl font-bold">Order {order.id}</h1>
      <p className="text-sm text-muted-foreground">
        Placed {formatDate(order.createdAt)} · Estimated delivery {formatDate(order.estimatedDelivery)}
      </p>

      <section className="mt-6 rounded-xl border border-border bg-card p-5">
        <h2 className="mb-4 text-lg font-semibold">Items</h2>
        <ul className="divide-y divide-border" data-testid="order-detail-items">
          {order.items.map((i) => (
            <li key={i.product.id} className="flex items-center gap-4 py-3" data-testid="order-detail-item">
              <img
                src={i.product.image}
                alt={i.product.name}
                onError={(e) => {
                  e.currentTarget.src = fallbackImage;
                }}
                className="h-16 w-16 rounded-md object-cover"
              />
              <div className="flex-1">
                <p className="font-medium">{i.product.name}</p>
                <p className="text-sm text-muted-foreground">Qty {i.quantity}</p>
              </div>
              <p className="font-semibold">{formatPrice(i.product.price * i.quantity)}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Shipping to</h3>
          <p>{order.shippingInfo.fullName}</p>
          <p>{order.shippingInfo.address}</p>
          <p>{order.shippingInfo.city}, {order.shippingInfo.zip}</p>
          <p>{order.shippingInfo.country}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Totals</h3>
          <dl className="space-y-1 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd>{formatPrice(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Shipping</dt>
              <dd>
                {order.shipping === 0 ? (
                  <span className="text-success">Free</span>
                ) : (
                  formatPrice(order.shipping)
                )}
              </dd>
            </div>
            <div className="mt-2 flex justify-between border-t border-border pt-2 text-base font-semibold">
              <dt>Total</dt>
              <dd data-testid="order-detail-total">{formatPrice(order.total)}</dd>
            </div>
          </dl>
        </div>
      </section>
    </div>
  );
}

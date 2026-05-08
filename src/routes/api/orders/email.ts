// Order confirmation email endpoint.
//
// In a real production deployment, this is where you'd enqueue a transactional
// email via Lovable Email. Right now, with a frontend-only mock backend, this
// route logs the request and returns success so the checkout flow stays
// non-blocking. Wire up Lovable Cloud + Email later to make it actually send.
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/orders/email")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          console.log(
            "[order-email] Would send confirmation:",
            JSON.stringify({
              orderId: body.orderId,
              to: body.email,
              total: body.total,
            }),
          );
        } catch (err) {
          console.warn("[order-email] Bad request:", err);
        }
        return Response.json({ ok: true });
      },
    },
  },
});

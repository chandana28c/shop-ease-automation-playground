// EmailJS REST integration for order-confirmation emails.
// Public Key, Service ID and Template ID are safe to expose — EmailJS public
// keys are designed for browser-side use.
import type { Order } from "./types";

const EMAILJS_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";
const SERVICE_ID = "service_waek11b";
const TEMPLATE_ID = "template_jf185n4";
const PUBLIC_KEY = "LJLEk2fCXcpRT17KB";

/**
 * Sends an order-confirmation email through EmailJS.
 * Template variables it provides:
 *   {{order_id}}, {{email}}, {{name}},
 *   {{#orders}} {{name}} {{units}} {{price}} {{/orders}},
 *   {{cost.shipping}}, {{cost.tax}}, {{cost.total}}
 */
export async function sendOrderConfirmationEmail(order: Order, toEmail: string) {
  const subtotal = order.items.reduce(
    (s, i) => s + i.product.price * i.quantity,
    0,
  );
  const shipping = 0;
  const tax = +(subtotal * 0.0).toFixed(2); // no tax in mock app
  const total = order.total;

  const templateParams = {
    order_id: order.id,
    email: toEmail,
    name: order.customerName,
    orders: order.items.map((i) => ({
      name: i.product.name,
      units: i.quantity,
      price: i.product.price.toFixed(2),
      image_url: i.product.image,
    })),
    cost: {
      shipping: shipping.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2),
    },
  };

  const res = await fetch(EMAILJS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: SERVICE_ID,
      template_id: TEMPLATE_ID,
      user_id: PUBLIC_KEY,
      template_params: templateParams,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`EmailJS ${res.status}: ${text}`);
  }
}

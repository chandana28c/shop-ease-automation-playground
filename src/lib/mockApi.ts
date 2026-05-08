// Browser-side mock REST API. Simulates latency so the UI behaves like
// a real network client (loading spinners, error states, etc.).
import { PRODUCTS, type Category, type Product } from "./products";
import type { AuthUser, CartItem, Order, ShippingInfo } from "./types";

const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms));

// ---------- Auth ----------
const USERS_KEY = "shopease_users";
const TOKEN_KEY = "shopease_token";
const CURRENT_USER_KEY = "shopease_current_user";

interface StoredUser extends AuthUser {
  password: string;
}

function readUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}
function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export async function apiRegister(input: {
  email: string;
  password: string;
  name: string;
}): Promise<{ token: string; user: AuthUser }> {
  await delay();
  if (!input.email.includes("@")) throw new Error("Invalid email");
  if (input.password.length < 6)
    throw new Error("Password must be at least 6 characters");
  const users = readUsers();
  if (users.some((u) => u.email.toLowerCase() === input.email.toLowerCase()))
    throw new Error("An account with that email already exists");
  const user: StoredUser = {
    id: crypto.randomUUID(),
    email: input.email,
    name: input.name,
    password: input.password,
  };
  writeUsers([...users, user]);
  const token = `mock.${btoa(user.id)}.${Date.now()}`;
  const publicUser: AuthUser = { id: user.id, email: user.email, name: user.name };
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(publicUser));
  return { token, user: publicUser };
}

export async function apiLogin(input: {
  email: string;
  password: string;
}): Promise<{ token: string; user: AuthUser }> {
  await delay();
  const users = readUsers();
  const found = users.find(
    (u) => u.email.toLowerCase() === input.email.toLowerCase(),
  );
  if (!found || found.password !== input.password)
    throw new Error("Invalid email or password");
  const token = `mock.${btoa(found.id)}.${Date.now()}`;
  const publicUser: AuthUser = { id: found.id, email: found.email, name: found.name };
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(publicUser));
  return { token, user: publicUser };
}

export function apiLogout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(CURRENT_USER_KEY);
}

export function getStoredAuth(): { token: string | null; user: AuthUser | null } {
  if (typeof window === "undefined") return { token: null, user: null };
  const token = localStorage.getItem(TOKEN_KEY);
  const userRaw = localStorage.getItem(CURRENT_USER_KEY);
  return {
    token,
    user: userRaw ? (JSON.parse(userRaw) as AuthUser) : null,
  };
}

// ---------- Products ----------
export async function apiListProducts(opts: {
  search?: string;
  category?: Category | "all";
  sort?: "price-asc" | "price-desc" | "rating-desc";
  maxPrice?: number;
} = {}): Promise<Product[]> {
  await delay(250);
  let list = [...PRODUCTS];
  if (opts.search) {
    const q = opts.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    );
  }
  if (opts.category && opts.category !== "all") {
    list = list.filter((p) => p.category === opts.category);
  }
  if (typeof opts.maxPrice === "number") {
    list = list.filter((p) => p.price <= opts.maxPrice!);
  }
  if (opts.sort === "price-asc") list.sort((a, b) => a.price - b.price);
  else if (opts.sort === "price-desc") list.sort((a, b) => b.price - a.price);
  else if (opts.sort === "rating-desc") list.sort((a, b) => b.rating - a.rating);
  return list;
}

export async function apiGetProduct(id: string): Promise<Product> {
  await delay(200);
  const p = PRODUCTS.find((x) => x.id === id);
  if (!p) throw new Error("Product not found");
  return p;
}

// ---------- Orders ----------
function ordersKey(userId: string) {
  return `shopease_orders_${userId}`;
}

export async function apiPlaceOrder(input: {
  user: AuthUser;
  items: CartItem[];
  shipping: ShippingInfo;
}): Promise<Order> {
  await delay(500);
  if (input.items.length === 0) throw new Error("Cart is empty");
  const subtotal = input.items.reduce(
    (s, i) => s + i.product.price * i.quantity,
    0,
  );
  const order: Order = {
    id: `ORD-${Date.now().toString(36).toUpperCase()}`,
    userEmail: input.user.email,
    customerName: input.shipping.fullName || input.user.name,
    items: input.items,
    subtotal,
    shipping: 0,
    total: subtotal,
    shippingInfo: input.shipping,
    createdAt: new Date().toISOString(),
    estimatedDelivery: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
  };
  const existing = await apiListOrders(input.user.id);
  localStorage.setItem(
    ordersKey(input.user.id),
    JSON.stringify([order, ...existing]),
  );
  return order;
}

export async function apiListOrders(userId: string): Promise<Order[]> {
  await delay(200);
  try {
    return JSON.parse(localStorage.getItem(ordersKey(userId)) || "[]");
  } catch {
    return [];
  }
}

export async function apiGetOrder(userId: string, id: string): Promise<Order> {
  const orders = await apiListOrders(userId);
  const found = orders.find((o) => o.id === id);
  if (!found) throw new Error("Order not found");
  return found;
}

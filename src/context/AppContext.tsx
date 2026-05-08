import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  apiLogin,
  apiLogout,
  apiRegister,
  getStoredAuth,
} from "@/lib/mockApi";
import type { AuthUser, CartItem } from "@/lib/types";
import type { Product } from "@/lib/products";

const CART_KEY_PREFIX = "shopease_cart_";
const GUEST_CART_KEY = "shopease_cart_guest";

function cartKey(user: AuthUser | null) {
  return user ? `${CART_KEY_PREFIX}${user.id}` : GUEST_CART_KEY;
}

interface AppContextValue {
  user: AuthUser | null;
  token: string | null;
  authLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;

  cart: CartItem[];
  addToCart: (p: Product, qty?: number) => void;
  updateQty: (productId: string, qty: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Hydrate auth + cart from localStorage on mount (client only).
  useEffect(() => {
    const { token, user } = getStoredAuth();
    setToken(token);
    setUser(user);
    setAuthLoading(false);
    try {
      const raw = localStorage.getItem(cartKey(user));
      if (raw) setCart(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  // Persist cart whenever it changes.
  useEffect(() => {
    if (authLoading) return;
    try {
      localStorage.setItem(cartKey(user), JSON.stringify(cart));
    } catch {
      /* ignore */
    }
  }, [cart, user, authLoading]);

  const login = useCallback(async (email: string, password: string) => {
    const { token, user } = await apiLogin({ email, password });
    setToken(token);
    setUser(user);
    // Move guest cart to user cart on first login.
    try {
      const guest = localStorage.getItem(GUEST_CART_KEY);
      if (guest && guest !== "[]") {
        localStorage.setItem(`${CART_KEY_PREFIX}${user.id}`, guest);
        localStorage.removeItem(GUEST_CART_KEY);
        setCart(JSON.parse(guest));
      } else {
        const raw = localStorage.getItem(`${CART_KEY_PREFIX}${user.id}`);
        setCart(raw ? JSON.parse(raw) : []);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const register = useCallback(
    async (email: string, password: string, name: string) => {
      const { token, user } = await apiRegister({ email, password, name });
      setToken(token);
      setUser(user);
    },
    [],
  );

  const logout = useCallback(() => {
    apiLogout();
    setToken(null);
    setUser(null);
    setCart([]);
  }, []);

  const addToCart = useCallback((p: Product, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === p.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === p.id ? { ...i, quantity: i.quantity + qty } : i,
        );
      }
      return [...prev, { product: p, quantity: qty }];
    });
  }, []);

  const updateQty = useCallback((productId: string, qty: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.product.id === productId ? { ...i, quantity: qty } : i))
        .filter((i) => i.quantity > 0),
    );
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartCount = useMemo(
    () => cart.reduce((s, i) => s + i.quantity, 0),
    [cart],
  );
  const cartSubtotal = useMemo(
    () => cart.reduce((s, i) => s + i.product.price * i.quantity, 0),
    [cart],
  );

  const value: AppContextValue = {
    user,
    token,
    authLoading,
    login,
    register,
    logout,
    cart,
    addToCart,
    updateQty,
    removeFromCart,
    clearCart,
    cartCount,
    cartSubtotal,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}

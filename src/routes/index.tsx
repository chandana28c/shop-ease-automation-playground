import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiListProducts } from "@/lib/mockApi";
import { CATEGORIES } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { useApp } from "@/context/AppContext";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "ShopEase — Modern E-Commerce" },
      {
        name: "description",
        content: "Curated essentials across electronics, apparel, home, and books. Fast checkout, easy returns.",
      },
    ],
  }),
});

function Home() {
  const { addToCart } = useApp();
  const { data: featured = [], isLoading } = useQuery({
    queryKey: ["products", "featured"],
    queryFn: () => apiListProducts({ sort: "rating-desc" }).then((p) => p.slice(0, 6)),
  });

  return (
    <div data-testid="home-page" className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-background to-accent/15"
        />
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:py-20 md:grid-cols-2 md:items-center">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
              New season · Free shipping over ₹2,000
            </p>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
              Things worth <span className="text-primary">buying</span>,
              <br />delivered with care.
            </h1>
            <p className="mt-5 max-w-md text-base text-muted-foreground">
              Hand-picked products that punch above their weight. Browse the shop,
              fill your cart, and check out in seconds.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/products"
                data-testid="hero-shop-btn"
                className="rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              >
                Browse the shop
              </Link>
              <Link
                to="/products"
                search={{ category: "electronics" } as never}
                className="rounded-md border border-input bg-background px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                Today's deals
              </Link>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900"
              alt="Curated lifestyle products on display"
              className="aspect-[4/3] w-full rounded-2xl object-cover shadow-xl"
              loading="eager"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="mb-6 text-2xl font-semibold">Shop by category</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((c) => (
            <div
              key={c.slug}
              data-testid={`category-card-${c.slug}`}
              className="rounded-xl border border-border bg-card p-5 transition-all hover:border-primary hover:shadow-md"
            >
              <Link
                to="/products"
                search={{ category: c.slug } as never}
                className="text-base font-semibold text-foreground hover:text-primary"
              >
                {c.label} →
              </Link>
              <ul className="mt-3 space-y-1 text-sm">
                {c.subcategories.map((s) => (
                  <li key={s.slug}>
                    <Link
                      to="/products"
                      search={{ category: c.slug, subcategory: s.slug } as never}
                      data-testid={`subcategory-link-${s.slug}`}
                      className="text-muted-foreground hover:text-primary"
                    >
                      {s.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-semibold">Featured products</h2>
          <Link to="/products" className="text-sm font-medium text-primary hover:underline">
            View all →
          </Link>
        </div>
        {isLoading ? (
          <div data-testid="loading-spinner" className="py-16 text-center text-muted-foreground">
            Loading products…
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <Link
                key={p.id}
                to="/products/$id"
                params={{ id: p.id }}
                data-testid="product-card"
                data-product-id={p.id}
                className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary hover:shadow-md"
              >
                <div className="aspect-[4/3] overflow-hidden bg-secondary">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="line-clamp-1 font-medium">{p.name}</h3>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="font-semibold text-primary" data-testid="product-price">
                      {formatPrice(p.price)}
                    </span>
                    <span className="text-xs text-muted-foreground">★ {p.rating.toFixed(1)}</span>
                  </div>
                  <button
                    type="button"
                    data-testid="add-to-cart-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addToCart(p, 1);
                      toast.success("Added to cart");
                    }}
                    className="mt-3 w-full rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Add to cart
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

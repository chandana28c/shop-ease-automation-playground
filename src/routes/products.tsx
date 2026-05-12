import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { apiListProducts } from "@/lib/mockApi";
import {
  CATEGORIES,
  SUBCATEGORY_TO_CATEGORY,
  type Category,
  type Subcategory,
} from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { useApp } from "@/context/AppContext";

interface Search {
  q?: string;
  category?: Category | "all";
  subcategory?: Subcategory | "all";
  sort?: "price-asc" | "price-desc" | "rating-desc";
}

const ALL_SUBCATS: Subcategory[] = Object.keys(SUBCATEGORY_TO_CATEGORY) as Subcategory[];

export const Route = createFileRoute("/products")({
  component: ProductsPage,
  validateSearch: (s: Record<string, unknown>): Search => {
    const cat =
      s.category === "electronics" ||
      s.category === "apparel" ||
      s.category === "home" ||
      s.category === "books" ||
      s.category === "all"
        ? (s.category as Search["category"])
        : "all";
    const sub = typeof s.subcategory === "string" && (ALL_SUBCATS as string[]).includes(s.subcategory)
      ? (s.subcategory as Subcategory)
      : s.subcategory === "all"
        ? "all"
        : undefined;
    return {
      q: typeof s.q === "string" ? s.q : undefined,
      category: cat,
      subcategory: sub,
      sort:
        s.sort === "price-asc" || s.sort === "price-desc" || s.sort === "rating-desc"
          ? (s.sort as Search["sort"])
          : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "All Products — ShopEase" },
      { name: "description", content: "Search and filter our full catalog." },
    ],
  }),
});

function ProductsPage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const { addToCart } = useApp();
  const [searchInput, setSearchInput] = useState(search.q ?? "");

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: [
      "products",
      search.q ?? "",
      search.category ?? "all",
      search.subcategory ?? "all",
      search.sort ?? "default",
    ],
    queryFn: () =>
      apiListProducts({
        search: search.q,
        category: search.category,
        subcategory: search.subcategory,
        sort: search.sort,
      }),
  });

  const setSearch = (next: Partial<Search>) =>
    navigate({ search: (prev: Search) => ({ ...prev, ...next }) });

  // Subcategory options for the currently selected category.
  const activeCategory = CATEGORIES.find((c) => c.slug === search.category);
  const subOptions = activeCategory?.subcategories ?? [];

  const headline = useMemo(() => {
    if (search.q) return `Results for "${search.q}"`;
    if (search.subcategory && search.subcategory !== "all") {
      const subLabel = CATEGORIES.flatMap((c) => c.subcategories).find(
        (s) => s.slug === search.subcategory,
      )?.label;
      if (subLabel) return subLabel;
    }
    if (search.category && search.category !== "all") {
      return CATEGORIES.find((c) => c.slug === search.category)?.label ?? "Products";
    }
    return "All products";
  }, [search]);

  const fallbackImage = "https://loremflickr.com/600/450/product?lock=404";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 animate-fade-in" data-testid="products-page">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="text-3xl font-bold">{headline}</h1>
        <p className="text-sm text-muted-foreground" data-testid="results-count">
          {isLoading ? "…" : `${products.length} product${products.length === 1 ? "" : "s"}`}
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSearch({ q: searchInput || undefined });
        }}
        className="mb-6 flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:flex-wrap"
      >
        <input
          type="search"
          placeholder="Search products…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          data-testid="search-input"
          aria-label="Search products"
          className="w-full flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
        />
        <select
          value={search.category ?? "all"}
          onChange={(e) =>
            setSearch({
              category: e.target.value as Search["category"],
              subcategory: undefined,
            })
          }
          data-testid="category-select"
          aria-label="Filter by category"
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="all">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>{c.label}</option>
          ))}
        </select>
        {subOptions.length > 0 && (
          <select
            value={search.subcategory ?? "all"}
            onChange={(e) =>
              setSearch({ subcategory: e.target.value as Search["subcategory"] })
            }
            data-testid="subcategory-select"
            aria-label="Filter by subcategory"
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="all">All subcategories</option>
            {subOptions.map((s) => (
              <option key={s.slug} value={s.slug}>{s.label}</option>
            ))}
          </select>
        )}
        <select
          value={search.sort ?? ""}
          onChange={(e) =>
            setSearch({ sort: (e.target.value || undefined) as Search["sort"] })
          }
          data-testid="sort-select"
          aria-label="Sort products"
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">Sort: Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating-desc">Top Rated</option>
        </select>
        <button
          type="submit"
          data-testid="search-submit-btn"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Search
        </button>
      </form>

      {isLoading && (
        <div data-testid="loading-spinner" className="py-16 text-center text-muted-foreground">
          Loading products…
        </div>
      )}
      {error && (
        <div data-testid="error-message" className="rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          {(error as Error).message}
        </div>
      )}
      {!isLoading && products.length === 0 && (
        <div
          data-testid="no-results"
          className="rounded-xl border border-border bg-card py-16 text-center text-muted-foreground"
        >
          No products match your filters.
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" data-testid="product-grid">
        {products.map((p) => (
          <Link
            key={p.id}
            to="/products/$id"
            params={{ id: p.id }}
            data-testid="product-card"
            data-product-id={p.id}
            data-product-name={p.name}
            className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary hover:shadow-md"
          >
            <div className="aspect-[4/3] overflow-hidden bg-secondary">
              <img
                src={p.image}
                alt={p.name}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = fallbackImage;
                }}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                {CATEGORIES.find((c) => c.slug === p.category)?.label}
                {" · "}
                {CATEGORIES.flatMap((c) => c.subcategories).find((s) => s.slug === p.subcategory)?.label}
              </p>
              <h3 className="mt-1 line-clamp-1 font-medium" data-testid="product-name">{p.name}</h3>
              <div className="mt-2 flex items-center justify-between">
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
    </div>
  );
}

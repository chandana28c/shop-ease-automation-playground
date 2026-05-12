import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiGetProduct } from "@/lib/mockApi";
import { useApp } from "@/context/AppContext";
import { formatPrice } from "@/lib/format";
import { CATEGORIES } from "@/lib/products";

export const Route = createFileRoute("/products/$id")({
  component: ProductDetail,
  head: ({ params }) => ({
    meta: [
      { title: `Product — ShopEase` },
      { name: "description", content: `Product detail for ${params.id} on ShopEase.` },
    ],
  }),
});

function ProductDetail() {
  const { id } = Route.useParams();
  const { addToCart } = useApp();
  const router = useRouter();
  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => apiGetProduct(id),
  });

  if (isLoading) {
    return (
      <div data-testid="loading-spinner" className="mx-auto max-w-6xl px-4 py-16 text-center text-muted-foreground">
        Loading product…
      </div>
    );
  }
  if (error || !product) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center">
        <p data-testid="error-message" className="text-destructive">
          {(error as Error)?.message ?? "Product not found"}
        </p>
        <Link to="/products" className="mt-4 inline-block text-primary hover:underline">
          ← Back to shop
        </Link>
      </div>
    );
  }

  const category = CATEGORIES.find((c) => c.slug === product.category)?.label ?? product.category;
  const fallbackImage = "https://loremflickr.com/600/450/product?lock=404";

  return (
    <div
      className="mx-auto grid max-w-6xl gap-10 px-4 py-10 md:grid-cols-2 animate-fade-in"
      data-testid="product-detail-page"
      data-product-id={product.id}
    >
      <div>
        <img
          src={product.image}
          alt={product.name}
          onError={(e) => {
            e.currentTarget.src = fallbackImage;
          }}
          className="aspect-[4/3] w-full rounded-2xl border border-border object-cover shadow-sm"
          data-testid="product-image"
        />
      </div>
      <div className="flex flex-col">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">{category}</p>
        <h1 className="mt-1 text-3xl font-bold sm:text-4xl" data-testid="product-name">
          {product.name}
        </h1>
        <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
          <span>★ {product.rating.toFixed(1)}</span>
          <span>·</span>
          <span>{product.stock} in stock</span>
        </div>
        <p className="mt-4 text-3xl font-semibold text-primary" data-testid="product-price">
          {formatPrice(product.price)}
        </p>
        <p className="mt-4 leading-relaxed text-foreground/80" data-testid="product-description">
          {product.description}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            data-testid="add-to-cart-btn"
            onClick={() => {
              addToCart(product, 1);
              toast.success("Added to cart");
            }}
            className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            Add to cart
          </button>
          <button
            type="button"
            data-testid="buy-now-btn"
            onClick={() => {
              addToCart(product, 1);
              router.navigate({ to: "/cart" });
            }}
            className="rounded-md border border-input bg-background px-6 py-3 text-sm font-semibold text-foreground hover:bg-secondary"
          >
            Buy now
          </button>
        </div>
      </div>
    </div>
  );
}

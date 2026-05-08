export type Category = "electronics" | "apparel" | "home" | "books";

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  rating: number;
  stock: number;
  image: string;
  description: string;
}

export const CATEGORIES: { slug: Category; label: string }[] = [
  { slug: "electronics", label: "Electronics" },
  { slug: "apparel", label: "Apparel" },
  { slug: "home", label: "Home" },
  { slug: "books", label: "Books" },
];

export const PRODUCTS: Product[] = [
  { id: "p1", name: "Wireless Noise-Cancelling Headphones", category: "electronics", price: 199.99, rating: 4.7, stock: 25, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600", description: "Immersive sound with 40-hour battery life and adaptive noise cancelling." },
  { id: "p2", name: "4K Action Camera", category: "electronics", price: 149.0, rating: 4.4, stock: 40, image: "https://images.unsplash.com/photo-1526178613552-2b45c6c302f0?w=600", description: "Capture every adventure in stunning 4K resolution with built-in stabilization." },
  { id: "p3", name: "Smart Fitness Watch", category: "electronics", price: 89.5, rating: 4.2, stock: 60, image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600", description: "Heart-rate, sleep tracking and 7-day battery in a sleek aluminum case." },
  { id: "p4", name: "Mechanical Keyboard", category: "electronics", price: 129.0, rating: 4.8, stock: 18, image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600", description: "Hot-swappable switches, RGB backlight, and a satisfying tactile feel." },
  { id: "p5", name: "Portable Bluetooth Speaker", category: "electronics", price: 59.99, rating: 4.3, stock: 80, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600", description: "Waterproof speaker with 24-hour playtime and rich 360° sound." },

  { id: "p6", name: "Classic Cotton Tee", category: "apparel", price: 19.99, rating: 4.1, stock: 200, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600", description: "Soft, breathable 100% organic cotton tee that goes with everything." },
  { id: "p7", name: "Slim-Fit Denim Jeans", category: "apparel", price: 64.5, rating: 4.0, stock: 120, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600", description: "Stretch-blend denim with a modern slim taper and reinforced stitching." },
  { id: "p8", name: "Lightweight Running Jacket", category: "apparel", price: 89.0, rating: 4.5, stock: 45, image: "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600", description: "Wind-resistant shell with reflective trim and zippered side pockets." },
  { id: "p9", name: "Leather Sneakers", category: "apparel", price: 119.0, rating: 4.6, stock: 35, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600", description: "Hand-finished leather sneakers built for comfort and longevity." },
  { id: "p10", name: "Wool Beanie", category: "apparel", price: 24.0, rating: 4.2, stock: 150, image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600", description: "Warm merino-wool beanie with a soft ribbed knit." },

  { id: "p11", name: "Ceramic Pour-Over Coffee Set", category: "home", price: 42.0, rating: 4.7, stock: 30, image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600", description: "Hand-thrown ceramic dripper paired with a matching server." },
  { id: "p12", name: "Linen Throw Blanket", category: "home", price: 78.0, rating: 4.4, stock: 22, image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600", description: "Stonewashed linen blanket that gets softer with every wash." },
  { id: "p13", name: "Scented Soy Candle", category: "home", price: 28.0, rating: 4.3, stock: 100, image: "https://images.unsplash.com/photo-1602874801007-aa2b2ee18c9a?w=600", description: "Hand-poured soy candle with notes of sandalwood and vanilla." },
  { id: "p14", name: "Cast Iron Skillet", category: "home", price: 49.99, rating: 4.9, stock: 50, image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600", description: "Pre-seasoned 12-inch skillet — a lifelong kitchen companion." },
  { id: "p15", name: "Modern Desk Lamp", category: "home", price: 65.0, rating: 4.2, stock: 40, image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600", description: "Adjustable LED desk lamp with warm-to-cool color temperature." },

  { id: "p16", name: "The Pragmatic Coder", category: "books", price: 32.5, rating: 4.8, stock: 70, image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600", description: "A modern guide to writing code that is clear, robust, and joyful." },
  { id: "p17", name: "Atlas of the Stars", category: "books", price: 45.0, rating: 4.6, stock: 25, image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600", description: "A breathtaking visual journey through our galaxy and beyond." },
  { id: "p18", name: "The Quiet Garden", category: "books", price: 18.0, rating: 4.3, stock: 90, image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600", description: "A meditative novel about slowing down and finding wonder." },
  { id: "p19", name: "Cooking with Fire", category: "books", price: 38.0, rating: 4.5, stock: 40, image: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=600", description: "Recipes and techniques for live-fire cooking at home." },
  { id: "p20", name: "Designing for Humans", category: "books", price: 29.99, rating: 4.4, stock: 55, image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=600", description: "Field-tested principles for creating products people love." },
];

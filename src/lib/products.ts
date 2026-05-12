export type Category = "electronics" | "apparel" | "home" | "books";

export type Subcategory =
  // electronics
  | "mobiles" | "laptops" | "audio"
  // apparel
  | "men" | "women" | "kids"
  // home
  | "kitchen" | "decor" | "furniture"
  // books
  | "fiction" | "nonfiction" | "education";

export interface Product {
  id: string;
  name: string;
  category: Category;
  subcategory: Subcategory;
  price: number; // INR
  rating: number;
  stock: number;
  image: string;
  description: string;
}

export const CATEGORIES: {
  slug: Category;
  label: string;
  subcategories: { slug: Subcategory; label: string }[];
}[] = [
  {
    slug: "electronics",
    label: "Electronics",
    subcategories: [
      { slug: "mobiles", label: "Mobiles" },
      { slug: "laptops", label: "Laptops" },
      { slug: "audio", label: "Audio" },
    ],
  },
  {
    slug: "apparel",
    label: "Apparel",
    subcategories: [
      { slug: "men", label: "Men's Wear" },
      { slug: "women", label: "Women's Wear" },
      { slug: "kids", label: "Kids' Wear" },
    ],
  },
  {
    slug: "home",
    label: "Home",
    subcategories: [
      { slug: "kitchen", label: "Kitchen" },
      { slug: "decor", label: "Decor" },
      { slug: "furniture", label: "Furniture" },
    ],
  },
  {
    slug: "books",
    label: "Books",
    subcategories: [
      { slug: "fiction", label: "Fiction" },
      { slug: "nonfiction", label: "Non-Fiction" },
      { slug: "education", label: "Education" },
    ],
  },
];

export const SUBCATEGORY_TO_CATEGORY: Record<Subcategory, Category> = {
  mobiles: "electronics", laptops: "electronics", audio: "electronics",
  men: "apparel", women: "apparel", kids: "apparel",
  kitchen: "home", decor: "home", furniture: "home",
  fiction: "books", nonfiction: "books", education: "books",
};

// ---------- Product generator ----------
// Curated Unsplash photo IDs per subcategory so every product gets a
// topical, real photograph instead of a random/irrelevant one.
const UNSPLASH_POOL: Record<Subcategory, string[]> = {
  mobiles: [
    "1511707171634-5f897ff02aa9", "1592899677977-9c10ca588bbd",
    "1598327105666-5b89351aff97", "1565849904461-04a58ad377e0",
    "1574944985070-8f3ebc6b79d2", "1556656793-08538906a9f8",
    "1580910051074-3eb694886505", "1605236453806-6ff36851218e",
    "1546054454-aa26e2b734c7", "1512054502232-10a0a035d672",
  ],
  laptops: [
    "1496181133206-80ce9b88a853", "1517336714731-489689fd1ca8",
    "1541807084-5c52b6b3adef", "1593642632559-0c6d3fc62b89",
    "1588872657578-7efd1f1555ed", "1531297484001-80022131f5a1",
    "1484788984921-03950022c9ef", "1525547719571-a2d4ac8945e2",
  ],
  audio: [
    "1505740420928-5e560c06d30e", "1583394838336-acd977736f90",
    "1546435770-a3e426bf472b", "1484704849700-f032a568e944",
    "1558756520-22cfe5d382ca", "1572569511254-d8f925fe2cbb",
    "1610465299996-30f240ac2b1c", "1487215078519-e21cc028cb29",
  ],
  men: [
    "1602810318383-e386cc2a3ccf", "1521572163474-6864f9cf17ab",
    "1593030761757-71fae45fa0e7", "1516257984-b1b4d707412e",
    "1591047139829-d91aecb6caea", "1542272604-787c3835535d",
    "1552374196-1ab2a1c593e8", "1507003211169-0a1dd7228f2d",
    "1490578474895-699cd4e2cf59", "1620799140408-edc6dcb6d633",
  ],
  women: [
    "1490481651871-ab68de25d43d", "1612336307429-8a898d10e223",
    "1539109136881-3be0616acf4b", "1483985988355-763728e1935b",
    "1469334031218-e382a71b716b", "1496747611176-843222e1e57c",
    "1581044777550-4cfa60707c03", "1551489186-cf8726f514f8",
    "1503342217505-b0a15ec3261c", "1495121605193-b116b5b9c5fe",
  ],
  kids: [
    "1622290291468-a28f7a7dc6a8", "1518831959646-742c3a14ebf7",
    "1503944583220-79d8926ad5e2", "1519238263530-99bdd11df2ea",
    "1565084888279-aca607ecce0c", "1543854704-783ed0a6b75b",
    "1514090458221-65bb69cf63e6", "1543702719-15c40e9d65a4",
  ],
  kitchen: [
    "1556909114-f6e7ad7d3136", "1565538810643-b5bdb714032a",
    "1574781330855-d0db8cc6a79c", "1583778176476-4a8b02a64c01",
    "1591291621164-2c6367723315", "1556910103-1c02745aae4d",
    "1585155770447-2f66e2a397b5", "1592156328196-1cbb7a91ef8a",
    "1517248135467-4c7edcad34c4", "1556910637-29d804023fac",
  ],
  decor: [
    "1513519245088-0e12902e5a38", "1503602642458-232111445657",
    "1493663284031-b7e3aefcae8e", "1519710164239-da123dc03ef4",
    "1567225557594-88d73e55f2cb", "1556228720-195a672e8a03",
    "1542621334-a254cf47733d", "1505691938895-1758d7feb511",
  ],
  furniture: [
    "1555041469-a586c61ea9bc", "1567538096630-e0c55bd6374c",
    "1505693416388-ac5ce068fe85", "1540574163026-643ea20ade25",
    "1493663284031-b7e3aefcae8e", "1538688525198-9b88f6f53126",
    "1549497538-303791108f95", "1592078615290-033ee584e267",
  ],
  fiction: [
    "1543002588-bfa74002ed7e", "1512820790803-83ca734da794",
    "1495446815901-a7297e633e8d", "1474932430478-367dbb6832c1",
    "1519682337058-a94d519337bc", "1497633762265-9d179a990aa6",
    "1532012197267-da84d127e765", "1456513080510-7bf3a84b82f8",
  ],
  nonfiction: [
    "1544716278-ca5e3f4abd8c", "1530538987395-032d1800fdd4",
    "1491841550275-ad7854e35ca6", "1518373714866-3f1478910cc0",
    "1524995997946-a1c2e315a42f", "1457369804613-52c61a468e7d",
    "1535905557558-afc4877a26fc", "1488190211105-8b0e65b80b4e",
  ],
  education: [
    "1497633762265-9d179a990aa6", "1456513080510-7bf3a84b82f8",
    "1481627834876-b7833e8f5570", "1503676260728-1c00da094a0b",
    "1509062522246-3755977927d7", "1456406644174-8ddd4cd52a06",
    "1532153975070-2e9ab71f1b14", "1571260899304-425eee4c7efc",
  ],
};

const img = (sub: Subcategory, index: number) => {
  const pool = UNSPLASH_POOL[sub];
  const id = pool[index % pool.length];
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=600&h=450&q=80`;
};

interface Seed {
  name: string;
  price: number; // INR
  rating: number;
  description: string;
  keyword: string;
}

const SEEDS: Record<Subcategory, Seed[]> = {
  // ===== ELECTRONICS =====
  mobiles: [
    { name: "Galaxy Pulse 5G", price: 24999, rating: 4.5, description: "6.5\" AMOLED, 5G, 5000mAh battery and 50MP triple camera.", keyword: "smartphone" },
    { name: "Pixel Lite 8", price: 32999, rating: 4.6, description: "Pure Android experience with class-leading camera and 7 years of updates.", keyword: "phone" },
    { name: "iVision Pro 15", price: 119999, rating: 4.8, description: "Titanium build, ProMotion display and pro-grade camera system.", keyword: "iphone" },
    { name: "OnePulse Nord", price: 27499, rating: 4.4, description: "Snapdragon 7, 120Hz display and 67W fast charging.", keyword: "mobile" },
    { name: "Redmi Note Ultra", price: 17999, rating: 4.3, description: "108MP camera, dual stereo speakers and a slim build.", keyword: "smartphone+android" },
    { name: "Realme Spark 12", price: 14499, rating: 4.2, description: "Budget hero with 90Hz display and 50MP AI camera.", keyword: "phone+device" },
    { name: "Vivo Aurora", price: 21999, rating: 4.3, description: "Curved AMOLED with 80W flash charge and AI portrait mode.", keyword: "vivo+phone" },
    { name: "Oppo Reno Slim", price: 28999, rating: 4.4, description: "Pro photographer's pocket camera with 4K cinematic mode.", keyword: "oppo+phone" },
    { name: "Asus ROG Phone 8", price: 79999, rating: 4.7, description: "144Hz gaming display, AirTriggers and active cooling.", keyword: "gaming+phone" },
    { name: "Motorola Edge X", price: 31999, rating: 4.3, description: "Curved pOLED screen and a near-stock Android experience.", keyword: "motorola+phone" },
    { name: "Nothing Phone 2a", price: 23999, rating: 4.4, description: "Glyph interface, clean OS, transparent industrial design.", keyword: "nothing+phone" },
    { name: "iVision SE", price: 47999, rating: 4.5, description: "Compact 4.7\" iPhone with the latest A-series chip.", keyword: "iphone+se" },
    { name: "Galaxy Z Flip", price: 89999, rating: 4.5, description: "Foldable AMOLED, IPX8 rated and FlexCam productivity.", keyword: "foldable+phone" },
    { name: "Honor Magic 6", price: 54999, rating: 4.4, description: "Quad-curved display with a periscope telephoto camera.", keyword: "honor+phone" },
    { name: "Lava Blaze Curve", price: 12999, rating: 4.1, description: "Curved AMOLED at a budget price with stock Android.", keyword: "phone+budget" },
    { name: "Tecno Camon 30", price: 18499, rating: 4.2, description: "Sony sensor selfie phone with cinematic vlogging modes.", keyword: "tecno+phone" },
    { name: "Infinix Note Stylus", price: 16499, rating: 4.2, description: "Built-in stylus and AMOLED for note-takers on a budget.", keyword: "phone+stylus" },
    { name: "Poco F6 Pro", price: 29999, rating: 4.5, description: "Flagship Snapdragon performance at an aggressive price.", keyword: "poco+phone" },
    { name: "Galaxy A55", price: 33999, rating: 4.4, description: "Premium build, OIS camera and crisp Super AMOLED panel.", keyword: "samsung+phone" },
    { name: "iVision 14 Plus", price: 79999, rating: 4.6, description: "6.7\" Super Retina display, all-day battery and Dynamic Island.", keyword: "iphone+14" },
  ],
  laptops: [
    { name: "MacBook Air 13 M3", price: 114999, rating: 4.8, description: "Fanless M3 silicon, 18-hour battery and Liquid Retina display.", keyword: "macbook" },
    { name: "Dell XPS 14", price: 144999, rating: 4.6, description: "OLED touch display in a CNC aluminium chassis.", keyword: "dell+laptop" },
    { name: "HP Spectre x360", price: 134999, rating: 4.5, description: "2-in-1 convertible with stylus support and 2.8K OLED.", keyword: "hp+laptop" },
    { name: "Lenovo Yoga 9i", price: 129999, rating: 4.5, description: "Rotating soundbar hinge and Intel Evo certified performance.", keyword: "lenovo+yoga" },
    { name: "ASUS ROG Zephyrus G14", price: 159999, rating: 4.7, description: "Compact 14\" gaming powerhouse with QHD 165Hz screen.", keyword: "gaming+laptop" },
    { name: "Acer Swift Go 14", price: 69999, rating: 4.3, description: "Lightweight everyday laptop with AI-powered Copilot key.", keyword: "acer+laptop" },
    { name: "MSI Stealth 16 AI", price: 219999, rating: 4.6, description: "Studio laptop with discrete RTX graphics and OLED panel.", keyword: "msi+laptop" },
    { name: "Microsoft Surface Laptop 7", price: 124999, rating: 4.4, description: "Snapdragon X Elite ARM performance with all-day battery.", keyword: "surface+laptop" },
    { name: "Framework Laptop 13", price: 119999, rating: 4.5, description: "Repairable, upgradable modular laptop loved by tinkerers.", keyword: "laptop+modular" },
    { name: "Apple MacBook Pro 14 M3 Pro", price: 199999, rating: 4.9, description: "ProMotion mini-LED, M3 Pro and astonishing battery life.", keyword: "macbook+pro" },
  ],
  audio: [
    { name: "Sony WH-1000XM5", price: 27999, rating: 4.8, description: "Industry-leading noise cancellation with 30hr playback.", keyword: "headphones" },
    { name: "Bose QuietComfort Ultra", price: 31999, rating: 4.7, description: "Immersive spatial audio with plush over-ear comfort.", keyword: "bose+headphones" },
    { name: "AirPods Pro 2", price: 22999, rating: 4.7, description: "Adaptive Audio and Transparency mode in a magic case.", keyword: "airpods" },
    { name: "Sennheiser Momentum 4", price: 26999, rating: 4.6, description: "Audiophile-tuned wireless with 60-hour battery.", keyword: "sennheiser" },
    { name: "JBL Charge 5", price: 13999, rating: 4.5, description: "Rugged Bluetooth speaker that doubles as a power bank.", keyword: "jbl+speaker" },
    { name: "Marshall Stanmore III", price: 32999, rating: 4.6, description: "Iconic guitar-amp styling with room-filling sound.", keyword: "marshall+speaker" },
    { name: "Sonos Era 100", price: 24999, rating: 4.5, description: "Wireless smart speaker with Trueplay room tuning.", keyword: "sonos" },
    { name: "Noise Cancelling Earbuds Z", price: 4999, rating: 4.2, description: "Active noise cancellation under five thousand rupees.", keyword: "earbuds" },
    { name: "Boat Stone 1500F", price: 6499, rating: 4.3, description: "Outdoor party speaker with RGB lights and IPX7 rating.", keyword: "boat+speaker" },
    { name: "Audio-Technica ATH-M50x", price: 11999, rating: 4.7, description: "Studio-reference closed-back monitors for producers.", keyword: "studio+headphones" },
  ],
  // ===== APPAREL =====
  men: [
    { name: "Men's Slim Fit Shirt", price: 1499, rating: 4.3, description: "Wrinkle-free poplin shirt for office and casual wear.", keyword: "mens+shirt" },
    { name: "Men's Chino Trousers", price: 1799, rating: 4.2, description: "Stretch cotton chinos with tapered modern fit.", keyword: "chinos" },
    { name: "Men's Hooded Sweatshirt", price: 1999, rating: 4.4, description: "Heavyweight fleece hoodie with kangaroo pocket.", keyword: "mens+hoodie" },
    { name: "Men's Denim Jeans", price: 2499, rating: 4.3, description: "Slim-tapered indigo wash with reinforced stitching.", keyword: "mens+jeans" },
    { name: "Men's Polo T-Shirt", price: 1199, rating: 4.2, description: "Soft pique cotton polo with classic two-button placket.", keyword: "polo+shirt" },
    { name: "Men's Bomber Jacket", price: 3499, rating: 4.4, description: "Padded MA-1 bomber with ribbed cuffs and hem.", keyword: "bomber+jacket" },
    { name: "Men's Running Shorts", price: 999, rating: 4.1, description: "Lightweight quick-dry shorts with built-in liner.", keyword: "running+shorts" },
    { name: "Men's Leather Belt", price: 1299, rating: 4.3, description: "Full-grain leather belt with brushed steel buckle.", keyword: "leather+belt" },
    { name: "Men's Cotton Tee", price: 599, rating: 4.0, description: "Soft 100% combed cotton crew-neck tee.", keyword: "mens+tshirt" },
    { name: "Men's Linen Kurta", price: 2299, rating: 4.5, description: "Breathable linen kurta with mandarin collar.", keyword: "kurta" },
    { name: "Men's Office Blazer", price: 4999, rating: 4.5, description: "Tailored single-breasted blazer in stretch wool.", keyword: "blazer" },
    { name: "Men's Cargo Pants", price: 2199, rating: 4.2, description: "Utility cargos with reinforced knees and side pockets.", keyword: "cargo+pants" },
    { name: "Men's Sneakers", price: 3299, rating: 4.4, description: "Cushioned everyday sneakers with rubber outsole.", keyword: "mens+sneakers" },
    { name: "Men's Formal Shoes", price: 3799, rating: 4.3, description: "Genuine leather Oxford shoes with welted construction.", keyword: "formal+shoes" },
    { name: "Men's Track Pants", price: 1399, rating: 4.2, description: "Tapered jersey track pants with zipped pockets.", keyword: "trackpants" },
    { name: "Men's Wool Overcoat", price: 6999, rating: 4.6, description: "Long wool-blend overcoat for cold winter days.", keyword: "overcoat" },
    { name: "Men's Boxer Briefs (Pack of 3)", price: 899, rating: 4.3, description: "Soft cotton stretch briefs in classic colours.", keyword: "boxer+briefs" },
    { name: "Men's Aviator Sunglasses", price: 1599, rating: 4.2, description: "Polarized lenses in a timeless metal aviator frame.", keyword: "sunglasses+men" },
    { name: "Men's Watch — Steel", price: 4499, rating: 4.5, description: "Stainless steel automatic with sapphire crystal.", keyword: "watch+men" },
    { name: "Men's Backpack", price: 2199, rating: 4.3, description: "Padded laptop backpack with USB charging port.", keyword: "mens+backpack" },
  ],
  women: [
    { name: "Women's A-Line Dress", price: 2299, rating: 4.4, description: "Flowy mid-length A-line dress in stretch crepe.", keyword: "womens+dress" },
    { name: "Women's High-Waist Jeans", price: 2499, rating: 4.3, description: "Skinny-fit high-rise jeans with comfort stretch.", keyword: "womens+jeans" },
    { name: "Women's Kurti", price: 1499, rating: 4.4, description: "Hand-block printed cotton kurti with side slits.", keyword: "kurti" },
    { name: "Women's Floral Top", price: 1199, rating: 4.2, description: "Flutter-sleeve floral blouse in rayon.", keyword: "womens+top" },
    { name: "Women's Cardigan", price: 2199, rating: 4.4, description: "Soft cable-knit open-front cardigan.", keyword: "cardigan" },
    { name: "Women's Saree", price: 3499, rating: 4.6, description: "Soft Banarasi-inspired silk saree with zari border.", keyword: "saree" },
    { name: "Women's Leggings", price: 899, rating: 4.2, description: "High-rise compression leggings with hidden pocket.", keyword: "leggings" },
    { name: "Women's Trench Coat", price: 4999, rating: 4.5, description: "Classic double-breasted trench with belted waist.", keyword: "trench+coat" },
    { name: "Women's Maxi Skirt", price: 1799, rating: 4.3, description: "Tiered maxi skirt with elasticated waistband.", keyword: "maxi+skirt" },
    { name: "Women's Heels", price: 2999, rating: 4.3, description: "Block-heel pumps with cushioned insole.", keyword: "womens+heels" },
    { name: "Women's Sneakers", price: 2799, rating: 4.4, description: "Soft-knit upper sneakers with bouncy midsole.", keyword: "womens+sneakers" },
    { name: "Women's Handbag", price: 2599, rating: 4.4, description: "Vegan-leather satchel with multiple inner compartments.", keyword: "handbag" },
    { name: "Women's Pearl Earrings", price: 1299, rating: 4.5, description: "Freshwater pearl drops with sterling silver hooks.", keyword: "earrings" },
    { name: "Women's Yoga Set", price: 1899, rating: 4.4, description: "Buttery-soft yoga top and high-rise leggings set.", keyword: "yoga+set" },
    { name: "Women's Anarkali Suit", price: 3999, rating: 4.6, description: "Embroidered floor-length anarkali with dupatta.", keyword: "anarkali" },
    { name: "Women's Cotton Shirt", price: 1599, rating: 4.3, description: "Crisp poplin button-down with relaxed boyfriend fit.", keyword: "womens+shirt" },
    { name: "Women's Sunglasses", price: 1799, rating: 4.2, description: "Oversized cat-eye sunglasses with UV400 lenses.", keyword: "sunglasses+women" },
    { name: "Women's Lehenga", price: 7999, rating: 4.7, description: "Mirror-work bridal lehenga with embroidered choli.", keyword: "lehenga" },
    { name: "Women's Wristlet Watch", price: 3499, rating: 4.4, description: "Slim rose-gold watch with mother-of-pearl dial.", keyword: "watch+women" },
    { name: "Women's Tote Bag", price: 1999, rating: 4.3, description: "Spacious canvas tote with leather handles.", keyword: "tote+bag" },
  ],
  kids: [
    { name: "Kids' Graphic Tee", price: 499, rating: 4.4, description: "Soft cotton tee with playful character print.", keyword: "kids+tshirt" },
    { name: "Kids' Denim Dungarees", price: 1299, rating: 4.5, description: "Sturdy denim overalls with adjustable straps.", keyword: "kids+dungarees" },
    { name: "Kids' Frock Dress", price: 999, rating: 4.4, description: "Cotton-blend frock with bow detailing.", keyword: "kids+dress" },
    { name: "Kids' School Uniform Set", price: 1499, rating: 4.3, description: "Wrinkle-resistant uniform shirt and shorts set.", keyword: "kids+uniform" },
    { name: "Kids' Sneakers (Light-Up)", price: 1199, rating: 4.6, description: "LED light-up sneakers with hook-and-loop strap.", keyword: "kids+sneakers" },
    { name: "Kids' Winter Jacket", price: 1799, rating: 4.5, description: "Hooded puffer jacket with fleece lining.", keyword: "kids+jacket" },
    { name: "Kids' Pyjama Set", price: 699, rating: 4.3, description: "Soft jersey pyjama set in fun prints.", keyword: "kids+pyjama" },
    { name: "Kids' Track Suit", price: 1399, rating: 4.4, description: "Jogger and zip-hoodie set for active play.", keyword: "kids+tracksuit" },
    { name: "Kids' Ethnic Kurta", price: 1099, rating: 4.5, description: "Festive kurta-pyjama set with embroidered yoke.", keyword: "kids+kurta" },
    { name: "Kids' Raincoat", price: 799, rating: 4.2, description: "Waterproof hooded raincoat with reflective trim.", keyword: "kids+raincoat" },
  ],
  // ===== HOME =====
  kitchen: [
    { name: "Cast Iron Skillet 12\"", price: 2499, rating: 4.8, description: "Pre-seasoned 12-inch cast iron — a lifelong companion.", keyword: "skillet" },
    { name: "Stainless Steel Cookware Set", price: 5999, rating: 4.5, description: "Tri-ply stainless steel 7-piece induction cookware set.", keyword: "cookware" },
    { name: "Pour-Over Coffee Kit", price: 1899, rating: 4.6, description: "Ceramic dripper, server and reusable steel filter.", keyword: "coffee" },
    { name: "Electric Kettle 1.5L", price: 1599, rating: 4.4, description: "Borosilicate glass kettle with auto shut-off.", keyword: "kettle" },
    { name: "Knife Block Set", price: 3999, rating: 4.6, description: "8-piece German stainless knife set with oak block.", keyword: "knife+set" },
    { name: "Stand Mixer", price: 24999, rating: 4.7, description: "5L tilt-head stand mixer with 10 speeds.", keyword: "stand+mixer" },
    { name: "Air Fryer 5L", price: 6999, rating: 4.5, description: "Hot-air fryer with 7 presets and dishwasher-safe basket.", keyword: "air+fryer" },
    { name: "Wooden Chopping Board", price: 799, rating: 4.4, description: "End-grain acacia chopping board with juice groove.", keyword: "chopping+board" },
    { name: "Glass Storage Containers", price: 1499, rating: 4.5, description: "Set of 6 borosilicate containers with airtight lids.", keyword: "glass+container" },
    { name: "Drip Coffee Maker", price: 4499, rating: 4.4, description: "Programmable 12-cup coffee maker with thermal carafe.", keyword: "coffee+maker" },
    { name: "Non-Stick Frying Pan", price: 1299, rating: 4.3, description: "Granite-coated non-stick pan, PFOA-free.", keyword: "frying+pan" },
    { name: "Spice Rack Set", price: 1199, rating: 4.4, description: "Rotating bamboo spice rack with 16 glass jars.", keyword: "spice+rack" },
    { name: "Insulated Tiffin", price: 899, rating: 4.3, description: "3-tier vacuum-insulated steel tiffin carrier.", keyword: "tiffin" },
    { name: "Pressure Cooker 5L", price: 2199, rating: 4.5, description: "Hard-anodised induction-friendly pressure cooker.", keyword: "pressure+cooker" },
    { name: "Hand Blender", price: 1999, rating: 4.3, description: "800W stick blender with whisk and chopper attachments.", keyword: "hand+blender" },
    { name: "Tea Infuser Mug", price: 599, rating: 4.4, description: "Double-walled glass mug with steel infuser.", keyword: "tea+mug" },
    { name: "Cutlery Set 24-pc", price: 1799, rating: 4.5, description: "Mirror-finish stainless steel cutlery for 6.", keyword: "cutlery" },
    { name: "Wok 30cm", price: 1699, rating: 4.4, description: "Carbon-steel wok seasoned for high-heat stir-fry.", keyword: "wok" },
    { name: "Salt and Pepper Mill", price: 999, rating: 4.3, description: "Beechwood mills with adjustable ceramic burrs.", keyword: "pepper+mill" },
    { name: "Microwave Oven 23L", price: 8499, rating: 4.4, description: "Convection microwave with 200 auto-cook menus.", keyword: "microwave" },
  ],
  decor: [
    { name: "Linen Throw Blanket", price: 2999, rating: 4.5, description: "Stonewashed linen blanket that softens with every wash.", keyword: "throw+blanket" },
    { name: "Scented Soy Candle", price: 899, rating: 4.4, description: "Sandalwood-and-vanilla soy candle, 40-hour burn.", keyword: "candle" },
    { name: "Modern Desk Lamp", price: 2499, rating: 4.3, description: "LED desk lamp with warm-to-cool colour temperature.", keyword: "desk+lamp" },
    { name: "Indoor Plant Pot", price: 699, rating: 4.2, description: "Matte ceramic planter with bamboo saucer.", keyword: "plant+pot" },
    { name: "Aromatherapy Diffuser", price: 1799, rating: 4.4, description: "Ultrasonic oil diffuser with ambient mood lighting.", keyword: "diffuser" },
    { name: "Wall Clock — Minimalist", price: 1299, rating: 4.3, description: "Silent-sweep wall clock in brushed walnut.", keyword: "wall+clock" },
    { name: "Macrame Wall Hanging", price: 1499, rating: 4.5, description: "Hand-knotted cotton macrame for boho-styled walls.", keyword: "macrame" },
    { name: "Photo Frame Set", price: 999, rating: 4.3, description: "Set of 6 gallery wall frames in matte black.", keyword: "photo+frame" },
    { name: "Cushion Covers (Set of 5)", price: 1199, rating: 4.4, description: "Mix-print velvet covers for sofas and beds.", keyword: "cushion+cover" },
    { name: "Fairy String Lights", price: 499, rating: 4.4, description: "10m warm-white copper-wire lights, USB powered.", keyword: "fairy+lights" },
  ],
  furniture: [
    { name: "Solid Wood Bookshelf", price: 12999, rating: 4.6, description: "5-tier sheesham bookshelf with hand-finished edges.", keyword: "bookshelf" },
    { name: "Fabric Sofa 3-Seater", price: 34999, rating: 4.5, description: "Mid-century inspired 3-seater in soft boucle fabric.", keyword: "sofa" },
    { name: "Wooden Study Table", price: 7999, rating: 4.4, description: "Engineered wood study desk with cable management.", keyword: "study+table" },
    { name: "Ergonomic Office Chair", price: 9999, rating: 4.5, description: "Mesh-back chair with adjustable lumbar and armrests.", keyword: "office+chair" },
    { name: "Queen Bed Frame", price: 18999, rating: 4.6, description: "Solid wood platform bed with under-storage drawers.", keyword: "bed+frame" },
    { name: "Dining Table 6-Seater", price: 24999, rating: 4.5, description: "Mango-wood dining table with metal hairpin legs.", keyword: "dining+table" },
    { name: "TV Console", price: 8999, rating: 4.3, description: "120cm media console with adjustable shelves.", keyword: "tv+console" },
    { name: "Coffee Table — Marble Top", price: 11999, rating: 4.5, description: "Italian-marble top coffee table on brass-finish base.", keyword: "coffee+table" },
    { name: "Wardrobe 3-Door", price: 26999, rating: 4.4, description: "Engineered-wood wardrobe with mirror and drawers.", keyword: "wardrobe" },
    { name: "Accent Armchair", price: 14999, rating: 4.5, description: "Velvet-upholstered accent chair with tapered legs.", keyword: "armchair" },
  ],
  // ===== BOOKS =====
  fiction: [
    { name: "The Quiet Garden", price: 499, rating: 4.3, description: "A meditative novel about slowing down and finding wonder.", keyword: "novel" },
    { name: "Worlds in a Grain of Sand", price: 599, rating: 4.4, description: "Short stories on the magic hidden in everyday science.", keyword: "fiction+book" },
    { name: "Crimson Tide", price: 549, rating: 4.5, description: "A gripping seaside thriller you won't put down.", keyword: "thriller+book" },
    { name: "The Last Architect", price: 699, rating: 4.6, description: "Sweeping historical fiction across three continents.", keyword: "historical+fiction" },
    { name: "Echoes of Mars", price: 649, rating: 4.4, description: "Hard sci-fi about humanity's first Martian colony.", keyword: "scifi+book" },
    { name: "The Paper Inheritance", price: 499, rating: 4.3, description: "A family saga told through 100 years of letters.", keyword: "family+novel" },
    { name: "Midnight in Bombay", price: 449, rating: 4.5, description: "A noir mystery set in 1970s Bombay.", keyword: "mystery+book" },
    { name: "Stars Above the Hills", price: 549, rating: 4.4, description: "A coming-of-age tale set in a Himalayan village.", keyword: "coming+of+age" },
    { name: "The Silent Lighthouse", price: 599, rating: 4.5, description: "Atmospheric ghost story set on a remote island.", keyword: "ghost+book" },
    { name: "Songs of the Forgotten", price: 499, rating: 4.2, description: "Lyrical fantasy debut about a country with no music.", keyword: "fantasy+book" },
    { name: "The Cartographer's Wife", price: 599, rating: 4.4, description: "Literary romance across war-torn 1940s Europe.", keyword: "romance+book" },
    { name: "Glass and Iron", price: 699, rating: 4.5, description: "An industrial-era noir with sharp prose and sharper twists.", keyword: "noir+book" },
    { name: "Letters from the Lake", price: 449, rating: 4.3, description: "Epistolary novel about a friendship that spans decades.", keyword: "epistolary+book" },
    { name: "The Saffron Inn", price: 549, rating: 4.4, description: "Heartwarming small-town story set in Pondicherry.", keyword: "indian+novel" },
    { name: "Wolves of December", price: 599, rating: 4.5, description: "A taut Scandinavian crime thriller.", keyword: "crime+novel" },
    { name: "Born of Salt and Tide", price: 649, rating: 4.4, description: "Mythic fantasy rooted in coastal folklore.", keyword: "mythic+fantasy" },
    { name: "The Beekeeper's Daughter", price: 499, rating: 4.4, description: "Lush rural novel about secrets and second chances.", keyword: "rural+novel" },
    { name: "Paperweight", price: 449, rating: 4.2, description: "A quietly devastating literary debut.", keyword: "literary+book" },
    { name: "Velvet Hour", price: 599, rating: 4.5, description: "A genre-bending detective novel with a dreamlike feel.", keyword: "detective+book" },
    { name: "Light Years to Tomorrow", price: 649, rating: 4.4, description: "Space-opera epic with unforgettable characters.", keyword: "space+opera" },
  ],
  nonfiction: [
    { name: "The Pragmatic Coder", price: 799, rating: 4.8, description: "A modern guide to writing code that is clear and joyful.", keyword: "programming+book" },
    { name: "Designing for Humans", price: 749, rating: 4.5, description: "Field-tested principles for creating products people love.", keyword: "design+book" },
    { name: "The Art of Focus", price: 549, rating: 4.5, description: "A practical guide to deep work in a noisy world.", keyword: "focus+book" },
    { name: "Atlas of the Stars", price: 1099, rating: 4.6, description: "A breathtaking visual journey through our galaxy.", keyword: "astronomy+book" },
    { name: "Cooking with Fire", price: 899, rating: 4.5, description: "Recipes and techniques for live-fire cooking at home.", keyword: "cookbook" },
    { name: "Money, Calmly", price: 649, rating: 4.4, description: "A no-nonsense guide to personal finance in India.", keyword: "finance+book" },
    { name: "How Cities Work", price: 749, rating: 4.5, description: "An urbanist's tour of the systems behind every metro.", keyword: "urban+book" },
    { name: "The Climate Almanac", price: 899, rating: 4.6, description: "A data-rich field guide to a changing planet.", keyword: "climate+book" },
    { name: "Modern Watercolor", price: 699, rating: 4.4, description: "Step-by-step techniques for vibrant watercolor painting.", keyword: "art+book" },
    { name: "The Founder's Notebook", price: 599, rating: 4.5, description: "Hard-earned lessons from twenty startup founders.", keyword: "startup+book" },
  ],
  education: [
    { name: "NCERT Class 10 Mathematics", price: 299, rating: 4.6, description: "Complete textbook for CBSE Class 10 Mathematics.", keyword: "textbook" },
    { name: "RD Sharma Class 12 Maths", price: 749, rating: 4.7, description: "Renowned practice book for Class 12 mathematics.", keyword: "math+book" },
    { name: "JEE Main 36 Year Solved Papers", price: 549, rating: 4.5, description: "Topic-wise solved papers for JEE Main aspirants.", keyword: "jee+book" },
    { name: "NEET Biology Crash Course", price: 699, rating: 4.5, description: "Concept-summary plus 3,000 NEET-style MCQs.", keyword: "biology+book" },
    { name: "CAT Quantitative Aptitude", price: 599, rating: 4.4, description: "Practice-heavy QA prep for the CAT exam.", keyword: "cat+book" },
    { name: "UPSC General Studies Manual", price: 999, rating: 4.4, description: "Comprehensive GS Paper-1 prep for UPSC CSE.", keyword: "upsc+book" },
    { name: "Oxford Advanced Learner's Dictionary", price: 1099, rating: 4.8, description: "Latest 10th edition with online access.", keyword: "dictionary" },
    { name: "Introduction to Algorithms", price: 1499, rating: 4.8, description: "The legendary CLRS textbook on algorithms.", keyword: "algorithms+book" },
    { name: "Wren & Martin English Grammar", price: 349, rating: 4.5, description: "Classic high-school English grammar and composition.", keyword: "grammar+book" },
    { name: "Class 9 Science Lab Manual", price: 249, rating: 4.3, description: "Hands-on lab manual aligned to CBSE curriculum.", keyword: "science+book" },
  ],
};

let _idCounter = 0;
function build(): Product[] {
  const out: Product[] = [];
  for (const sub of Object.keys(SEEDS) as Subcategory[]) {
    SEEDS[sub].forEach((s, idx) => {
      _idCounter++;
      const id = `p${_idCounter}`;
      out.push({
        id,
        name: s.name,
        category: SUBCATEGORY_TO_CATEGORY[sub],
        subcategory: sub,
        price: s.price,
        rating: s.rating,
        stock: 15 + ((_idCounter * 7) % 60),
        image: img(s.keyword, _idCounter),
        description: s.description,
      });
    });
  }
  return out;
}

export const PRODUCTS: Product[] = build();

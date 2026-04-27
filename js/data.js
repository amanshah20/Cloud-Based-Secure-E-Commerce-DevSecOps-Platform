// ===== PRODUCT DATABASE =====
const PRODUCTS = [
  {
    id: 1,
    name: "Chronos Elite Watch",
    category: "watches",
    price: 8499,
    oldPrice: 12999,
    rating: 4.8,
    reviews: 124,
    badge: "Bestseller",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
    description: "Precision Swiss movement with sapphire crystal glass. Water resistant to 100m. Genuine leather strap.",
    stock: 15
  },
  {
    id: 2,
    name: "Noir Leather Tote",
    category: "bags",
    price: 4299,
    oldPrice: 6499,
    rating: 4.6,
    reviews: 89,
    badge: "New",
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500&q=80",
    description: "Hand-stitched full grain leather tote with brass hardware. Spacious compartments. Made in Italy.",
    stock: 8
  },
  {
    id: 3,
    name: "Santal Oud Parfum",
    category: "fragrance",
    price: 3199,
    oldPrice: 4500,
    rating: 4.9,
    reviews: 203,
    badge: "Hot",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=500&q=80",
    description: "An oriental fragrance blending sandalwood, oud, and amber. 100ml EDP. Long-lasting 12h wear.",
    stock: 25
  },
  {
    id: 4,
    name: "Sunlight Aviator Shades",
    category: "accessories",
    price: 2199,
    oldPrice: 3200,
    rating: 4.5,
    reviews: 67,
    badge: "Sale",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&q=80",
    description: "Gold-frame titanium aviators with polarized UV400 lenses. Includes leather case.",
    stock: 12
  },
  {
    id: 5,
    name: "Obsidian Minimalist Watch",
    category: "watches",
    price: 6299,
    oldPrice: 8900,
    rating: 4.7,
    reviews: 91,
    badge: "New",
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80",
    description: "Ultra-slim Japanese quartz movement with matte black DLC coating. Mesh stainless strap.",
    stock: 6
  },
  {
    id: 6,
    name: "Velvet Crossbody Bag",
    category: "bags",
    price: 2899,
    oldPrice: 4100,
    rating: 4.4,
    reviews: 54,
    badge: "",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80",
    description: "Plush velvet fabric with adjustable chain strap. Magnetic clasp closure. Limited edition.",
    stock: 20
  },
  {
    id: 7,
    name: "Silver Link Bracelet",
    category: "accessories",
    price: 1899,
    oldPrice: 2600,
    rating: 4.6,
    reviews: 143,
    badge: "Popular",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&q=80",
    description: "925 sterling silver with rhodium plating. Adjustable length. Hypoallergenic.",
    stock: 30
  },
  {
    id: 8,
    name: "Rose Petal Body Mist",
    category: "fragrance",
    price: 899,
    oldPrice: 1299,
    rating: 4.3,
    reviews: 178,
    badge: "Sale",
    image: "https://images.unsplash.com/photo-1588776814546-1ffedbe47425?w=500&q=80",
    description: "Light and refreshing rose-based body mist. 200ml. Paraben-free, dermatologist tested.",
    stock: 40
  },
  {
    id: 9,
    name: "Gradient Silk Scarf",
    category: "accessories",
    price: 1499,
    oldPrice: 2100,
    rating: 4.8,
    reviews: 62,
    badge: "",
    image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=500&q=80",
    description: "100% pure silk twill scarf with hand-rolled edges. 90x90cm. Multiple ways to wear.",
    stock: 18
  },
  {
    id: 10,
    name: "The Wanderer Backpack",
    category: "bags",
    price: 5499,
    oldPrice: 7800,
    rating: 4.7,
    reviews: 117,
    badge: "Bestseller",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80",
    description: "Water-resistant waxed canvas with full grain leather trim. 30L capacity. Laptop sleeve included.",
    stock: 10
  },
  {
    id: 11,
    name: "Amber Oud Candle",
    category: "fragrance",
    price: 1299,
    oldPrice: 1800,
    rating: 4.9,
    reviews: 235,
    badge: "Hot",
    image: "https://images.unsplash.com/photo-1602523961358-f9f03dd557db?w=500&q=80",
    description: "Luxury soy wax candle with amber and oud fragrance. 250g, 60hr burn time. Hand poured.",
    stock: 50
  },
  {
    id: 12,
    name: "Classic Pilot Chronograph",
    category: "watches",
    price: 11999,
    oldPrice: 16000,
    rating: 4.9,
    reviews: 76,
    badge: "Premium",
    image: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=500&q=80",
    description: "Aviation-inspired chronograph with 100hr power reserve. Luminous hands. Exhibition caseback.",
    stock: 3
  }
];

const COUPON_CODE = "LUXE50";
const COUPON_DISCOUNT = 50; // percentage

// Make available globally
window.PRODUCTS = PRODUCTS;
window.COUPON_CODE = COUPON_CODE;
window.COUPON_DISCOUNT = COUPON_DISCOUNT;

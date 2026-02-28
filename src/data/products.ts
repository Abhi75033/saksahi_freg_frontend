export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
}

export const products: Product[] = [
  { id: "1", name: "Coffee Bliss Candle", description: "Rich coffee aroma to energize your mornings", price: 699, image: "/placeholder.svg", category: "Warm", rating: 4.8, reviews: 124 },
  { id: "2", name: "Vanilla Cream Candle", description: "Sweet vanilla warmth for cozy evenings", price: 599, image: "/placeholder.svg", category: "Sweet", rating: 4.9, reviews: 203 },
  { id: "3", name: "Rose Petal Candle", description: "Delicate rose fragrance for romantic ambiance", price: 749, image: "/placeholder.svg", category: "Floral", rating: 4.7, reviews: 156 },
  { id: "4", name: "Lavender Calm Candle", description: "Soothing lavender to ease your mind", price: 649, image: "/placeholder.svg", category: "Calming", rating: 4.8, reviews: 189 },
  { id: "5", name: "Sandalwood Essence Candle", description: "Earthy sandalwood for spiritual moments", price: 899, image: "/placeholder.svg", category: "Woody", rating: 4.9, reviews: 97 },
  { id: "6", name: "Jasmine Bloom Candle", description: "Fresh jasmine to brighten any space", price: 699, image: "/placeholder.svg", category: "Floral", rating: 4.6, reviews: 142 },
  { id: "7", name: "Cinnamon Spice Candle", description: "Warm cinnamon spice for festive vibes", price: 549, image: "/placeholder.svg", category: "Spicy", rating: 4.5, reviews: 88 },
  { id: "8", name: "Lemon Fresh Candle", description: "Zesty lemon to refresh your home", price: 499, image: "/placeholder.svg", category: "Fresh", rating: 4.4, reviews: 76 },
  { id: "9", name: "Amber Glow Candle", description: "Luxurious amber for an opulent atmosphere", price: 849, image: "/placeholder.svg", category: "Warm", rating: 4.8, reviews: 165 },
  { id: "10", name: "Chocolate Delight Candle", description: "Indulgent chocolate aroma for sweet cravings", price: 599, image: "/placeholder.svg", category: "Sweet", rating: 4.7, reviews: 134 },
];

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: "Processing" | "Shipped" | "Delivered";
}

export const dummyOrders: Order[] = [
  { id: "ORD-2024-001", date: "2024-12-15", items: [{ product: products[0], quantity: 2 }, { product: products[2], quantity: 1 }], total: 2147, status: "Delivered" },
  { id: "ORD-2024-002", date: "2025-01-08", items: [{ product: products[4], quantity: 1 }], total: 899, status: "Shipped" },
  { id: "ORD-2025-003", date: "2025-02-20", items: [{ product: products[1], quantity: 3 }, { product: products[6], quantity: 1 }], total: 2346, status: "Processing" },
];

export const testimonials = [
  { name: "Priya Sharma", text: "The Rose Petal Candle transforms my evenings into something magical. The fragrance is so authentic and long-lasting!", rating: 5, location: "Mumbai" },
  { name: "Ananya Patel", text: "Sakhi candles are my go-to gift for every occasion. The packaging is as beautiful as the fragrance itself.", rating: 5, location: "Pune" },
  { name: "Meera Iyer", text: "The Sandalwood Essence during my meditation sessions creates the most calming atmosphere. Pure bliss!", rating: 5, location: "Bangalore" },
  { name: "Kavita Desai", text: "I've tried many candle brands but nothing compares to the quality and emotion Sakhi brings. Absolutely love it!", rating: 5, location: "Delhi" },
];

export const dummyReviews = [
  { name: "Ritu M.", rating: 5, date: "2025-01-15", text: "Absolutely love this candle! The scent fills the entire room within minutes. Burns evenly and lasts long." },
  { name: "Sneha K.", rating: 4, date: "2025-01-10", text: "Beautiful fragrance and elegant packaging. Would love more size options." },
  { name: "Pooja R.", rating: 5, date: "2024-12-28", text: "Gifted this to my mother and she was thrilled! The fragrance is divine and the candle looks premium." },
  { name: "Aarti S.", rating: 5, date: "2024-12-20", text: "My favourite candle brand now. The scent is not overpowering and creates such a peaceful ambiance." },
];

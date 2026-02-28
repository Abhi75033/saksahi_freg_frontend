import { useParams, Link } from "react-router-dom";
import { products, dummyReviews } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Minus, Plus, ShoppingBag, Zap, MapPin } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find(p => p.id === id);
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [pincode, setPincode] = useState("");

  if (!product) return <div className="container mx-auto px-4 py-20 text-center"><p>Product not found</p><Link to="/shop" className="text-primary">Back to Shop</Link></div>;

  return (
    <SectionWrapper>
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Image */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="relative gradient-pink rounded-3xl aspect-square flex items-center justify-center overflow-hidden shadow-warm">
            <div className="absolute inset-0 animate-shimmer" />
            <span className="text-[8rem] relative z-10 drop-shadow-lg">🕯️</span>
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-primary/5 to-transparent" />
          </motion.div>

          {/* Details */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col justify-center">
            <p className="text-sm text-gold font-semibold mb-2 tracking-wide uppercase">{product.category}</p>
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-gold text-gold" : "text-border"}`} />)}</div>
              <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">{product.description}. Made from premium soy wax with pure essential oils, this candle burns for 40+ hours filling your space with a luxurious aroma.</p>
            <p className="text-3xl font-heading font-bold mb-6 text-foreground">₹{product.price}</p>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium text-foreground/80">Quantity</span>
              <div className="flex items-center gap-3 bg-secondary/80 rounded-full px-4 py-1.5 border border-border/40">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="p-1 hover:text-primary transition-colors"><Minus className="w-4 h-4" /></button>
                <span className="w-8 text-center font-medium">{qty}</span>
                <button onClick={() => setQty(q => q + 1)} className="p-1 hover:text-primary transition-colors"><Plus className="w-4 h-4" /></button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button
                onClick={() => { for (let i = 0; i < qty; i++) addToCart(product); }}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:shadow-warm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Cart
              </button>
              <Link
                to="/checkout"
                onClick={() => { for (let i = 0; i < qty; i++) addToCart(product); }}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-full gradient-gold text-primary-foreground font-medium hover:shadow-warm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Zap className="w-4 h-4" /> Buy Now
              </Link>
            </div>

            {/* Pincode */}
            <div className="glass-card p-5">
              <p className="text-sm font-medium mb-3 flex items-center gap-2"><MapPin className="w-4 h-4 text-gold" />Check Delivery Availability</p>
              <div className="flex gap-2">
                <input value={pincode} onChange={e => setPincode(e.target.value)} placeholder="Enter pincode" className="flex-1 px-4 py-2.5 rounded-full bg-background/80 border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all" />
                <button className="px-5 py-2.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors">Check</button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Reviews */}
        <div className="mt-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-10 bg-gold/50" />
            <h2 className="text-2xl font-heading font-bold">Customer Reviews</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {dummyReviews.map((r, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-card p-5 hover:shadow-elevated transition-shadow duration-500">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">{Array.from({ length: 5 }).map((_, j) => <Star key={j} className={`w-3 h-3 ${j < r.rating ? "fill-gold text-gold" : "text-border"}`} />)}</div>
                  <span className="text-xs text-muted-foreground">{r.date}</span>
                </div>
                <p className="text-sm text-foreground/80 mb-2">{r.text}</p>
                <p className="text-xs font-semibold text-foreground/70">{r.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default ProductDetail;

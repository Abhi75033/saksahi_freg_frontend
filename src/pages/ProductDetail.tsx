import { useParams, Link } from "react-router-dom";
import { dummyReviews } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Minus, Plus, ShoppingBag, Zap, MapPin, Heart, AlertTriangle, Loader2 } from "lucide-react";
import SectionWrapper from "@/components/SectionWrapper";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useProduct } from "@/hooks/useProducts";

const ProductDetail = () => {
  const { id } = useParams();
  const { product, loading, error } = useProduct(id);
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [pincode, setPincode] = useState("");
  const { user } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");

  useEffect(() => {
    if (product && user?.wishlist?.some((wid: any) => wid === product._id || wid === product.id)) {
      setIsWishlisted(true);
    }
  }, [user, product]);

  const toggleWishlist = async () => {
    if (!user) {
      toast.error("Please login to add to wishlist");
      return;
    }
    try {
      const res = await fetch("https://sakshi-freg-backend.onrender.com/api/users/wishlist", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ productId: product._id || product.id }),
      });
      if (!res.ok) throw new Error("Failed to update wishlist");
      setIsWishlisted(!isWishlisted);
      toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
    } catch (error) {
      toast.error("Error updating wishlist");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  if (error || !product) return (
    <div className="container mx-auto px-4 py-20 text-center">
      <p className="mb-4 text-muted-foreground">{error || "Product not found"}</p>
      <Link to="/shop" className="text-primary hover:underline">← Back to Shop</Link>
    </div>
  );

  const resolveImageUrl = (url: string) => {
    if (!url) return "";
    return url.startsWith('/') && !url.startsWith('http') ? `https://sakshi-freg-backend.onrender.com${url}` : url;
  };

  const allImages = Array.from(new Set([
    product.image ? resolveImageUrl(product.image) : "",
    ...(product.images || []).map(resolveImageUrl)
  ])).filter(Boolean);

  const currentDisplayImage = selectedImage || allImages[0] || "";

  return (
    <SectionWrapper>
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Image Gallery */}
          <div className="flex flex-col gap-4">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="relative gradient-pink rounded-3xl aspect-square flex items-center justify-center overflow-hidden shadow-warm">
              {currentDisplayImage ? (
                <img src={currentDisplayImage} alt={product.title || product.name} className="w-full h-full object-cover transition-opacity duration-300" />
              ) : (
                <>
                  <div className="absolute inset-0 animate-shimmer" />
                  <span className="text-[8rem] relative z-10 drop-shadow-lg">🕯️</span>
                  <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-primary/5 to-transparent" />
                </>
              )}
              <button
                onClick={toggleWishlist}
                className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110 ${isWishlisted ? 'bg-primary/20 text-primary' : 'bg-white/50 text-foreground/80 hover:bg-white/80'}`}
              >
                <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-primary text-primary' : ''}`} />
              </button>
            </motion.div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 snap-x hide-scrollbar">
                {allImages.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 snap-start transition-all duration-200 ${currentDisplayImage === imgUrl ? 'ring-2 ring-primary ring-offset-2 scale-95 opacity-100' : 'opacity-70 hover:opacity-100 border border-border'}`}
                  >
                    <img src={imgUrl} alt={`${product.title || product.name} view ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col justify-center">
            <p className="text-sm text-gold font-semibold mb-2 tracking-wide uppercase">{product.category}</p>
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">{product.title || product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating || 5) ? "fill-gold text-gold" : "text-border"}`} />)}</div>
              <span className="text-sm text-muted-foreground">({product.reviews || 0} reviews)</span>
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">{product.description}. Made from premium soy wax with pure essential oils, this candle burns for 40+ hours filling your space with a luxurious aroma.</p>
            <p className="text-3xl font-heading font-bold mb-4 text-foreground">₹{product.price}</p>

            {/* Stock warning */}
            {typeof product.quantity === 'number' && product.quantity === 0 && (
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
                <AlertTriangle className="w-4 h-4" /> This product is currently out of stock
              </div>
            )}
            {typeof product.quantity === 'number' && product.quantity > 0 && product.quantity < 10 && (
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-2.5">
                <AlertTriangle className="w-4 h-4" /> Hurry! Only {product.quantity} left in stock
              </div>
            )}

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
                onClick={() => { if (product.quantity !== 0) { for (let i = 0; i < qty; i++) addToCart(product); } }}
                disabled={product.quantity === 0}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:shadow-warm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-4 h-4" /> {product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <Link
                to="/checkout"
                onClick={(e) => { if (product.quantity === 0) { e.preventDefault(); return; } for (let i = 0; i < qty; i++) addToCart(product); }}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-full gradient-gold text-primary-foreground font-medium hover:shadow-warm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${product.quantity === 0 ? 'opacity-40 pointer-events-none' : ''}`}
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

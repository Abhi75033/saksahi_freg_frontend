import { Link } from "react-router-dom";
import { ShoppingBag, Star, Heart } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const ProductCard = ({ product, index = 0 }: { product: Product | any; index?: number }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (user?.wishlist?.some((id: any) => id === product._id || id === product.id)) {
      setIsWishlisted(true);
    }
  }, [user, product]);

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to add to wishlist");
      return;
    }

    try {
      const res = await fetch("http://localhost:5001/api/users/wishlist", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ productId: product._id || product.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error("Failed to update wishlist");
      
      setIsWishlisted(!isWishlisted);
      toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
    } catch (error) {
      toast.error("Error updating wishlist");
    }
  };

  const imageUrl = product.image ? (product.image.startsWith('/') && !product.image.startsWith('http') ? `http://localhost:5001${product.image}` : product.image) : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group glass-card overflow-hidden hover:shadow-elevated transition-all duration-500"
    >
      <Link to={`/product/${product._id || product.id}`}>
        <div className="aspect-square bg-secondary/30 flex items-center justify-center overflow-hidden relative">
          {imageUrl ? (
            <img src={imageUrl} alt={product.title || product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
          ) : (
            <div className="w-full h-full gradient-pink flex items-center justify-center group-hover:scale-110 transition-transform duration-700 ease-out">
              <span className="text-6xl drop-shadow-md">🕯️</span>
            </div>
          )}
          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500" />
          <button
            onClick={toggleWishlist}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-300 hover:scale-110 ${isWishlisted ? 'bg-primary/20 text-primary' : 'bg-white/50 text-foreground/80 hover:bg-white/80'}`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-primary text-primary' : ''}`} />
          </button>
        </div>
      </Link>
      <div className="p-4">
        <div className="flex items-center gap-1 mb-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating || 5) ? "fill-gold text-gold" : "text-border"}`} />
          ))}
          <span className="text-xs text-muted-foreground ml-1">({product.reviews || 0})</span>
        </div>
        <Link to={`/product/${product._id || product.id}`}>
          <h3 className="font-heading font-semibold text-sm mb-1 group-hover:text-primary transition-colors duration-300">{product.title || product.name}</h3>
        </Link>
        <p className="text-xs text-muted-foreground mb-3 line-clamp-1">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="font-heading font-bold text-lg text-foreground">₹{product.price}</span>
          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
            className="p-2.5 rounded-full bg-primary text-primary-foreground hover:shadow-warm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;

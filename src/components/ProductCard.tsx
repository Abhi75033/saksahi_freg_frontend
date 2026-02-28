import { Link } from "react-router-dom";
import { ShoppingBag, Star } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";

const ProductCard = ({ product, index = 0 }: { product: Product; index?: number }) => {
  const { addToCart } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group glass-card overflow-hidden hover:shadow-elevated transition-all duration-500"
    >
      <Link to={`/product/${product.id}`}>
        <div className="aspect-square bg-secondary/30 flex items-center justify-center overflow-hidden relative">
          <div className="w-full h-full gradient-pink flex items-center justify-center group-hover:scale-110 transition-transform duration-700 ease-out">
            <span className="text-6xl drop-shadow-md">🕯️</span>
          </div>
          <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500" />
        </div>
      </Link>
      <div className="p-4">
        <div className="flex items-center gap-1 mb-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? "fill-gold text-gold" : "text-border"}`} />
          ))}
          <span className="text-xs text-muted-foreground ml-1">({product.reviews})</span>
        </div>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-heading font-semibold text-sm mb-1 group-hover:text-primary transition-colors duration-300">{product.name}</h3>
        </Link>
        <p className="text-xs text-muted-foreground mb-3 line-clamp-1">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="font-heading font-bold text-lg text-foreground">₹{product.price}</span>
          <button
            onClick={() => addToCart(product)}
            className="p-2.5 rounded-full bg-primary text-primary-foreground hover:shadow-warm transition-all duration-300 hover:scale-110 active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;

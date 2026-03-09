import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SectionWrapper from "@/components/SectionWrapper";
import { Link } from "react-router-dom";

const Cart = () => {
  const { items, updateQuantity, removeFromCart, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const delivery = items.length > 0 ? 49 : 0;

  const handleCheckout = () => {
    if (!user) {
      navigate("/login?redirect=/confirm-order");
    } else {
      navigate("/confirm-order");
    }
  };

  if (items.length === 0)
    return (
      <SectionWrapper>
        <div className="container mx-auto px-4 text-center">
          <div className="glass-card max-w-md mx-auto p-12 shadow-elevated">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-heading font-bold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">Add some beautiful candles to your cart</p>
            <Link to="/shop" className="inline-flex px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:shadow-warm transition-all hover:scale-[1.02]">Shop Now</Link>
          </div>
        </div>
      </SectionWrapper>
    );

  return (
    <SectionWrapper>
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-heading font-bold mb-8">Shopping Cart</h1>

        {/* Guest notice */}
        {!user && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 border border-primary/20 text-sm"
          >
            <LogIn className="w-4 h-4 text-primary shrink-0" />
            <span className="text-foreground/80">
              You're browsing as a guest. <Link to="/login?redirect=/confirm-order" className="font-semibold text-primary underline underline-offset-2">Sign in</Link> to checkout — your cart items will be saved.
            </span>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map(item => (
                <motion.div
                  key={item.product.id || item.product._id}
                  layout
                  exit={{ opacity: 0, x: -100 }}
                  className="glass-card p-4 flex gap-4 hover:shadow-elevated transition-shadow duration-500"
                >
                  <div className="w-20 h-20 gradient-pink rounded-xl flex items-center justify-center shrink-0 relative overflow-hidden">
                    <div className="absolute inset-0 animate-shimmer" />
                    <span className="text-3xl relative z-10">🕯️</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-semibold text-sm">{item.product.name || item.product.title}</h3>
                    <p className="text-sm text-muted-foreground">₹{item.product.price}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-2 bg-secondary/80 rounded-full px-3 py-0.5 border border-border/40">
                        <button onClick={() => updateQuantity(item.product.id || item.product._id!, item.quantity - 1)} className="hover:text-primary transition-colors"><Minus className="w-3 h-3" /></button>
                        <span className="text-sm w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id || item.product._id!, item.quantity + 1)} className="hover:text-primary transition-colors"><Plus className="w-3 h-3" /></button>
                      </div>
                      <button onClick={() => removeFromCart(item.product.id || item.product._id!)} className="text-destructive hover:scale-110 transition-transform"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <p className="font-heading font-bold shrink-0">₹{item.product.price * item.quantity}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="glass-card p-6 h-fit shadow-elevated">
            <h3 className="font-heading font-semibold text-lg mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{totalPrice}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>₹{delivery}</span></div>
              <div className="border-t border-border/50 pt-3 flex justify-between font-heading font-bold text-lg">
                <span>Total</span><span>₹{totalPrice + delivery}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:shadow-warm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              {!user && <LogIn className="w-4 h-4" />}
              {user ? "Proceed to Checkout" : "Sign in to Checkout"}
            </button>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Cart;

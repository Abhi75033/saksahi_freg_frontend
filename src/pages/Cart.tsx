import { useCart } from "@/context/CartContext";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SectionWrapper from "@/components/SectionWrapper";

const Cart = () => {
  const { items, updateQuantity, removeFromCart, totalPrice } = useCart();
  const delivery = items.length > 0 ? 49 : 0;

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
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map(item => (
                <motion.div key={item.product.id} layout exit={{ opacity: 0, x: -100 }} className="glass-card p-4 flex gap-4 hover:shadow-elevated transition-shadow duration-500">
                  <div className="w-20 h-20 gradient-pink rounded-xl flex items-center justify-center shrink-0 relative overflow-hidden">
                    <div className="absolute inset-0 animate-shimmer" />
                    <span className="text-3xl relative z-10">🕯️</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-semibold text-sm">{item.product.name}</h3>
                    <p className="text-sm text-muted-foreground">₹{item.product.price}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-2 bg-secondary/80 rounded-full px-3 py-0.5 border border-border/40">
                        <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="hover:text-primary transition-colors"><Minus className="w-3 h-3" /></button>
                        <span className="text-sm w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="hover:text-primary transition-colors"><Plus className="w-3 h-3" /></button>
                      </div>
                      <button onClick={() => removeFromCart(item.product.id)} className="text-destructive hover:scale-110 transition-transform"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <p className="font-heading font-bold">₹{item.product.price * item.quantity}</p>
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
            <Link to="/checkout" className="mt-6 w-full inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:shadow-warm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Cart;

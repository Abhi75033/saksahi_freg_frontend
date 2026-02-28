import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";
import { CheckCircle, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import SectionWrapper from "@/components/SectionWrapper";

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const delivery = 49;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderPlaced(true);
    clearCart();
  };

  if (orderPlaced)
    return (
      <SectionWrapper>
        <div className="container mx-auto px-4 text-center">
          <div className="glass-card max-w-md mx-auto p-12 shadow-elevated relative overflow-hidden">
            <div className="absolute inset-0 animate-shimmer" />
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="relative z-10">
              <CheckCircle className="w-20 h-20 text-gold mx-auto mb-4" />
            </motion.div>
            <h1 className="text-3xl font-heading font-bold mb-2 relative z-10">Order Placed! 🎉</h1>
            <p className="text-muted-foreground mb-6 relative z-10">Thank you for shopping with Sakhi Fragrance House</p>
            <Link to="/orders" className="relative z-10 inline-flex px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:shadow-warm transition-all">View Orders</Link>
          </div>
        </div>
      </SectionWrapper>
    );

  return (
    <>
      <section className="relative gradient-hero py-10 md:py-14 overflow-hidden">
        <div className="absolute inset-0 animate-shimmer" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="h-px w-10 bg-gold/60" />
            <Sparkles className="w-4 h-4 text-gold" />
            <div className="h-px w-10 bg-gold/60" />
          </div>
          <h1 className="text-3xl font-heading font-bold">Checkout</h1>
        </div>
      </section>
      <SectionWrapper>
        <div className="container mx-auto px-4">
          <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-card p-6 hover:shadow-elevated transition-shadow duration-500">
                <h2 className="font-heading font-semibold text-lg mb-4">Billing Details</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { label: "Full Name", type: "text", placeholder: "Your name" },
                    { label: "Email", type: "email", placeholder: "email@example.com" },
                    { label: "Phone", type: "tel", placeholder: "+91 98765 43210" },
                    { label: "Pincode", type: "text", placeholder: "400001" },
                  ].map(f => (
                    <div key={f.label}>
                      <label className="text-sm font-medium mb-1.5 block text-foreground/80">{f.label}</label>
                      <input required type={f.type} placeholder={f.placeholder} className="w-full px-4 py-3 rounded-xl bg-background/80 border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all" />
                    </div>
                  ))}
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium mb-1.5 block text-foreground/80">Address</label>
                    <textarea required placeholder="Complete address" rows={3} className="w-full px-4 py-3 rounded-xl bg-background/80 border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 resize-none transition-all" />
                  </div>
                  {[
                    { label: "City", placeholder: "Mumbai" },
                    { label: "State", placeholder: "Maharashtra" },
                  ].map(f => (
                    <div key={f.label}>
                      <label className="text-sm font-medium mb-1.5 block text-foreground/80">{f.label}</label>
                      <input required placeholder={f.placeholder} className="w-full px-4 py-3 rounded-xl bg-background/80 border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="glass-card p-6 hover:shadow-elevated transition-shadow duration-500">
                <h2 className="font-heading font-semibold text-lg mb-4">Payment Method</h2>
                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    { id: "upi", label: "UPI" },
                    { id: "card", label: "Credit Card" },
                    { id: "cod", label: "Cash on Delivery" },
                  ].map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id)}
                      className={`p-4 rounded-xl border-2 text-sm font-medium transition-all duration-300 ${
                        paymentMethod === m.id ? "border-primary bg-primary/8 shadow-warm" : "border-border/60 hover:border-primary/30"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="glass-card p-6 h-fit shadow-elevated">
              <h3 className="font-heading font-semibold text-lg mb-4">Order Summary</h3>
              <div className="space-y-2 text-sm mb-4">
                {items.map(i => (
                  <div key={i.product.id} className="flex justify-between">
                    <span className="text-muted-foreground">{i.product.name} x{i.quantity}</span>
                    <span>₹{i.product.price * i.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border/50 pt-3 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>₹{totalPrice}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>₹{delivery}</span></div>
                <div className="border-t border-border/50 pt-3 flex justify-between font-heading font-bold text-lg">
                  <span>Total</span><span>₹{totalPrice + delivery}</span>
                </div>
              </div>
              <button type="submit" className="mt-6 w-full px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:shadow-warm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
                Place Order
              </button>
            </div>
          </form>
        </div>
      </SectionWrapper>
    </>
  );
};

export default Checkout;

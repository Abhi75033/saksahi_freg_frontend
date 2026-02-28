import { Link } from "react-router-dom";
import SectionWrapper from "@/components/SectionWrapper";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";

const Register = () => (
  <>
    <section className="relative gradient-hero py-12 md:py-16 overflow-hidden">
      <div className="absolute inset-0 animate-shimmer" />
      <div className="absolute top-5 left-20 w-40 h-40 rounded-full bg-gold/8 blur-3xl" />
    </section>
    <SectionWrapper className="-mt-12">
      <div className="container mx-auto px-4 flex justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg glass-card p-8 shadow-elevated">
          <div className="text-center mb-6">
            <Flame className="w-8 h-8 text-gold mx-auto mb-3" />
            <h1 className="text-2xl font-heading font-bold">Create Account</h1>
            <p className="text-sm text-muted-foreground mt-1">Join the Sakhi family</p>
          </div>
          <form className="space-y-4" onSubmit={e => e.preventDefault()}>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block text-foreground/80">Full Name</label>
                <input placeholder="Your name" className="w-full px-4 py-3 rounded-xl bg-background/80 border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block text-foreground/80">Phone</label>
                <input type="tel" placeholder="+91 98765 43210" className="w-full px-4 py-3 rounded-xl bg-background/80 border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block text-foreground/80">Email</label>
              <input type="email" placeholder="email@example.com" className="w-full px-4 py-3 rounded-xl bg-background/80 border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block text-foreground/80">Password</label>
                <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl bg-background/80 border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block text-foreground/80">Confirm Password</label>
                <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl bg-background/80 border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block text-foreground/80">Address</label>
              <textarea placeholder="Complete address" rows={2} className="w-full px-4 py-3 rounded-xl bg-background/80 border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 resize-none transition-all" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block text-foreground/80">City</label>
                <input placeholder="City" className="w-full px-4 py-3 rounded-xl bg-background/80 border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block text-foreground/80">State</label>
                <input placeholder="State" className="w-full px-4 py-3 rounded-xl bg-background/80 border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block text-foreground/80">Pincode</label>
                <input placeholder="400001" className="w-full px-4 py-3 rounded-xl bg-background/80 border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all" />
              </div>
            </div>
            <button type="submit" className="w-full py-3 rounded-full bg-primary text-primary-foreground font-medium hover:shadow-warm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">Create Account</button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Login</Link>
          </p>
        </motion.div>
      </div>
    </SectionWrapper>
  </>
);

export default Register;

import { Link } from "react-router-dom";
import SectionWrapper from "@/components/SectionWrapper";
import { motion } from "framer-motion";
import { Flame } from "lucide-react";

const Login = () => (
  <>
    <section className="relative gradient-hero py-12 md:py-16 overflow-hidden">
      <div className="absolute inset-0 animate-shimmer" />
      <div className="absolute top-5 right-20 w-40 h-40 rounded-full bg-gold/8 blur-3xl" />
    </section>
    <SectionWrapper className="-mt-12">
      <div className="container mx-auto px-4 flex justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md glass-card p-8 shadow-elevated">
          <div className="text-center mb-6">
            <Flame className="w-8 h-8 text-gold mx-auto mb-3" />
            <h1 className="text-2xl font-heading font-bold">Welcome Back</h1>
            <p className="text-sm text-muted-foreground mt-1">Sign in to your Sakhi account</p>
          </div>
          <form className="space-y-4" onSubmit={e => e.preventDefault()}>
            <div>
              <label className="text-sm font-medium mb-1.5 block text-foreground/80">Email</label>
              <input type="email" placeholder="email@example.com" className="w-full px-4 py-3 rounded-xl bg-background/80 border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block text-foreground/80">Password</label>
              <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-xl bg-background/80 border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all" />
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-muted-foreground"><input type="checkbox" className="rounded accent-primary" /> Remember me</label>
              <a href="#" className="text-primary font-medium hover:underline">Forgot password?</a>
            </div>
            <button type="submit" className="w-full py-3 rounded-full bg-primary text-primary-foreground font-medium hover:shadow-warm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">Login</button>
          </form>
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 border-t border-border/50" />
            <span className="text-xs text-muted-foreground">or continue with</span>
            <div className="flex-1 border-t border-border/50" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button className="py-2.5 rounded-xl border border-border/60 text-sm font-medium hover:bg-secondary/80 hover:border-primary/30 transition-all duration-200">Google</button>
            <button className="py-2.5 rounded-xl border border-border/60 text-sm font-medium hover:bg-secondary/80 hover:border-primary/30 transition-all duration-200">Facebook</button>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account? <Link to="/register" className="text-primary font-medium hover:underline">Sign Up</Link>
          </p>
        </motion.div>
      </div>
    </SectionWrapper>
  </>
);

export default Login;

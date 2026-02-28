import SectionWrapper from "@/components/SectionWrapper";
import { MapPin, Mail, Phone, Send, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const Contact = () => (
  <>
    {/* Hero */}
    <section className="relative gradient-hero py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 animate-shimmer" />
      <div className="absolute top-10 right-10 w-48 h-48 rounded-full bg-gold/8 blur-3xl" />
      <div className="absolute bottom-10 left-20 w-56 h-56 rounded-full bg-primary/5 blur-3xl" />
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-2 mb-4">
          <div className="h-px w-10 bg-gold/60" />
          <Sparkles className="w-4 h-4 text-gold" />
          <div className="h-px w-10 bg-gold/60" />
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-5xl font-heading font-bold mb-3">
          Get in Touch
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-muted-foreground max-w-md mx-auto">
          We'd love to hear from you. Reach out for questions, collaborations, or just to say hello!
        </motion.p>
      </div>
    </section>

    <SectionWrapper>
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-8 hover:shadow-elevated transition-shadow duration-500">
            <h2 className="font-heading font-semibold text-lg mb-5 flex items-center gap-2">
              <Send className="w-4 h-4 text-gold" /> Send a Message
            </h2>
            <form className="space-y-4" onSubmit={e => e.preventDefault()}>
              <div>
                <label className="text-sm font-medium mb-1.5 block text-foreground/80">Name</label>
                <input placeholder="Your name" className="w-full px-4 py-3 rounded-xl bg-background/80 border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block text-foreground/80">Email</label>
                <input type="email" placeholder="email@example.com" className="w-full px-4 py-3 rounded-xl bg-background/80 border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block text-foreground/80">Message</label>
                <textarea placeholder="Your message..." rows={4} className="w-full px-4 py-3 rounded-xl bg-background/80 border border-border/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 resize-none transition-all" />
              </div>
              <button type="submit" className="w-full py-3 rounded-full bg-primary text-primary-foreground font-medium hover:shadow-warm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> Send Message
              </button>
            </form>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="glass-card p-6 hover:shadow-elevated transition-shadow duration-500">
              <h3 className="font-heading font-semibold mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gold" /> Contact Info
              </h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-background/50 border border-border/30">
                  <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Sakhi Fragrance House</p>
                    <p className="text-muted-foreground">Mumbai, Maharashtra, India</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-background/50 border border-border/30">
                  <Mail className="w-5 h-5 text-primary" />
                  <span className="text-muted-foreground">hello@sakhifragrance.com</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-background/50 border border-border/30">
                  <Phone className="w-5 h-5 text-primary" />
                  <span className="text-muted-foreground">+91 98765 43210</span>
                </div>
              </div>
            </div>
            <div className="glass-card overflow-hidden h-48 flex items-center justify-center gradient-pink relative">
              <div className="absolute inset-0 animate-shimmer" />
              <p className="text-sm text-muted-foreground relative z-10 font-medium">Google Maps Embed</p>
            </div>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  </>
);

export default Contact;

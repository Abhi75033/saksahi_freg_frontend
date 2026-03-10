import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star, Sparkles, Send, Flame, Loader2 } from "lucide-react";
import { testimonials } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import SectionWrapper from "@/components/SectionWrapper";
import { useState } from "react";
import { useProducts } from "@/hooks/useProducts";

const CandleFlame = () => (
  <div className="relative animate-float">
    <div className="text-8xl md:text-[10rem] leading-none drop-shadow-lg">🕯️</div>
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-gold/40 blur-xl candle-flame" />
    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-gold/15 blur-3xl candle-flame" />
    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full bg-accent/10 blur-3xl animate-warm-pulse" />
  </div>
);

const HeroSection = () => (
  <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden gradient-hero">
    {/* Decorative circles */}
    <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-gold/5 blur-3xl" />
    <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />

    {/* Particles */}
    {Array.from({ length: 8 }).map((_, i) => (
      <div
        key={i}
        className="absolute w-1.5 h-1.5 rounded-full bg-gold/40"
        style={{
          left: `${10 + i * 12}%`,
          bottom: "15%",
          animation: `particle ${3 + i * 0.5}s ease-in-out infinite`,
          animationDelay: `${i * 0.4}s`,
        }}
      />
    ))}

    <div className="container mx-auto px-4 text-center relative z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="mb-8"
      >
        <CandleFlame />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="flex items-center justify-center gap-2 mb-4"
      >
        <div className="h-px w-12 bg-gold/50" />
        <Flame className="w-4 h-4 text-gold" />
        <div className="h-px w-12 bg-gold/50" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold mb-4 text-foreground"
      >
        Sakhi Fragrance House
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="text-lg md:text-xl text-muted-foreground italic font-heading mb-10"
      >
        Where Fragrance Meets Emotion
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-medium shadow-warm hover:shadow-elevated transition-all duration-300 hover:scale-105"
        >
          Shop Now <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-primary/60 text-primary font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:shadow-warm"
        >
          <Sparkles className="w-4 h-4" /> Explore Fragrances
        </Link>
      </motion.div>
    </div>
  </section>
);

const FeaturedProducts = () => {
  const { products, loading } = useProducts();
  const featured = products.filter((p: any) => p.isBestseller).slice(0, 4);
  const display = featured.length > 0 ? featured : products.slice(0, 4);

  return (
    <SectionWrapper>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <div className="h-px w-16 bg-border" />
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground">Curated for you</span>
            <div className="h-px w-16 bg-border" />
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-3">Our Bestsellers</h2>
          <p className="text-muted-foreground max-w-md mx-auto">Handcrafted with love, each candle tells a story through its fragrance</p>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-7 h-7 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {display.map((p: any, i: number) => (
              <ProductCard key={p._id || p.id} product={p} index={i} />
            ))}
          </div>
        )}
        <div className="text-center mt-10">
          <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-primary/40 text-primary font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-300">
            View All Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </SectionWrapper>
  );
};

const AboutSection = () => (
  <SectionWrapper className="bg-card/50">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-10 bg-gold" />
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-gold">Our Story</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">Crafted with Heart & Soul</h2>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            Born in the heart of Mumbai, Sakhi Fragrance House is a celebration of emotions captured in every flame. Each candle is handcrafted using premium soy wax and pure essential oils, creating an experience that transcends ordinary fragrance.
          </p>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Our founder believed that fragrance has the power to evoke memories, heal hearts, and transform spaces. That belief lives in every Sakhi candle.
          </p>
          <Link to="/about" className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all">
            Read More <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="gradient-pink rounded-3xl p-12 flex items-center justify-center shadow-warm relative overflow-hidden">
          <div className="absolute inset-0 animate-shimmer" />
          <div className="text-center relative z-10">
            <span className="text-7xl block mb-4">🌸</span>
            <p className="font-heading text-xl italic text-foreground/80">Handcrafted with love in Mumbai</p>
          </div>
        </div>
      </div>
    </div>
  </SectionWrapper>
);

const TestimonialSection = () => {
  const [active, setActive] = useState(0);
  return (
    <SectionWrapper>
      <div className="container mx-auto px-4">
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-16 bg-border" />
            <span className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground">Testimonials</span>
            <div className="h-px w-16 bg-border" />
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-12">What Our Customers Say</h2>
        </div>
        <div className="max-w-2xl mx-auto">
          <div className="glass-card p-8 md:p-12 text-center">
            <motion.div key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <div className="flex justify-center gap-1 mb-5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-gold text-gold" />
                ))}
              </div>
              <p className="text-lg md:text-xl italic text-foreground/80 mb-6 font-heading leading-relaxed">
                "{testimonials[active].text}"
              </p>
              <div className="w-12 h-px bg-gold/50 mx-auto mb-4" />
              <p className="font-semibold text-foreground">{testimonials[active].name}</p>
              <p className="text-sm text-muted-foreground">{testimonials[active].location}</p>
            </motion.div>
          </div>
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-2.5 rounded-full transition-all duration-300 ${i === active ? "bg-primary w-8" : "bg-border w-2.5 hover:bg-primary/40"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

const Newsletter = () => (
  <SectionWrapper className="bg-card/50">
    <div className="container mx-auto px-4 text-center">
      <div className="max-w-xl mx-auto glass-card p-10 md:p-14">
        <Flame className="w-8 h-8 text-gold mx-auto mb-4" />
        <h2 className="text-3xl font-heading font-bold mb-3">Stay Connected</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">Subscribe for exclusive launches, offers, and fragrance stories</p>
        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={e => e.preventDefault()}>
          <input
            type="email"
            placeholder="Your email address"
            className="flex-1 px-5 py-3 rounded-full bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
          />
          <button type="submit" className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:shadow-warm transition-all flex items-center justify-center gap-2 hover:scale-105">
            <Send className="w-4 h-4" /> Subscribe
          </button>
        </form>
      </div>
    </div>
  </SectionWrapper>
);

const Index = () => (
  <>
    <HeroSection />
    <FeaturedProducts />
    <AboutSection />
    <TestimonialSection />
    <Newsletter />
  </>
);

export default Index;

import ProductCard from "@/components/ProductCard";
import SectionWrapper from "@/components/SectionWrapper";
import { motion } from "framer-motion";
import { Sparkles, Loader2 } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";

const Shop = () => {
  const { products, loading, error } = useProducts();

  return (
    <>
      {/* Hero banner */}
      <section className="relative gradient-hero py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 animate-shimmer" />
        <div className="absolute top-10 right-20 w-48 h-48 rounded-full bg-gold/8 blur-3xl" />
        <div className="absolute bottom-10 left-10 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-2 mb-4">
            <div className="h-px w-10 bg-gold/60" />
            <Sparkles className="w-4 h-4 text-gold" />
            <div className="h-px w-10 bg-gold/60" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-5xl font-heading font-bold mb-3">
            Our Collection
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-muted-foreground max-w-lg mx-auto">
            Explore our handcrafted candles, each designed to evoke a unique emotion
          </motion.p>
        </div>
      </section>

      <SectionWrapper>
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <p className="text-center text-muted-foreground py-16">Failed to load products. Please try again.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((p: any, i: number) => (
                <ProductCard key={p._id || p.id} product={p} index={i} />
              ))}
            </div>
          )}
        </div>
      </SectionWrapper>
    </>
  );
};

export default Shop;

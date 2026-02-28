import SectionWrapper from "@/components/SectionWrapper";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const About = () => (
  <>
    {/* Hero */}
    <section className="relative gradient-hero py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 animate-shimmer" />
      <div className="absolute top-10 left-20 w-48 h-48 rounded-full bg-gold/8 blur-3xl" />
      <div className="absolute bottom-10 right-20 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-2 mb-4">
          <div className="h-px w-10 bg-gold/60" />
          <Sparkles className="w-4 h-4 text-gold" />
          <div className="h-px w-10 bg-gold/60" />
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl font-heading font-bold mb-4">
          Our Story
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-lg text-muted-foreground italic font-heading max-w-xl mx-auto">
          Crafting emotions, one fragrance at a time
        </motion.p>
      </div>
    </section>

    <SectionWrapper>
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <p>
            Sakhi Fragrance House was born from a simple belief — that fragrance has the power to transform moments into memories. Founded in the vibrant city of Mumbai, our journey began in a small kitchen where our founder experimented with natural waxes and pure essential oils.
          </p>
          <div className="relative gradient-pink rounded-3xl p-10 text-center overflow-hidden shadow-warm">
            <div className="absolute inset-0 animate-shimmer" />
            <div className="relative z-10">
              <span className="text-6xl block mb-4">🌸</span>
              <p className="font-heading text-xl italic text-foreground/80">
                "Every candle we create is a love letter to the senses"
              </p>
            </div>
          </div>
          <p>
            We believe that fragrance is deeply emotional. The scent of jasmine can transport you to your grandmother's garden. The warmth of sandalwood can recreate the peace of a temple visit. The sweetness of vanilla can bring back childhood memories.
          </p>
          <p>
            Each Sakhi candle is handcrafted using 100% natural soy wax, cotton wicks, and pure essential oils. We source our ingredients ethically and ensure every candle is free from harmful chemicals. Our commitment to quality means each candle burns cleanly for 40+ hours.
          </p>
          <p>
            From our home to yours, Sakhi Fragrance House is more than a brand — it's a companion for your most intimate moments. Whether you're unwinding after a long day, setting the mood for a celebration, or creating a sacred space for meditation, there's a Sakhi candle for every emotion.
          </p>
        </div>
      </div>
    </SectionWrapper>
  </>
);

export default About;

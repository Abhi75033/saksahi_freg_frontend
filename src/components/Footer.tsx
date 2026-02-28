import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter, Mail, MapPin, Phone, Flame } from "lucide-react";

const Footer = () => (
  <footer className="bg-card/60 border-t border-border/40">
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <Flame className="w-5 h-5 text-gold" />
            <h3 className="font-heading text-xl font-semibold">Sakhi Fragrance House</h3>
          </div>
          <p className="text-sm text-muted-foreground italic mb-5">Where Fragrance Meets Emotion</p>
          <div className="flex gap-3">
            {[Instagram, Facebook, Twitter].map((Icon, i) => (
              <a key={i} href="#" className="p-2.5 rounded-full bg-primary/8 hover:bg-primary/15 border border-border/40 hover:border-primary/30 transition-all duration-300 hover:scale-110">
                <Icon className="w-4 h-4 text-primary" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-heading font-semibold mb-4 text-foreground">Quick Links</h4>
          <div className="flex flex-col gap-2.5 text-sm text-muted-foreground">
            {[{ l: "Home", t: "/" }, { l: "Shop", t: "/shop" }, { l: "About", t: "/about" }, { l: "Contact", t: "/contact" }].map(i => (
              <Link key={i.t} to={i.t} className="hover:text-primary transition-colors duration-200">{i.l}</Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-heading font-semibold mb-4 text-foreground">Customer Care</h4>
          <div className="flex flex-col gap-2.5 text-sm text-muted-foreground">
            <Link to="/orders" className="hover:text-primary transition-colors duration-200">Track Order</Link>
            <span className="hover:text-foreground/70 transition-colors cursor-default">Shipping Policy</span>
            <span className="hover:text-foreground/70 transition-colors cursor-default">Return Policy</span>
            <span className="hover:text-foreground/70 transition-colors cursor-default">FAQ</span>
          </div>
        </div>
        <div>
          <h4 className="font-heading font-semibold mb-4 text-foreground">Contact</h4>
          <div className="flex flex-col gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gold flex-shrink-0" />Mumbai, Maharashtra</span>
            <span className="flex items-center gap-2"><Mail className="w-4 h-4 text-gold flex-shrink-0" />hello@sakhifragrance.com</span>
            <span className="flex items-center gap-2"><Phone className="w-4 h-4 text-gold flex-shrink-0" />+91 98765 43210</span>
          </div>
        </div>
      </div>
      <div className="border-t border-border/40 mt-10 pt-6 text-center text-sm text-muted-foreground">
        © 2025 Sakhi Fragrance House. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;

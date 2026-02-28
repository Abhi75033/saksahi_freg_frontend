import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, Heart, Menu, X, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.jpeg";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems } = useCart();
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-background/85 backdrop-blur-xl border-b border-border/30 shadow-soft">
      <div className="container mx-auto px-4 flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Sakhi Fragrance House" className="h-10 md:h-14 rounded-xl shadow-soft" />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium tracking-wide transition-colors duration-300 hover:text-primary relative ${
                location.pathname === link.to ? "text-primary" : "text-foreground/60"
              }`}
            >
              {link.label}
              {location.pathname === link.to && (
                <motion.div layoutId="nav-indicator" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link to="/login" className="p-2.5 rounded-full hover:bg-secondary transition-colors duration-200">
            <User className="w-5 h-5 text-foreground/60" />
          </Link>
          <button className="p-2.5 rounded-full hover:bg-secondary transition-colors duration-200 relative">
            <Heart className="w-5 h-5 text-foreground/60" />
          </button>
          <Link to="/cart" className="p-2.5 rounded-full hover:bg-secondary transition-colors duration-200 relative">
            <ShoppingBag className="w-5 h-5 text-foreground/60" />
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-semibold shadow-warm"
              >
                {totalItems}
              </motion.span>
            )}
          </Link>
          <button className="md:hidden p-2" onClick={() => setMobileOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed inset-0 z-50 bg-background"
          >
            <div className="flex justify-between items-center p-4 border-b border-border/50">
              <img src={logo} alt="Sakhi" className="h-10 rounded-xl" />
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded-full hover:bg-secondary transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex flex-col gap-6 p-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className="text-2xl font-heading font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="border-t border-border/50 pt-6 flex flex-col gap-4">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="text-lg text-foreground/60 hover:text-primary transition-colors">Login</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="text-lg text-foreground/60 hover:text-primary transition-colors">Register</Link>
                <Link to="/orders" onClick={() => setMobileOpen(false)} className="text-lg text-foreground/60 hover:text-primary transition-colors">My Orders</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

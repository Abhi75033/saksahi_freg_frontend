import React, { useEffect, useState } from "react";
import SectionWrapper from "@/components/SectionWrapper";
import ProductCard from "@/components/ProductCard";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Product } from "@/data/products";

const Wishlist = () => {
    const { user, token } = useAuth();
    const [wishlist, setWishlist] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const res = await fetch("https://sakshi-freg-backend.onrender.com/api/users/wishlist", {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
          },
        });
        const data = await res.json();
        setWishlist(data);
      } catch (error) {
        console.error("Error fetching wishlist", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchWishlist();
    }
  }, [user]);

  return (
    <SectionWrapper className="pt-24 pb-12 min-h-[60vh]">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-heading font-bold mb-8 text-center">My Wishlist</h1>
        {isLoading ? (
          <p className="text-center text-muted-foreground">Loading wishlist...</p>
        ) : wishlist.length === 0 ? (
          <div className="text-center space-y-6 max-w-md mx-auto py-12">
            <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">🤍</span>
            </div>
            <h2 className="text-2xl font-heading font-bold">Your wishlist is empty</h2>
            <p className="text-muted-foreground">Looks like you haven't saved any items yet. Explore our collection and find something you love!</p>
            <Link to="/shop" className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:shadow-warm transition-all duration-300 hover:scale-105">
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {wishlist.map((product) => (
              <ProductCard key={product.id || product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </SectionWrapper>
  );
};

export default Wishlist;

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Star, Eye, Heart, ShoppingCart } from "lucide-react";
import ProductQuickView from "@/components/ProductQuickView";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useAuth } from "@/lib/auth-context";

const ProductCard = ({ product, onQuickView }) => {
  const hasDiscount = product.basePrice !== product.regularPrice;
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);

  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!isAuthenticated || !product) return;

      try {
        const response = await fetchApi("/users/wishlist", {
          credentials: "include",
        });

        const wishlistItems = response.data.wishlistItems || [];
        const inWishlist = wishlistItems.some(
          (item) => item.productId === product.id
        );
        setIsInWishlist(inWishlist);
      } catch (error) {
        console.error("Failed to check wishlist status:", error);
      }
    };

    checkWishlistStatus();
  }, [isAuthenticated, product]);

  const handleAddToWishlist = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push(`/login?redirect=/products/${product.slug}`);
      return;
    }

    setIsAddingToWishlist(true);

    try {
      if (isInWishlist) {
        // Get wishlist to find the item ID
        const wishlistResponse = await fetchApi("/users/wishlist", {
          credentials: "include",
        });

        const wishlistItem = wishlistResponse.data.wishlistItems.find(
          (item) => item.productId === product.id
        );

        if (wishlistItem) {
          await fetchApi(`/users/wishlist/${wishlistItem.id}`, {
            method: "DELETE",
            credentials: "include",
          });

          setIsInWishlist(false);
        }
      } else {
        // Add to wishlist
        await fetchApi("/users/wishlist", {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({ productId: product.id }),
        });

        setIsInWishlist(true);
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 hover:border-[#ed1c24] transition-all duration-300 group rounded-lg p-6 h-full shadow-sm hover:shadow-lg">
      <div className="relative mb-4">
        <Link href={`/products/${product.slug || ""}`}>
          <div className="relative h-48 w-full">
            <Image
              src={product.image || "/product-placeholder.jpg"}
              alt={product.name || "Product"}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </Link>

        {product.hasSale && (
          <span className="absolute top-2 left-2 bg-[#ed1c24] text-white px-2 py-1 rounded-md text-sm">
            SALE
          </span>
        )}

        <div className="absolute top-2 right-2 flex flex-col gap-2">
          <Button
            variant="ghost"
            size="sm"
            className={`w-8 h-8 p-0 bg-white hover:bg-[#ed1c24] ${
              isInWishlist ? "text-[#ed1c24]" : "text-gray-600"
            } hover:text-white rounded-full shadow-sm`}
            onClick={handleAddToWishlist}
            disabled={isAddingToWishlist}
          >
            <Heart
              className={`h-4 w-4 ${isInWishlist ? "fill-current" : ""}`}
            />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-8 h-8 p-0 bg-white hover:bg-[#ed1c24] text-gray-600 hover:text-white rounded-full shadow-sm"
            onClick={(e) => {
              e.preventDefault();
              onQuickView(product);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center mb-2">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={
              i < Math.floor(product.avgRating || 0)
                ? "fill-red-400 text-red-400"
                : "text-gray-400"
            }
          />
        ))}
        <span className="ml-2 text-sm text-gray-400">
          ({product.reviewCount || 0})
        </span>
      </div>

      <Link href={`/products/${product.slug || ""}`}>
        <h3 className="text-lg font-semibold mb-2 text-black group-hover:text-[#ed1c24] transition-colors line-clamp-2">
          {product.name}
        </h3>
      </Link>

      <div className="flex items-center justify-between mb-4">
        {hasDiscount ? (
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-[#ed1c24]">
              ₹{product.basePrice || 0}
            </span>
            <span className="text-sm text-gray-400 line-through">
              ₹{product.regularPrice || 0}
            </span>
          </div>
        ) : (
          <span className="text-xl font-bold text-[#ed1c24]">
            ₹{product.basePrice || 0}
          </span>
        )}
      </div>
    </div>
  );
};

export default function ProductCarousel({ title, description, products }) {
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const handleQuickView = (product) => {
    setQuickViewProduct(product);
    setQuickViewOpen(true);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            {title}
          </h2>
          {description && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </motion.div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="relative mx-auto max-w-7xl"
        >
          <CarouselContent>
            {products.map((product, index) => (
              <CarouselItem
                key={product.id || index}
                className="basis-1/2 lg:basis-1/4 xl:basis-1/5 pl-4"
              >
                <ProductCard product={product} onQuickView={handleQuickView} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex absolute -left-12 -translate-x-0 bg-white/80 backdrop-blur-sm border-none shadow-lg hover:bg-red-500 hover:text-white text-black" />
          <CarouselNext className="hidden md:flex absolute -right-12 -translate-x-0 bg-white/80 backdrop-blur-sm border-none shadow-lg hover:bg-red-500 text-black hover:text-white" />
        </Carousel>

        {/* Quick View Dialog */}
        <ProductQuickView
          product={quickViewProduct}
          isOpen={quickViewOpen}
          onClose={() => setQuickViewOpen(false)}
        />
      </div>
    </section>
  );
}

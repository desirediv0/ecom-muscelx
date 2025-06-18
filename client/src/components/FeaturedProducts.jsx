"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Star, Eye, Heart, ShoppingCart } from "lucide-react";
import ProductQuickView from "./ProductQuickView";

const ProductSkeleton = () => (
  <div className="bg-gray-800 rounded-lg shadow-sm overflow-hidden animate-pulse">
    <div className="relative h-64 bg-gray-700"></div>
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-700 rounded w-3/4"></div>
      <div className="h-3 bg-gray-700 rounded w-1/2"></div>
      <div className="h-6 bg-gray-700 rounded w-1/3"></div>
      <div className="h-10 bg-gray-700 rounded"></div>
    </div>
  </div>
);

const FeaturedProducts = ({
  products = [],
  isLoading = false,
  error = null,
}) => {
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  if (!isLoading && !error && products.length === 0) {
    return null;
  }

  if (isLoading) {
    return (
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-500">Failed to load products</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            TOP{" "}
            <span className="text-[#ed1c24]">PRODUCTS</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Discover our best-selling supplements trusted by athletes worldwide
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {products.map((product) => (
            <motion.div
              key={product.id || product.slug || Math.random().toString()}
              variants={fadeInUp}
            >
              <div className="bg-gray-800 border-gray-700 hover:border-[#ed1c24] transition-all duration-300 group rounded-lg p-6">
                <div className="relative mb-4">
                  <Link href={`/products/${product.slug || ""}`}>
                    {product.image ? (
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name || "Product"}
                        width={300}
                        height={300}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ) : (
                      <Image
                        src="/product-placeholder.jpg"
                        alt={product.name || "Product"}
                        width={300}
                        height={300}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    )}
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
                      className="w-8 h-8 p-0 bg-gray-800 hover:bg-[#ed1c24] text-white rounded-full"
                      onClick={(e) => {
                        e.preventDefault();
                        // Wishlist functionality remains same
                      }}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-8 h-8 p-0 bg-gray-800 hover:bg-[#ed1c24] text-white rounded-full"
                      onClick={(e) => {
                        e.preventDefault();
                        setQuickViewProduct(product);
                        setQuickViewOpen(true);
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
                  <h3 className="text-lg font-semibold mb-2 text-white group-hover:text-[#ed1c24] transition-colors">
                    {product.name || "Product"}
                  </h3>
                </Link>

                <div className="flex items-center justify-between mb-4">
                  {product.hasSale ? (
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

                {(product.flavors || 0) > 1 && (
                  <p className="text-sm text-gray-400 mb-4">
                    {product.flavors} variants available
                  </p>
                )}

                <Button
                  className="w-full bg-[#ed1c24] hover:bg-[#ed1c24]/90 text-white"
                  onClick={(e) => {
                    e.preventDefault();
                    console.log("Add to cart:", product);
                  }}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick View Dialog */}
        <ProductQuickView
          product={quickViewProduct}
          open={quickViewOpen}
          onOpenChange={setQuickViewOpen}
        />
      </div>
    </section>
  );
};

export default FeaturedProducts;

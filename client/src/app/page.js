"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight, Star, Truck, Shield, RefreshCw } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { fetchApi } from "@/lib/utils";
import Headtext from "@/components/ui/headtext";
import GymSupplementBanner from "@/components/showcase";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetchApi("/public/products?featured=true"),
          fetchApi("/public/categories"),
        ]);

        if (productsRes?.data?.products) {
          setFeaturedProducts(productsRes.data.products);
        }
        
        if (categoriesRes?.data?.categories) {
          setCategories(categoriesRes.data.categories);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  console.log(featuredProducts);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-red-600 to-red-700 text-white py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl md:text-6xl font-bold leading-tight"
              >
                Elevate Your Fitness Journey with Premium Supplements
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg md:text-xl text-red-100"
              >
                Discover scientifically formulated supplements designed to maximize your performance and achieve your fitness goals faster.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link href="/products">
                  <Button className="w-full sm:w-auto bg-white text-red-600 hover:bg-red-50 text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                    Shop Now
                  </Button>
                </Link>
                <Link href="/categories">
                  <Button variant="outline" className="w-full sm:w-auto border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6 rounded-xl transition-all duration-300">
                    Explore Categories
                  </Button>
                </Link>
              </motion.div>
            </div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative h-[400px] md:h-[500px]"
            >
              <Image
                src="/c3.jpg"
                alt="Fitness Supplements"
                fill
                className="object-contain"
                priority
              /> 
            </motion.div>
          </div>
        </div>
      </section> 

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Truck className="h-8 w-8" />,
                title: "Free Shipping",
                description: "On all orders over ₹999",
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: "Authentic Products",
                description: "100% genuine supplements",
              },
              {
                icon: <RefreshCw className="h-8 w-8" />,
                title: "Easy Returns",
                description: "30-day return policy",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="text-red-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Headtext text="Shop by Category" className="text-center mb-12" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, idx) => (
              <motion.div
                key={category._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              > 
                <Link href={`/category/${category.slug}`}>
                  <div className="group relative aspect-square overflow-hidden rounded-2xl bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-300">
                    <Image
                      src={category.image || "/category-placeholder.jpg"}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />         
                    <div className="absolute inset-0 bg-gradient-to-t from-red-600/80 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-lg font-semibold text-white">
                        {category.name}
                      </h3>     
                      <p className="text-sm text-white/80">
                        {category.productCount || 0} Products
                      </p> 
                    </div>  
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/categories">
              <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                View All Categories
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <GymSupplementBanner />
      {/* Featured Products Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <Headtext text="Featured Products" className="text-center mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, idx) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <Link href={`/products/${product.slug}`}>
                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                    <div className="relative aspect-square">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                      {product.discount > 0 && (
                        <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          {product.discount}% OFF
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-gray-800">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(product.rating || 0)
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          ({product.reviewCount || 0})
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-lg font-bold text-red-600">
                            ₹{product.price?.toLocaleString()}
                          </span>
                          {product.originalPrice && (
                            <span className="ml-2 text-sm text-gray-500 line-through">
                              ₹{product.originalPrice?.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <Button className="bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-red-600 rounded-3xl p-8 md:p-12 shadow-xl">
            <div className="max-w-2xl mx-auto text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Subscribe to Our Newsletter
              </h2>
              <p className="text-red-100 mb-8">
                Get the latest updates on new products, special offers, and fitness tips.
              </p>
              <form className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 py-6 text-lg rounded-xl border-0 focus:ring-2 focus:ring-white/20"
                />
                <Button className="bg-white text-red-600 hover:bg-red-50 py-6 px-8 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

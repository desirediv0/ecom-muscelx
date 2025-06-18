"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Badge } from "@/components/ui/badge";
import { Search, ArrowRight, Star, Truck, Shield, RefreshCw, ChevronRight, Dumbbell, StarsIcon, Clock, ShieldCheck, Award } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { fetchApi } from "@/lib/utils";
import Headtext from "@/components/ui/headtext";
import GymSupplementBanner from "@/components/showcase";

const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const fadeInUp = {
  initial: {
    y: 60,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  },
};

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
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105"
          style={{
            backgroundImage: "url('/banner-background.jpg')",
            animation: "slowZoom 20s infinite alternate",
          }}
        />

        <div className="relative z-20 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl text-white md:text-6xl font-bold mb-6 leading-tight tracking-tight"
            >
              FUEL YOUR
              <span className="text-[#ed1c24] block mt-2 font-extrabold">
                STRENGTH
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto text-gray-200 leading-relaxed"
            >
              Premium supplements and equipment for serious athletes. Transform
              your body, unleash your potential.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="bg-[#ed1c24] hover:bg-[#ed1c24]/90 text-lg px-10 py-6 rounded-xl font-semibold shadow-lg hover:shadow-[#ed1c24]/20 hover:shadow-2xl transition-all duration-300"
                >
                  Shop Now
                  <ChevronRight className="ml-2" size={20} />
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-black hover:bg-white hover:text-black text-lg px-10 py-6 rounded-xl font-semibold backdrop-blur-sm"
                >
                  Explore Products
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="text-[#ed1c24] font-semibold text-lg mb-4 block">
              Categories
            </span>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
              SHOP BY <span className="text-[#ed1c24]">CATEGORY</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find the perfect supplements for your fitness goals
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          >
            {categories.map((category, index) => (
              <motion.div
                key={category._id}
                variants={fadeInUp}
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="group cursor-pointer"
              >
                <Link href={`/category/${category.slug}`}>
                  <div className="relative bg-gray-900 rounded-3xl overflow-hidden border-2 border-gray-800 hover:border-[#ed1c24] transition-all duration-500 shadow-xl hover:shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-10" />
                    <div className="h-[400px] bg-cover bg-center relative">
                      <Image
                        src={category.image || "/category-placeholder.jpg"}
                        alt={category.name}
                        fill
                        className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-[#ed1c24]/10 group-hover:bg-[#ed1c24]/20 transition-all duration-500" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                      <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                        <Dumbbell />
                      </div>
                      <h3 className="text-xl font-bold text-white group-hover:text-[#ed1c24] transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-gray-300 mb-2 group-hover:text-white transition-colors">
                        {category.description || "Premium Products"}
                      </p>
                      <p className="text-sm text-[#ed1c24] font-semibold inline-flex items-center">
                        {category.productCount || 0}+ Products
                        <ChevronRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <Link href="/categories">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-[#ed1c24] text-[#ed1c24] hover:bg-[#ed1c24] hover:text-white text-lg px-10 py-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                View All Categories
                <ChevronRight className="ml-2" size={20} />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <GymSupplementBanner />

      {/* Featured Products Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800">
              TOP <span className="text-[#ed1c24]">PRODUCTS</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our best-selling supplements trusted by athletes
              worldwide
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {featuredProducts.map((product) => (
              <motion.div key={product._id} variants={fadeInUp}>
                <div className="bg-white border border-gray-200 rounded-xl hover:border-[#ed1c24] transition-all duration-300 group shadow-lg hover:shadow-xl">
                  <div className="p-6">
                    <div className="relative mb-4">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={300}
                        height={300}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      {product.discount > 0 && (
                        <Badge className="absolute top-2 left-2 bg-[#ed1c24] hover:bg-[#ed1c24] text-white">
                          {product.discount}% OFF
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={
                            i < Math.floor(product.rating || 0)
                              ? "fill-red-400 text-red-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-500">
                        ({product.reviewCount || 0})
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-[#ed1c24] transition-colors text-gray-800">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-[#ed1c24]">
                          ₹{product.price?.toLocaleString()}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-400 line-through">
                            ₹{product.originalPrice?.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button className="w-full mt-4 bg-[#ed1c24] hover:bg-[#ed1c24]/90 text-white">
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-16 bg-white overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ed1c24' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        {/* Red accent stripes */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ed1c24] to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ed1c24] to-transparent"></div>

        <div className="relative max-w-7xl mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#ed1c24] text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <Award className="h-4 w-4" />
              <span>Premium Service</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Why Choose <span className="text-[#ed1c24]">MuscleX</span>?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience premium quality and service with every order
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Truck className="h-10 w-10" />,
                title: "Free Shipping",
                description: "On all orders over ₹999",
                subtitle: "Fast & Reliable Delivery",
              },
              {
                icon: <Shield className="h-10 w-10" />,
                title: "Authentic Products",
                description: "100% genuine supplements",
                subtitle: "Lab Tested & Certified",
              },
              {
                icon: <RefreshCw className="h-10 w-10" />,
                title: "Easy Returns",
                description: "30-day return policy",
                subtitle: "Hassle-Free Exchange",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative bg-white rounded-2xl border-2 border-gray-100 hover:border-[#ed1c24]/20 transition-all duration-500 overflow-hidden"
              >
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#ed1c24]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Content */}
                <div className="relative p-8">
                  {/* Icon */}
                  <div className="w-16 h-16 bg-gradient-to-br from-[#ed1c24] to-red-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                    <div className="text-white">{feature.icon}</div>
                  </div>

                  {/* Text content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#ed1c24] transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-base mb-2 leading-relaxed">
                    {feature.description}
                  </p>
                  <p className="text-sm text-[#ed1c24] font-medium">
                    {feature.subtitle}
                  </p>

                  {/* Corner accent */}
                  <div className="absolute top-4 right-4">
                    <div className="w-8 h-8 border-2 border-[#ed1c24]/20 rounded-lg flex items-center justify-center group-hover:border-[#ed1c24] group-hover:bg-[#ed1c24] transition-all duration-300">
                      <StarsIcon className="h-4 w-4 text-[#ed1c24] group-hover:text-white transition-colors duration-300" />
                    </div>
                  </div>
                </div>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-[#ed1c24] to-red-600 group-hover:w-full transition-all duration-500"></div>
              </motion.div>
            ))}
          </div>

          {/* Trust indicators */}
          <div className="mt-12 pt-8 border-t border-gray-100">
            <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#ed1c24]" />
                <span className="text-sm font-medium">24/7 Support</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[#ed1c24]" />
                <span className="text-sm font-medium">Secure Payment</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-[#ed1c24]" />
                <span className="text-sm font-medium">
                  Trusted by 50K+ Customers
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="relative bg-gradient-to-r from-gray-900 to-black rounded-[2.5rem] p-12 md:p-16 overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#ed1c24]/20 to-transparent" />
            <div className="relative z-10 max-w-2xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
                  Stay Updated with
                  <span className="text-[#ed1c24] block mt-2">
                    Latest Offers
                  </span>
                </h2>
                <p className="text-xl text-gray-300 mb-10">
                  Get exclusive updates on new products, special offers, and
                  fitness tips delivered straight to your inbox.
                </p>
                <form className="flex flex-col sm:flex-row gap-4">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 py-7 text-lg rounded-xl bg-white/10 border-0 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-[#ed1c24]/50"
                  />
                  <Button className="bg-[#ed1c24] hover:bg-[#ed1c24]/90 text-white py-7 px-10 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                    Subscribe
                    <ChevronRight className="ml-2" size={20} />
                  </Button>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

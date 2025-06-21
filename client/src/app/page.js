"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Star,
  Truck,
  Shield,
  RefreshCw,
  ChevronRight,
  Dumbbell,
  Award,
  Zap,
  Target,
  TrendingUp,
  Users,
  CheckCircle,
  Flame,
  Eye,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { fetchApi } from "@/lib/utils";
import ProductQuickView from "@/components/ProductQuickView";

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

const scaleIn = {
  initial: {
    scale: 0.8,
    opacity: 0,
  },
  animate: {
    scale: 1,
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
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const testimonials = [
    {
      name: "Rahul Sharma",
      role: "Professional Bodybuilder",
      content: "Best supplements I've ever used. Quality is unmatched!",
      rating: 5,
      image: "/testimonial1.jpg",
    },
    {
      name: "Priya Singh",
      role: "Fitness Enthusiast",
      content: "Amazing results in just 3 months. Highly recommended!",
      rating: 5,
      image: "/testimonial2.jpg",
    },
    {
      name: "Arjun Patel",
      role: "Gym Owner",
      content: "My clients love these products. Fast delivery too!",
      rating: 5,
      image: "/testimonial3.jpg",
    },
  ];

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
          const transformedCategories = categoriesRes.data.categories.map(
            (cat) => ({
              ...cat,
              productCount: cat._count?.products || 0,
            })
          );
          setCategories(transformedCategories);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500"></div>
          <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-2 border-red-500 opacity-20"></div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section with Video/Image Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/video.mp4" type="video/mp4" />
            {/* Fallback to image if video fails */}
            <Image
              src="/bg.png"
              alt="Gym Background"
              fill
              className="object-cover"
              priority
            />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />
        </div>

        {/* Floating Elements */}
        <motion.div
          animate={{
            y: [-20, 20, -20],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-10 w-20 h-20 bg-red-500/20 rounded-full blur-xl z-10"
        />

        <div className="relative z-20 container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 px-6 py-3 rounded-full text-sm font-semibold mb-8 backdrop-blur-sm"
              >
                <Flame className="h-4 w-4" />
                <span>Premium Supplements</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-5xl lg:text-7xl font-black mb-6 leading-tight"
              >
                <span className="text-white">UNLEASH</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">
                  YOUR POWER
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl text-gray-200 mb-8 max-w-lg leading-relaxed"
              >
                Transform your physique with premium supplements trusted by
                champions. Fuel your ambition, exceed your limits.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 mb-8"
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-6 text-lg font-bold rounded-xl shadow-lg hover:shadow-red-500/25 transition-all duration-300 group"
                >
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="grid grid-cols-3 gap-6"
              >
                {[
                  { number: "50K+", label: "Happy Customers" },
                  { number: "100+", label: "Premium Products" },
                  { number: "99%", label: "Satisfaction Rate" },
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-red-500">
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-300">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Content - Product Showcase */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-600/20 rounded-full blur-3xl scale-150" />

                {/* Product Image */}
                <motion.div
                  animate={{
                    y: [-10, 10, -10],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                  className="relative z-10"
                >
                  <Image
                    src="/bg.png"
                    alt="Premium Supplement"
                    width={800}
                    height={600}
                    className="w-full max-w-md mx-auto drop-shadow-2xl"
                  />
                </motion.div>

                {/* Floating Cards */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="absolute top-10 -left-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span className="text-white text-sm font-semibold">
                      Lab Tested
                    </span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1 }}
                  className="absolute bottom-20 right-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4"
                >
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-400" />
                    <span className="text-white text-sm font-semibold">
                      Fast Results
                    </span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              className="w-1 h-3 bg-white/50 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Target className="h-4 w-4" />
              <span>Shop by Category</span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-black mb-6 text-gray-900">
              FIND YOUR{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">
                FUEL
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover premium supplements tailored for every fitness goal
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
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
                  <div className="relative bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-red-300 transition-all duration-500 shadow-lg hover:shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />

                    {/* Category Image */}
                    <div className="h-64 relative overflow-hidden">
                      <Image
                        src={category.image || "/category-placeholder.jpg"}
                        alt={category.name}
                        fill
                        className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-red-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Dumbbell className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white group-hover:text-red-300 transition-colors">
                            {category.name}
                          </h3>
                          <p className="text-gray-300 text-sm">
                            {category.productCount || 0}+ Products
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center text-red-300 font-semibold group-hover:text-red-200 transition-colors">
                        <span className="text-sm">Explore Now</span>
                        <ChevronRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

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
            <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <TrendingUp className="h-4 w-4" />
              <span>Best Sellers</span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-black mb-6 text-gray-900">
              TOP{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">
                PERFORMERS
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our most popular supplements trusted by athletes
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
              <motion.div key={product.id} variants={scaleIn}>
                <div className="bg-white border border-gray-200 rounded-2xl hover:border-red-300 transition-all duration-300 group shadow-lg hover:shadow-xl overflow-hidden flex flex-col h-full">
                  <div className="p-6 flex-grow">
                    {/* Product Image */}
                    <div className="relative mb-6 overflow-hidden rounded-xl bg-gray-50">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        width={300}
                        height={300}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {product.hasSale && (
                        <Badge className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0">
                          SALE
                        </Badge>
                      )}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={
                            i < Math.round(product.avgRating || 0)
                              ? "fill-red-400 text-red-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-500">
                        ({product.reviewCount || 0})
                      </span>
                    </div>

                    {/* Product Name */}
                    <h3 className="text-lg font-bold mb-4 group-hover:text-red-600 transition-colors text-gray-900 line-clamp-2 h-14">
                      {product.name}
                    </h3>

                    {/* Price */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-red-600">
                          {product.basePrice
                            ? `₹${product.basePrice.toLocaleString()}`
                            : ""}
                        </span>
                        {product.hasSale && product.regularPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            ₹{product.regularPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Action Buttons */}
                  <div className="p-6 pt-0 mt-auto">
                    <div className="flex flex-col space-y-2">
                      <Button
                        onClick={() => handleQuickView(product)}
                        className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 rounded-xl font-semibold py-3 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-red-500/25"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Quick View
                      </Button>
                      <Link
                        href={`/products/${product.slug}`}
                        className="w-full"
                      >
                        <Button
                          variant="outline"
                          className="w-full border-gray-300 text-gray-700 hover:border-red-500 hover:text-red-500 hover:bg-red-50"
                        >
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Award className="h-4 w-4" />
              <span>Why Choose Us</span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-black mb-6 text-gray-900">
              PREMIUM{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">
                EXPERIENCE
              </span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Truck className="h-8 w-8" />,
                title: "Lightning Fast Delivery",
                description: "Free shipping on orders over ₹999",
                subtitle: "Same day dispatch available",
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: "100% Authentic",
                description: "Lab tested & certified products",
                subtitle: "Direct from manufacturers",
              },
              {
                icon: <RefreshCw className="h-8 w-8" />,
                title: "Easy Returns",
                description: "30-day hassle-free returns",
                subtitle: "Money back guarantee",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group relative bg-white rounded-2xl border border-gray-200 hover:border-red-300 transition-all duration-500 overflow-hidden shadow-lg hover:shadow-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                    <div className="text-white">{feature.icon}</div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-base mb-2 leading-relaxed">
                    {feature.description}
                  </p>
                  <p className="text-sm text-red-600 font-medium">
                    {feature.subtitle}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Users className="h-4 w-4" />
              <span>Customer Reviews</span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-black mb-6 text-gray-900">
              SUCCESS{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">
                STORIES
              </span>
            </h2>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-50 rounded-2xl border border-gray-200 p-8 text-center shadow-lg"
              >
                <div className="flex justify-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-6 w-6 fill-red-400 text-red-400"
                    />
                  ))}
                </div>

                <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                  "{testimonials[currentTestimonial].content}"
                </p>

                <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">
                      {testimonials[currentTestimonial].name.charAt(0)}
                    </span>
                  </div>
                  <div className="text-left">
                    <div className="text-gray-900 font-semibold">
                      {testimonials[currentTestimonial].name}
                    </div>
                    <div className="text-gray-600 text-sm">
                      {testimonials[currentTestimonial].role}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Testimonial Indicators */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial
                      ? "bg-red-500 scale-125"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="relative bg-gradient-to-r from-red-500 to-red-600 rounded-3xl p-12 md:p-16 overflow-hidden">
            <div className="absolute inset-0 bg-[url('/newsletter-pattern.svg')] opacity-10" />

            <div className="relative z-10 max-w-2xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl lg:text-5xl font-black mb-6 text-white leading-tight">
                  JOIN THE
                  <span className="block mt-2">ELITE CLUB</span>
                </h2>
                <p className="text-xl text-red-100 mb-10">
                  Get exclusive access to new products, special offers, and
                  expert fitness tips
                </p>

                <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 py-4 text-lg rounded-xl bg-white/10 border-0 text-white placeholder:text-red-200 focus:ring-2 focus:ring-white/50 backdrop-blur-sm"
                  />
                  <Button className="bg-white text-red-600 hover:bg-gray-100 py-4 px-8 rounded-xl text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300">
                    Subscribe
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </form>

                <p className="text-red-100 text-sm mt-4">
                  Join 50,000+ fitness enthusiasts. Unsubscribe anytime.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Quick View Modal */}
      <ProductQuickView
        product={selectedProduct}
        open={isQuickViewOpen}
        onOpenChange={setIsQuickViewOpen}
      />
    </main>
  );
}

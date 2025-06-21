"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  Star,
  ArrowRight,
  Quote,
  ChevronLeft,
  ChevronRight,
  Mail,
  Sparkles,
} from "lucide-react";

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Fitness Enthusiast",
    content:
      "MuselX whey protein has completely transformed my workout results. I've gained 8kg of lean muscle in just 4 months!",
    rating: 5,
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    name: "Priya Patel",
    role: "Professional Athlete",
    content:
      "The quality and taste of MuselX supplements are unmatched. It's been my go-to choice for 2 years now.",
    rating: 5,
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    name: "Amit Kumar",
    role: "Gym Trainer",
    content:
      "I recommend MuselX to all my clients. The results speak for themselves - pure quality and effectiveness.",
    rating: 5,
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    name: "Sneha Gupta",
    role: "Nutritionist",
    content:
      "MuselX products are scientifically formulated and deliver consistent results. Perfect for serious fitness goals.",
    rating: 5,
    image: "/placeholder.svg?height=60&width=60",
  },
];

export function TestimonialsNewsletter() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <>
      {/* Testimonials Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-red-100 to-transparent rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-red-50 to-transparent rounded-full blur-3xl opacity-40" />

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-600 px-6 py-3 rounded-full text-sm font-semibold mb-6 shadow-sm">
              <Users className="h-4 w-4" />
              <span>Customer Reviews</span>
              <Sparkles className="h-4 w-4" />
            </div>
            <h2 className="text-4xl lg:text-6xl font-black mb-6 text-gray-900 leading-tight">
              SUCCESS{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-red-700">
                STORIES
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real transformations from real people who trust MuselX
            </p>
          </motion.div>

          <div className="relative max-w-5xl mx-auto">
            {/* Main Testimonial Card */}
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="relative bg-white rounded-3xl border border-gray-100 p-8 md:p-12 shadow-2xl shadow-red-500/10"
                >
                  {/* Quote Icon */}
                  <div className="absolute -top-6 left-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Quote className="h-6 w-6 text-white" />
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex justify-center mb-8">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1, duration: 0.3 }}
                      >
                        <Star className="h-6 w-6 fill-yellow-400 text-yellow-400 mx-1" />
                      </motion.div>
                    ))}
                  </div>

                  {/* Testimonial Content */}
                  <p className="text-2xl md:text-3xl text-gray-800 mb-10 leading-relaxed text-center font-medium">
                    &quot;{testimonials[currentTestimonial].content}&quot;
                  </p>

                  {/* Author Info */}
                  <div className="flex items-center justify-center gap-6">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-xl">
                          {testimonials[currentTestimonial].name.charAt(0)}
                        </span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="text-gray-900 font-bold text-xl">
                        {testimonials[currentTestimonial].name}
                      </div>
                      <div className="text-red-600 font-semibold">
                        {testimonials[currentTestimonial].role}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              <button
                onClick={prevTestimonial}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white hover:bg-red-50 border border-gray-200 hover:border-red-300 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600 group-hover:text-red-600" />
              </button>
              <button
                onClick={nextTestimonial}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white hover:bg-red-50 border border-gray-200 hover:border-red-300 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group"
              >
                <ChevronRight className="h-5 w-5 text-gray-600 group-hover:text-red-600" />
              </button>
            </div>

            {/* Testimonial Indicators */}
            <div className="flex justify-center gap-3 mt-12">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`transition-all duration-300 ${
                    index === currentTestimonial
                      ? "w-8 h-3 bg-gradient-to-r from-red-500 to-red-600 rounded-full"
                      : "w-3 h-3 bg-gray-300 hover:bg-gray-400 rounded-full"
                  }`}
                />
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
              {[
                { number: "50K+", label: "Happy Customers" },
                { number: "4.9★", label: "Average Rating" },
                { number: "98%", label: "Satisfaction Rate" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="text-3xl font-black text-gray-900 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gray-50 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="relative bg-gradient-to-br from-red-700 via-red-600 to-red-700 rounded-3xl p-12 md:p-16 overflow-hidden shadow-2xl">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl" />
              <div className="absolute top-20 right-20 w-32 h-32 bg-white rounded-full blur-2xl" />
              <div className="absolute bottom-10 left-20 w-24 h-24 bg-white rounded-full blur-xl" />
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-white rounded-full blur-3xl" />
            </div>

            {/* Floating Elements */}
            <div className="absolute top-8 right-8 w-16 h-16 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <div className="absolute bottom-8 left-8 w-12 h-12 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>

            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-full text-sm font-semibold mb-8">
                  <Mail className="h-4 w-4" />
                  <span>Newsletter</span>
                </div>

                <h2 className="text-4xl lg:text-6xl font-black mb-6 text-white leading-tight">
                  JOIN THE
                  <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-orange-300">
                    ELITE CLUB
                  </span>
                </h2>
                <p className="text-xl text-red-100 mb-12 leading-relaxed">
                  Get exclusive access to new products, special offers, and
                  expert fitness tips delivered straight to your inbox
                </p>

                <form
                  onSubmit={handleSubscribe}
                  className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto mb-8"
                >
                  <div className="flex-1 relative">
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full py-4 px-6 text-lg rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white placeholder:text-red-200 focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubscribed}
                    className="bg-white text-red-600 hover:bg-gray-100 py-4 px-8 rounded-2xl text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                  >
                    {isSubscribed ? (
                      <>
                        <span>Subscribed!</span>
                        <Sparkles className="ml-2 h-5 w-5" />
                      </>
                    ) : (
                      <>
                        <span>Subscribe</span>
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

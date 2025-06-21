"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Zap, Award, Target, TrendingUp } from "lucide-react"

export default function GymSupplementBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-red-900/10 to-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          className="grid lg:grid-cols-2 gap-12 items-center"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Left Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 }}
                className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-full text-sm font-semibold mb-6"
              >
                <Award className="h-4 w-4" />
                <span>Premium Formula</span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5 }}
                className="text-4xl lg:text-6xl font-black mb-6 text-white leading-tight"
              >
                PURE{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">POWER</span>
                <br />
                <span className="text-2xl lg:text-3xl font-normal text-gray-300">Unleashed</span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6 }}
                className="text-xl text-gray-300 leading-relaxed mb-8"
              >
                Advanced natural protein formula with 25g protein per serving. Sourced from premium ingredients, our
                supplements are engineered for maximum performance and rapid recovery.
              </motion.p>
            </div>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.7 }}
              className="grid grid-cols-2 gap-4 mb-8"
            >
              {[
                { icon: <Zap className="h-5 w-5" />, text: "Fast Absorption" },
                { icon: <Target className="h-5 w-5" />, text: "25g Protein" },
                { icon: <Award className="h-5 w-5" />, text: "Lab Tested" },
                { icon: <TrendingUp className="h-5 w-5" />, text: "Proven Results" },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-red-500/50 transition-colors duration-300"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center text-white">
                    {feature.icon}
                  </div>
                  <span className="text-white font-semibold">{feature.text}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-6 text-lg font-bold rounded-xl shadow-lg hover:shadow-red-500/25 transition-all duration-300 group"
              >
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/20 text-white hover:bg-white hover:text-slate-900 px-8 py-6 text-lg font-bold rounded-xl backdrop-blur-sm transition-all duration-300"
              >
                Learn More
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Side - Product Showcase */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative">
              {/* Glow Effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full blur-3xl scale-150" />

              {/* Floating Elements */}
              <motion.div
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                className="absolute top-10 right-10 w-20 h-20 border-2 border-red-500/30 rounded-full"
              />

              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="absolute bottom-20 left-10 w-16 h-16 bg-red-500/20 rounded-full blur-xl"
              />

              {/* Main Product */}
              <motion.div
                animate={{
                  y: [-15, 15, -15],
                }}
                transition={{
                  duration: 6,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
                className="relative z-10 flex justify-center"
              >
                <div className="relative">
                  <Image src="/c3.jpg" alt="Premium Supplement" width={400} height={500} className="drop-shadow-2xl" />

                  {/* Product Highlight Cards */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="absolute -top-5 -left-5 bg-gradient-to-br from-green-500 to-green-600 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg"
                  >
                    ✓ 100% Natural
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 1.2, duration: 0.5 }}
                    className="absolute -bottom-5 -right-5 bg-gradient-to-br from-blue-500 to-blue-600 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg"
                  >
                    ⚡ Fast Results
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

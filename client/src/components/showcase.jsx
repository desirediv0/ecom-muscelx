"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";


export default function GymSupplementBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Colors extracted from the Natural Supps logo
  const colors = {
    brown: "#5D4037", // Dark brown from mountains
    gold: "#D68C16", // Gold/yellow from text
    cream: "#F5F5DC", // Cream background
    darkBrown: "#3E2723", // Darker brown for accents
  };

  return (
    <div className="w-full bg-gradient-to-b from-white to-[#FFEBEE] text-[#F44336] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="flex flex-col md:flex-row"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* Left Side - Text Content */}
          <motion.div
            className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-white/80 rounded-2xl shadow-xl my-8 md:my-16 mx-2 md:mx-8 border-2 border-[#FFCDD2]"
            initial={{ opacity: 0, x: -30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {/* <div className="mb-6 max-w-[200px] md:max-w-[240px]">
              <Image
                src="/logo (2).png"
                alt="Natural Supps Logo"
                width={240}
                height={120}
                className="w-full h-auto"
              />
            </div> */}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-lg font-bold text-[#F44336] tracking-widest uppercase">
                Premium Collection
              </h2>
              <h1 className="text-4xl md:text-5xl font-extrabold mt-2 tracking-tight text-[#F44336]">
                PURE <span className="text-[#E53935]">NATURE</span>
              </h1>
              <div className="h-1 w-16 bg-[#F44336] mt-4 mb-6 rounded-full"></div>
            </motion.div>

            <motion.p
              className="text-[#E53935] leading-relaxed max-w-lg mb-6 text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 }}
            >
              Advanced natural protein formula with 25g protein per serving.
              Sourced from the mountains, our supplements are designed for
              maximum performance and rapid recovery. Fuel your ambition with
              our naturally formulated supplements.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-3 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.7 }}
            >
              {[
                "100% Natural",
                "25g Protein",
                "Mountain Sourced",
                "No Additives",
              ].map((feature, index) => (
                <div
                  key={index}
                  className="border-2 border-[#F44336]/30 bg-[#FFCDD2]/60 px-4 py-2 rounded-md text-base font-semibold text-[#F44336] shadow-sm"
                >
                  {feature}
                </div>
              ))}
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 mt-2"
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8 }}
            >
              <motion.button
                className="bg-[#F44336] text-white hover:bg-[#E53935] font-bold py-3 px-8 rounded-lg shadow-lg border-2 border-[#F44336] transition-all text-lg"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                SHOP NOW
              </motion.button>

              <motion.button
                className="bg-white border-2 border-[#F44336] hover:bg-[#F44336]/10 text-[#F44336] font-bold py-3 px-8 rounded-lg shadow-lg transition-all text-lg"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                LEARN MORE
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Side - Product Image with Effects */}
          <motion.div
            className="w-full md:w-1/2 relative flex items-center justify-center"
            initial={{ opacity: 0, x: 30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="h-full min-h-[400px] md:min-h-[500px] relative overflow-hidden bg-gradient-to-b from-white to-[#FFEBEE] rounded-2xl shadow-xl border-2 border-[#FFCDD2] w-full flex items-center justify-center">
              {/* Mountain-inspired Shapes */}
              <motion.div
                className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-[#F44336]/10 rotate-45"
                animate={{
                  rotate: [45, 90, 45],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 8,
                  ease: "easeInOut",
                }}
              />

              <motion.div
                className="absolute bottom-1/3 right-1/3 w-40 h-40 border-2 border-[#F44336]/10 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 6,
                  ease: "easeInOut",
                }}
              />

              {/* Product Image */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center z-10"
                initial={{ y: 30, opacity: 0 }}
                animate={isVisible ? { y: 0, opacity: 1 } : {}}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <div className="relative w-[280px] h-[400px] md:w-[350px] md:h-[500px] drop-shadow-2xl">
                  <Image
                    src="/c3.jpg"
                    alt="Natural Protein Supplement"
                    fill
                    className="object-contain"
                  />
                </div>
              </motion.div>

              {/* Mountain silhouette inspired by the logo */}
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-24 opacity-10"
                initial={{ y: 30, opacity: 0 }}
                animate={isVisible ? { y: 0, opacity: 0.1 } : {}}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                <svg
                  viewBox="0 0 1200 200"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full"
                >
                  <path
                    d="M0,200 L200,100 L300,150 L400,50 L500,120 L600,20 L700,80 L800,30 L900,90 L1000,40 L1100,70 L1200,10 L1200,200 Z"
                    fill="#F44336"
                  />
                </svg>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

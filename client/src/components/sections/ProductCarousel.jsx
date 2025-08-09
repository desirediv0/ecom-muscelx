"use client";

import { useState } from "react";

import { motion } from "framer-motion";
import { Star, Eye, Heart } from "lucide-react";
import ProductQuickView from "@/components/ProductQuickView";
import ProductCard from "@/components/ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Using shared ProductCard in carousel items

export default function ProductCarousel({ title, description, products }) {
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
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex absolute -left-12 -translate-x-0 bg-white/80 backdrop-blur-sm border-none shadow-lg hover:bg-red-500 hover:text-white text-black" />
          <CarouselNext className="hidden md:flex absolute -right-12 -translate-x-0 bg-white/80 backdrop-blur-sm border-none shadow-lg hover:bg-red-500 text-black hover:text-white" />
        </Carousel>
      </div>
    </section>
  );
}

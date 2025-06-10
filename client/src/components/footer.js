"use client";

import Link from "next/link";
import {
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      console.log("Subscribing email:", email);
      setSubscribed(true);
      setEmail("");

      // Reset after 5 seconds
      setTimeout(() => {
        setSubscribed(false);
      }, 5000);
    }
  };

  return (
    <footer className="bg-white text-gray-900 border-t border-gray-200 mt-12">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* About MuscelX */}
          <div>
            <div className="mb-6">
              <div className="bg-primary px-5 py-2 rounded-xl shadow-lg inline-block">
                <span className="text-2xl font-extrabold text-white uppercase tracking-wide">muscelx</span>
              </div>
            </div>
            <p className="text-gray-600 mb-6 text-base leading-relaxed font-poppins">
              MuscelX is India&apos;s premium fitness nutrition brand, dedicated to providing high-quality supplements and nutritional products to help you achieve your fitness goals.
            </p>
            {/* Social media links */}
            <div className="flex space-x-3 mt-4">
              {[{ icon: <Instagram size={18} />, href: "#" }, { icon: <Facebook size={18} />, href: "#" }, { icon: <Twitter size={18} />, href: "#" }, { icon: <Youtube size={18} />, href: "#" }].map((social, idx) => (
                <Link key={idx} href={social.href} className="w-10 h-10 bg-primary/10 hover:bg-primary flex items-center justify-center rounded-full text-primary hover:text-white transition-colors duration-300 border border-primary/20">
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Product Categories */}
          <div>
            <h3 className="text-gray-900 font-bold text-lg mb-2">Product Categories</h3>
            <div className="w-12 h-1 bg-primary mb-6 rounded-full"></div>
            <ul className="space-y-3">
              {[{ label: "Whey Protein", href: "/category/whey-protein" }, { label: "Plant-Based Protein", href: "/category/plant-protein" }, { label: "Casein Protein", href: "/category/casein-protein" }, { label: "Mass Gainers", href: "/category/mass-gainers" }, { label: "Protein Bars", href: "/category/protein-bars" }, { label: "Pre-Workout", href: "/category/pre-workout" }, { label: "Post-Workout", href: "/category/post-workout" }, { label: "BCAA & EAA", href: "/category/bcaa-eaa" }].map((link, idx) => (
                <li key={idx}>
                  <Link href={link.href} className="text-gray-700 hover:text-primary transition-colors duration-200 text-base flex items-center font-medium">
                    <span className="mr-2 text-primary">›</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Products */}
          <div>
            <h3 className="text-gray-900 font-bold text-lg mb-2">More Products</h3>
            <div className="w-12 h-1 bg-primary mb-6 rounded-full"></div>
            <ul className="space-y-3">
              {[{ label: "Creatine & HMB", href: "/category/creatine-hmb" }, { label: "Glutamine", href: "/category/glutamine" }, { label: "Protein Foods", href: "/category/protein-foods" }, { label: "Weight Loss Support", href: "/category/weight-loss" }, { label: "Multivitamins", href: "/category/multivitamins" }, { label: "Omega 3 Fatty Acids", href: "/category/omega-3" }, { label: "Workout Accessories", href: "/category/accessories" }, { label: "Gym Clothing", href: "/category/clothing" }].map((link, idx) => (
                <li key={idx}>
                  <Link href={link.href} className="text-gray-700 hover:text-primary transition-colors duration-200 text-base flex items-center font-medium">
                    <span className="mr-2 text-primary">›</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-gray-900 font-bold text-lg mb-2">Contact Us</h3>
            <div className="w-12 h-1 bg-primary mb-6 rounded-full"></div>
            <div className="space-y-4 text-base">
              <div className="flex items-start">
                <MapPin size={18} className="text-primary mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-700">A-36, Sector 83, Noida - 201305, Uttar Pradesh (India)</span>
              </div>
              <div className="flex items-center">
                <Mail size={18} className="text-primary mr-3 flex-shrink-0" />
                <span className="text-gray-700">support@muscelx.in</span>
              </div>
              <div className="flex items-center">
                <Phone size={18} className="text-primary mr-3 flex-shrink-0" />
                <span className="text-gray-700">+91 8800 123 456</span>
              </div>
              <div className="flex items-start">
                <div className="w-4 h-4 flex items-center justify-center mr-3 mt-1">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                </div>
                <div className="text-gray-700">
                  <div className="font-semibold">Open Hours:</div>
                  <div>Mon - Sat: 9:00 AM - 8:00 PM</div>
                </div>
              </div>
            </div>
            {/* Quick Links */}
            <div className="mt-8">
              <h4 className="text-gray-900 font-semibold mb-3">Quick Links</h4>
              <div className="grid grid-cols-2 gap-2 text-base">
                <Link href="/about" className="text-gray-700 hover:text-primary transition-colors">About Us</Link>
                <Link href="/blog" className="text-gray-700 hover:text-primary transition-colors">Blog</Link>
                <Link href="/careers" className="text-gray-700 hover:text-primary transition-colors">Careers</Link>
                <Link href="/faq" className="text-gray-700 hover:text-primary transition-colors">FAQs</Link>
                <Link href="/privacy" className="text-gray-700 hover:text-primary transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="text-gray-700 hover:text-primary transition-colors">Terms & Conditions</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Copyright */}
      <div className="border-t border-gray-200 py-4 bg-white">
        <div className="container mx-auto px-4">
          <p className="text-gray-500 text-center text-sm">© muscelx 2024 | All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
}

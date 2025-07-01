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
  Clock,
  ArrowRight,
  Heart,
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
    <footer className="bg-white text-gray-900 border-t border-gray-100 mt-12">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About MuselX */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <div className="flex items-center space-x-3">
                <Image
                  src="/logo.png"
                  alt="MuselX Logo"
                  width={220}
                  height={220}
                  className="rounded"
                />
              </div>
            </div>
            <p className="text-gray-600 mb-6 text-base leading-relaxed">
              India&apos;s premium fitness nutrition brand, dedicated to
              providing high-quality supplements and nutritional products to
              help you achieve your fitness goals.
            </p>

            {/* Social media links */}
            <div className="space-y-4">
              <h4 className="text-gray-900 font-semibold text-sm uppercase tracking-wide">
                Follow Us
              </h4>
              <div className="flex space-x-3">
                {[
                  {
                    icon: <Instagram size={18} />,
                    href: "#",
                    label: "Instagram",
                  },
                  {
                    icon: <Facebook size={18} />,
                    href: "#",
                    label: "Facebook",
                  },
                  { icon: <Twitter size={18} />, href: "#", label: "Twitter" },
                  { icon: <Youtube size={18} />, href: "#", label: "YouTube" },
                ].map((social, idx) => (
                  <Link
                    key={idx}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 bg-gray-100 hover:bg-red-600 flex items-center justify-center rounded-xl text-gray-600 hover:text-white transition-all duration-300 transform hover:scale-110"
                  >
                    {social.icon}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Product Categories */}
          <div>
            <h3 className="text-gray-900 font-bold text-lg mb-2">
              Product Categories
            </h3>
            <div className="w-12 h-1 bg-red-600 mb-6 rounded-full"></div>
            <ul className="space-y-3">
              {[
                { label: "Whey Protein", href: "/category/whey-protein" },
                {
                  label: "Plant-Based Protein",
                  href: "/category/plant-protein",
                },
                { label: "Casein Protein", href: "/category/casein-protein" },
                { label: "Mass Gainers", href: "/category/mass-gainers" },
                { label: "Protein Bars", href: "/category/protein-bars" },
                { label: "Pre-Workout", href: "/category/pre-workout" },
                { label: "Post-Workout", href: "/category/post-workout" },
                { label: "BCAA & EAA", href: "/category/bcaa-eaa" },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-red-600 transition-colors duration-200 text-sm flex items-center group"
                  >
                    <ArrowRight className="w-3 h-3 mr-2 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More Products */}
          <div>
            <h3 className="text-gray-900 font-bold text-lg mb-2">
              More Products
            </h3>
            <div className="w-12 h-1 bg-red-600 mb-6 rounded-full"></div>
            <ul className="space-y-3">
              {[
                { label: "Creatine & HMB", href: "/category/creatine-hmb" },
                { label: "Glutamine", href: "/category/glutamine" },
                { label: "Protein Foods", href: "/category/protein-foods" },
                { label: "Weight Loss Support", href: "/category/weight-loss" },
                { label: "Multivitamins", href: "/category/multivitamins" },
                { label: "Omega 3 Fatty Acids", href: "/category/omega-3" },
                { label: "Workout Accessories", href: "/category/accessories" },
                { label: "Gym Clothing", href: "/category/clothing" },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-red-600 transition-colors duration-200 text-sm flex items-center group"
                  >
                    <ArrowRight className="w-3 h-3 mr-2 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-gray-900 font-bold text-lg mb-2">Contact Us</h3>
            <div className="w-12 h-1 bg-red-600 mb-6 rounded-full"></div>
            <div className="space-y-4 text-sm">
              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl">
                <MapPin
                  size={16}
                  className="text-red-600 mt-0.5 flex-shrink-0"
                />
                <span className="text-gray-700">Gurgaon, Haryana, India</span>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                <Mail size={16} className="text-red-600 flex-shrink-0" />
                <a
                  href="mailto:support@Musclex.in"
                  className="text-gray-700 hover:text-red-600 transition-colors"
                >
                  support@Musclex.in
                </a>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                <Phone size={16} className="text-red-600 flex-shrink-0" />
                <a
                  href="tel:+918800123456"
                  className="text-gray-700 hover:text-red-600 transition-colors"
                >
                  +91 8800 123 456
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>© MuselX 2025 | All Rights Reserved</span>
              <span className="hidden md:inline">•</span>
              <span className="hidden md:inline">Made in India with ❤️</span>
            </div>

            {/* <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-500">Designed & Developed by</span>
              <Link
                href="https://desirediv.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 hover:text-red-700 font-semibold transition-colors duration-200 flex items-center space-x-1 group"
              >
                <span>Desire Div</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-200" />
              </Link>
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
}

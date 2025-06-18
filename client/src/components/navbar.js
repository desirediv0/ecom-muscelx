"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  User,
  Menu,
  X
} from "lucide-react";
import { motion } from "framer-motion";

export function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-[#ed1c24] backdrop-blur-md z-50 shadow-lg">
      {/* top bar */}
      <div className="bg-gradient-to-r from-[#000] via-[#ca0f16] to-[#000] text-white py-2 px-4 text-sm">
        <div className="container mx-auto flex justify-between items-center">
          <span>Free Shipping on Orders Over ₹999</span>
          <div className="flex items-center space-x-4">
            <Link href="/contact" className="hover:underline">
              Contact Us
            </Link>
            <Link href="/about" className="hover:underline">
              About Us
            </Link>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="MuscleX"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link
              href="/products"
              className="flex items-center space-x-2 text-white hover:text-red-100 transition-all duration-300 font-medium group"
            >
              <div className="p-1 rounded-full group-hover:bg-white/20 transition-all duration-300">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <span>Products</span>
            </Link>
            <Link
              href="/products"
              className="flex items-center space-x-2 text-white hover:text-red-100 transition-all duration-300 font-medium group"
            >
              <div className="p-1 rounded-full group-hover:bg-white/20 transition-all duration-300">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
              </div>
              <span>Supplements</span>
            </Link>
            <Link
              href="/blog"
              className="flex items-center space-x-2 text-white hover:text-red-100 transition-all duration-300 font-medium group"
            >
              <div className="p-1 rounded-full group-hover:bg-white/20 transition-all duration-300">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <span>Blog</span>
            </Link>
            <Link
              href="/about"
              className="flex items-center space-x-2 text-white hover:text-red-100 transition-all duration-300 font-medium group"
            >
              <div className="p-1 rounded-full group-hover:bg-white/20 transition-all duration-300">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span>About</span>
            </Link>
            <Link
              href="/contact"
              className="flex items-center space-x-2 text-white hover:text-red-100 transition-all duration-300 font-medium group"
            >
              <div className="p-1 rounded-full group-hover:bg-white/20 transition-all duration-300">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <span>Contact</span>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full bg-white/10 border border-white/20 rounded-full py-2 pl-10 pr-4 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30 transition-all duration-300"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/70"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            {/* User Account */}
            <Link href={user ? "/account" : "/login"}>
              <Button
                variant="ghost"
                className="text-white hover:bg-white/20 hover:text-white p-2 rounded-full"
              >
                <User className="w-5 h-5" />
              </Button>
            </Link>

            {/* Wishlist */}
            <Link href="/wishlist">
              <Button
                variant="ghost"
                className="text-white hover:bg-white/20 hover:text-white p-2 rounded-full relative"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span className="absolute -top-1 -right-1 bg-white text-[#ed1c24] text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  3
                </span>
              </Button>
            </Link>

            {/* Shopping Cart */}
            <Link href="/cart">
              <Button className="bg-white/20 hover:bg-white/30 text-white border border-white/20 hover:border-white/40 transition-all duration-300 rounded-full px-4 py-2 flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5" />
                <span className="font-medium">Cart</span>
                <span className="bg-white text-[#ed1c24] text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cart?.items?.length || 0}
                </span>
              </Button>
            </Link>

            {/* Login/Logout Button */}
            {user ? (
              <Button
                onClick={logout}
                className="bg-white text-[#ed1c24] hover:bg-gray-100 font-medium px-6 py-2 rounded-full transition-all duration-300 flex items-center space-x-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span>Logout</span>
              </Button>
            ) : (
              <Link href="/login">
                <Button className="bg-white text-[#ed1c24] hover:bg-gray-100 font-medium px-6 py-2 rounded-full transition-all duration-300 flex items-center space-x-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  <span>Login</span>
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2 rounded-full hover:bg-white/20 transition-all duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pb-4 border-t border-white/20"
          >
            {/* Mobile Search */}
            <div className="mt-4 mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full bg-white/10 border border-white/20 rounded-full py-3 pl-10 pr-4 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/70"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              {[
                {
                  href: "/products",
                  icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
                  label: "Products",
                },
                {
                  href: "/supplements",
                  icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
                  label: "Supplements",
                },
                {
                  href: "/equipment",
                  icon: "M13 10V3L4 14h7v7l9-11h-7z",
                  label: "Equipment",
                },
                {
                  href: "/about",
                  icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
                  label: "About",
                },
                {
                  href: "/contact",
                  icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
                  label: "Contact",
                },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-3 text-white hover:text-red-100 transition-colors font-medium py-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={item.icon}
                    />
                  </svg>
                  <span>{item.label}</span>
                </Link>
              ))}

              <div className="flex flex-col space-y-3 pt-6 border-t border-white/20">
                <div className="flex items-center justify-between">
                  <Link href={user ? "/account" : "/login"}>
                    <Button
                      variant="ghost"
                      className="text-white hover:bg-white/20 flex items-center space-x-2 flex-1 justify-start"
                    >
                      <User className="w-5 h-5" />
                      <span>Account</span>
                    </Button>
                  </Link>
                  <Link href="/wishlist">
                    <Button
                      variant="ghost"
                      className="text-white hover:bg-white/20 p-2"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                    </Button>
                  </Link>
                </div>
                <Link href="/cart">
                  <Button className="bg-white/20 hover:bg-white/30 text-white border border-white/20 flex items-center justify-center space-x-2 py-3 w-full">
                    <ShoppingCart className="w-5 h-5" />
                    <span>Cart ({cart?.items?.length || 0})</span>
                  </Button>
                </Link>
                {user ? (
                  <Button
                    onClick={logout}
                    className="bg-white text-[#ed1c24] hover:bg-gray-100 font-medium py-3 flex items-center justify-center space-x-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    <span>Logout</span>
                  </Button>
                ) : (
                  <Link href="/login">
                    <Button className="bg-white text-[#ed1c24] hover:bg-gray-100 font-medium py-3 flex items-center justify-center space-x-2 w-full">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                        />
                      </svg>
                      <span>Login</span>
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}

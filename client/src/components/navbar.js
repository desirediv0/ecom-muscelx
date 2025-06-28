"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Menu,
  X,
  LogIn,
  User,
  ChevronDown,
  Heart,
  Search,
  ShoppingCart,
} from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { useRouter, usePathname } from "next/navigation";
import { fetchApi } from "@/lib/utils";
import { ClientOnly } from "./client-only";
import { toast, Toaster } from "sonner";
import { Input } from "./ui/input";

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const searchInputRef = useRef(null);
  const navbarRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isHoveringDropdown, setIsHoveringDropdown] = useState(null);

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  // Handle hover for dropdowns
  const handleDropdownHover = (dropdown) => {
    setIsHoveringDropdown(dropdown);
    if (dropdown) {
      setActiveDropdown(dropdown);
    }
  };

  const handleDropdownLeave = () => {
    setIsHoveringDropdown(null);
    // Only close if not clicking inside the dropdown
    if (!navbarRef.current?.contains(document.activeElement)) {
      setActiveDropdown(null);
    }
  };

  // Close mobile menu when navigating to a new page
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchExpanded(false);
    setIsProfileDropdownOpen(false);
  }, [pathname]);

  // Handle click outside of navbar to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsSearchExpanded(false);
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // Focus search input when expanded
  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpanded]);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetchApi("/public/categories");
        setCategories(response.data.categories || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchExpanded(false);
      setIsMobileMenuOpen(false);
      setSearchQuery("");
    }
  };

  const handleLogout = async () => {
    await logout();
    // Show logout toast notification
    toast.success("Logged out successfully");
    // Force reload to ensure UI updates correctly
    window.location.href = "/";
  };

  return (
    <>
      <Toaster position="top-center" />
      <motion.nav
        ref={navbarRef}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed z-50 top-[10px] px-4 left-0 right-0 mx-auto w-[95%] md:w-[90%] max-w-7xl flex flex-col md:flex-row items-center justify-between transition-all duration-500 bg-black/90 backdrop-blur-sm border border-gray-800 rounded-2xl`}
      >
        <div className="flex w-full md:w-auto items-center justify-between p-3 md:border-b-0 border-b border-gray-800">
          {/* Logo with animation */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative group"
          >
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-red-500 to-red-400 opacity-20 group-hover:opacity-40 blur transition duration-500"></div>
            <Link
              href="/"
              className="relative flex items-center rounded-md p-5"
            >
              <Image
                src="/logo.png"
                alt="Logo"
                width={120}
                height={120}
                className="rounded"
              />
            </Link>
          </motion.div>

          {/* Mobile Menu Toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white bg-red-600 p-2 rounded-full border border-red-500 hover:bg-red-700 transition-colors z-50"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </motion.button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/products"
            className="font-medium text-gray-300 hover:text-white transition-colors"
          >
            All Products
          </Link>

          {/* Categories dropdown */}
          <div
            className="relative"
            onMouseEnter={() => handleDropdownHover("categories")}
            onMouseLeave={handleDropdownLeave}
          >
            <button
              className={`font-medium ${
                activeDropdown === "categories" ? "text-white" : "text-gray-300"
              } hover:text-white transition-all duration-200 flex items-center focus:outline-none group`}
              onClick={() => toggleDropdown("categories")}
              aria-expanded={activeDropdown === "categories"}
            >
              Categories
              <ChevronDown
                className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                  activeDropdown === "categories" ? "rotate-180" : ""
                } group-hover:rotate-180`}
              />
            </button>
            <div
              className={`absolute left-0 top-full mt-1 w-64 bg-white/95 backdrop-blur-lg shadow-lg rounded-md py-2 border border-gray-200 z-50 transition-all duration-300 ease-in-out transform origin-top ${
                activeDropdown === "categories"
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
              }`}
            >
              {categories.map((category) => (
                <div key={category.id}>
                  <Link
                    href={`/category/${category.slug}`}
                    className="block px-4 py-2.5 text-gray-700 hover:bg-red-50 hover:text-red-500 transition-all duration-200"
                    onClick={() => setActiveDropdown(null)}
                  >
                    {category.name}
                  </Link>
                </div>
              ))}
              <div className="pt-2 mt-2 border-t border-gray-100">
                <Link
                  href="/categories"
                  className="block px-4 py-2.5 text-red-500 font-medium hover:bg-red-50 transition-all duration-200"
                  onClick={() => setActiveDropdown(null)}
                >
                  View All Categories
                </Link>
              </div>
            </div>
          </div>

          <Link
            href="/about"
            className="font-medium text-gray-300 hover:text-white transition-colors"
          >
            About Us
          </Link>

          <Link
            href="/contact"
            className="font-medium text-gray-300 hover:text-white transition-colors"
          >
            Contact
          </Link>
        </nav>

        {/* Search, Wishlist, Auth & Cart Section */}
        <div className="hidden md:flex items-center space-x-3">
          {/* Search */}
          <div className="relative">
            {isSearchExpanded ? (
              <>
                <div
                  className="fixed inset-0 bg-black/50 z-40"
                  onClick={() => setIsSearchExpanded(false)}
                />
                <div className="fixed inset-x-0 top-0 z-50 w-full animate-in slide-in-from-top duration-300 p-2">
                  <form
                    onSubmit={handleSearch}
                    className="relative bg-black/90 rounded-lg shadow-xl border border-gray-200 overflow-hidden max-h-[90vh] md:max-w-[600px] mx-auto"
                  >
                    <div className="flex items-center px-4 py-4 border-b border-gray-100">
                      <h3 className="text-lg font-semibold text-white">
                        Search Products
                      </h3>
                      <button
                        type="button"
                        className="ml-auto p-2 rounded-full hover:bg-gray-100 transition-all duration-200 text-white"
                        onClick={() => setIsSearchExpanded(false)}
                        aria-label="Close search"
                      >
                        <X className="h-6 w-6 text-white" />
                      </button>
                    </div>

                    <div className="p-5">
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white" />
                        <Input
                          ref={searchInputRef}
                          type="search"
                          placeholder="Search for products..."
                          className="w-full pl-12 pr-12 py-3 border-gray-200 focus:border-white focus:ring-white rounded-lg text-base"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          autoComplete="off"
                        />
                        {searchQuery && (
                          <button
                            type="button"
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-white hover:text-gray-600 rounded-full hover:bg-gray-100"
                            onClick={() => setSearchQuery("")}
                            aria-label="Clear search"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="px-5 py-3 bg-black/90 border-t border-gray-100 flex justify-between">
                      <button
                        type="button"
                        onClick={() => setIsSearchExpanded(false)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all duration-200 font-medium text-sm"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 hover:text-white transition-all duration-200 flex items-center gap-2 font-medium text-sm"
                      >
                        <Search className="h-4 w-4" />
                        Search
                      </button>
                    </div>
                  </form>
                </div>
              </>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSearchExpanded(true)}
                className="p-2 text-white hover:text-white transition-all duration-200 focus:outline-none hover:scale-110"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </motion.button>
            )}
          </div>

          {/* Wishlist */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/wishlist"
              className="flex items-center space-x-1 text-gray-700 bg-gray-50/80 backdrop-blur-md px-3 py-2 rounded-full border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all duration-300"
            >
              <Heart className="h-4 w-4" />
              <span className="text-sm">Wishlist</span>
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/cart"
              className="relative flex items-center space-x-1 text-gray-700 bg-gray-50/80 backdrop-blur-md px-3 py-2 rounded-full border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all duration-300"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="text-sm">Cart</span>
              {cart?.totalQuantity > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {cart.totalQuantity}
                </span>
              )}
            </Link>
          </motion.div>

          <ClientOnly>
            {isAuthenticated ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    setIsProfileDropdownOpen(!isProfileDropdownOpen)
                  }
                  className="flex items-center space-x-1 text-gray-700 bg-gray-50/80 backdrop-blur-md px-4 py-2 rounded-full border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all duration-300"
                >
                  <User className="h-4 w-4 mr-1" />
                  <span className="text-sm">Profile</span>
                  <ChevronDown className="h-3 w-3 ml-1" />
                </motion.button>

                <AnimatePresence>
                  {isProfileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-lg rounded-xl border border-gray-200 shadow-[0_5px_15px_rgba(0,0,0,0.1)] py-1 overflow-hidden"
                    >
                      <div className="px-4 py-2 border-b border-gray-100 mb-2">
                        <p className="font-medium">
                          Hi, {user?.name || "User"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user?.email}
                        </p>
                      </div>
                      <Link
                        href="/account"
                        className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        My Account
                      </Link>
                      <Link
                        href="/account/orders"
                        className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        My Orders
                      </Link>
                      <Link
                        href="/wishlist"
                        className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        My Wishlist
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsProfileDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-white hover:bg-red-50 hover:text-red-500 transition-colors mt-2 border-t border-gray-100"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full shadow-[0_0_10px_rgba(239,68,68,0.3)] transition-all duration-300 border border-red-400 hover:shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                >
                  <LogIn className="h-4 w-4 mr-1" />
                  <span className="text-sm">Login</span>
                </motion.button>
              </Link>
            )}
          </ClientOnly>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              {/* Mobile Menu Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />

              {/* Mobile Menu Content */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-gray-800 md:hidden"
                style={{ maxHeight: "100vh" }}
              >
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-800">
                  <div className="flex items-center space-x-3">
                    <Image
                      src="/logo.png"
                      alt="MuselX Logo"
                      width={32}
                      height={32}
                      className="rounded-lg"
                    />
                    <span className="text-xl font-bold text-white">MuselX</span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-white bg-red-600 p-2 rounded-full border border-red-500 hover:bg-red-700 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Scrollable Menu Content */}
                <div
                  className="overflow-y-auto"
                  style={{ maxHeight: "calc(100vh - 80px)" }}
                >
                  <div className="p-4 space-y-4">
                    {/* Mobile Search */}
                    <form onSubmit={handleSearch} className="mb-6">
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          type="text"
                          placeholder="Search products..."
                          className="w-full pl-12 pr-12 py-3 text-base bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-red-500 focus:ring-red-500 rounded-lg"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          autoComplete="off"
                        />
                        <button
                          type="submit"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors"
                          aria-label="Search"
                        >
                          <Search className="h-4 w-4" />
                        </button>
                      </div>
                    </form>

                    {/* Navigation Links */}
                    <div className="space-y-2">
                      <Link
                        href="/products"
                        className="block py-3 px-4 text-lg font-medium text-white hover:bg-gray-800 rounded-lg transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        All Products
                      </Link>

                      {/* Categories Section */}
                      <div className="border-t border-gray-800 pt-4">
                        <h3 className="font-bold text-lg mb-3 text-gray-300 px-4">
                          Categories
                        </h3>
                        <div className="space-y-1 max-h-60 overflow-y-auto">
                          {categories.map((category) => (
                            <Link
                              key={category.id}
                              href={`/category/${category.slug}`}
                              className="block py-2 px-6 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {category.name}
                            </Link>
                          ))}
                          <Link
                            href="/categories"
                            className="block py-2 px-6 text-red-400 font-medium hover:bg-gray-800 rounded-lg transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            View All Categories
                          </Link>
                        </div>
                      </div>

                      <div className="border-t border-gray-800 pt-4 space-y-2">
                        <Link
                          href="/about"
                          className="block py-3 px-4 text-lg font-medium text-white hover:bg-gray-800 rounded-lg transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          About Us
                        </Link>

                        <Link
                          href="/contact"
                          className="block py-3 px-4 text-lg font-medium text-white hover:bg-gray-800 rounded-lg transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Contact Us
                        </Link>
                      </div>

                      {/* User Actions */}
                      <div className="border-t border-gray-800 pt-4 space-y-2">
                        <Link
                          href="/wishlist"
                          className="flex items-center space-x-3 py-3 px-4 text-white hover:bg-gray-800 rounded-lg transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Heart className="h-5 w-5" />
                          <span>Wishlist</span>
                        </Link>

                        <Link
                          href="/cart"
                          className="flex items-center space-x-3 py-3 px-4 text-white hover:bg-gray-800 rounded-lg transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <ShoppingCart className="h-5 w-5" />
                          <span>Cart</span>
                          {cart?.totalQuantity > 0 && (
                            <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                              {cart.totalQuantity}
                            </span>
                          )}
                        </Link>

                        <ClientOnly>
                          {isAuthenticated ? (
                            <div className="space-y-2">
                              <Link
                                href="/account"
                                className="block py-3 px-4 text-white hover:bg-gray-800 rounded-lg transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                My Account
                              </Link>
                              <Link
                                href="/account/orders"
                                className="block py-3 px-4 text-white hover:bg-gray-800 rounded-lg transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                My Orders
                              </Link>
                              <button
                                onClick={() => {
                                  handleLogout();
                                  setIsMobileMenuOpen(false);
                                }}
                                className="w-full text-left py-3 px-4 text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
                              >
                                Logout
                              </button>
                            </div>
                          ) : (
                            <Link
                              href="/login"
                              className="flex items-center space-x-3 py-3 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <LogIn className="h-5 w-5" />
                              <span>Login</span>
                            </Link>
                          )}
                        </ClientOnly>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};

export default Header;

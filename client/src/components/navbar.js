"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { useState, useEffect, useRef } from "react";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  Search,
  Heart,
  ChevronDown,
  Phone,
  MapPin,
  LogIn,
  ShoppingBag,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useRouter, usePathname } from "next/navigation";
import { fetchApi } from "@/lib/utils";
import { ClientOnly } from "./client-only";
import { toast, Toaster } from "sonner";
import Image from "next/image";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isHoveringDropdown, setIsHoveringDropdown] = useState(null);
  const searchInputRef = useRef(null);
  const navbarRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchExpanded(false);
    setActiveDropdown(null);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setIsSearchExpanded(false);
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchExpanded]);

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
      setIsMenuOpen(false);
      setSearchQuery("");
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    window.location.href = "/";
  };

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const handleDropdownHover = (dropdown) => {
    setIsHoveringDropdown(dropdown);
    if (dropdown) {
      setActiveDropdown(dropdown);
    }
  };

  const handleDropdownLeave = () => {
    setIsHoveringDropdown(null);
    if (!navbarRef.current?.contains(document.activeElement)) {
      setActiveDropdown(null);
    }
  };

  const MobileMenu = ({
    isMenuOpen,
    setIsMenuOpen,
    categories,
    searchQuery,
    setSearchQuery,
    isAuthenticated,
    handleLogout,
  }) => {
    const mobileSearchInputRef = useRef(null);

    useEffect(() => {
      if (isMenuOpen) {
        const timer = setTimeout(() => {
          if (mobileSearchInputRef.current) {
            mobileSearchInputRef.current.focus();
          }
        }, 300);

        return () => clearTimeout(timer);
      }
    }, [isMenuOpen]);

    const handleMobileSearch = (e) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
        setIsMenuOpen(false);
        setSearchQuery("");
      }
    };

    const handleSearchInputChange = (e) => {
      e.stopPropagation();
      setSearchQuery(e.target.value);
    };

    if (!isMenuOpen) return null;

    return (
      <div
        className="md:hidden fixed inset-0 z-50 bg-white overflow-y-auto"
        style={{ maxHeight: "100vh" }}
      >
        <div className="flex flex-col h-full">
          <div className="sticky top-0 bg-gradient-to-r from-yellow-500 to-yellow-600 border-b border-yellow-400 flex justify-between items-center px-4 py-4 z-10">
            <Link
              href="/"
              className="flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center space-x-2">
                <div className="bg-white/20 p-2 rounded-lg">
                  <ShoppingBag className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">
                  Power Fitness
                </span>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 text-white hover:bg-white/20 rounded-lg focus:outline-none transition-colors"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 bg-gradient-to-b from-yellow-50 to-white">
            <form onSubmit={handleMobileSearch} className="relative mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  ref={mobileSearchInputRef}
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-12 pr-12 py-4 text-base border-2 border-yellow-200 focus:border-yellow-500 focus:ring-yellow-500 rounded-xl bg-white"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  autoComplete="off"
                  onClick={(e) => e.stopPropagation()}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="absolute right-12 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSearchQuery("");
                      if (mobileSearchInputRef.current) {
                        mobileSearchInputRef.current.focus();
                      }
                    }}
                    aria-label="Clear search"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-yellow-500 text-white hover:bg-yellow-600 transition-colors"
                  aria-label="Search"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </form>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <Link
                href="/products"
                className="block py-3 text-lg font-semibold hover:text-yellow-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                All Products
              </Link>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <h3 className="font-bold text-lg mb-3 text-gray-800">
                Categories
              </h3>
              <div className="space-y-2 pl-2">
                {categories.map((category) => (
                  <div key={category.id} className="py-1">
                    <Link
                      href={`/category/${category.slug}`}
                      className="block hover:text-yellow-500 text-base transition-colors py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {[
                { href: "/blog", label: "Blog" },
                { href: "/about", label: "About Us" },
                { href: "/shipping", label: "Shipping Policy" },
                { href: "/contact", label: "Contact Us" },
              ].map((item) => (
                <div
                  key={item.href}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                >
                  <Link
                    href={item.href}
                    className="block py-2 text-lg font-semibold hover:text-yellow-500 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </div>
              ))}
            </div>

            {isAuthenticated ? (
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <h3 className="font-bold text-lg mb-3 text-gray-800">
                  My Account
                </h3>
                <div className="space-y-2 pl-2">
                  {[
                    { href: "/account", label: "Profile" },
                    { href: "/account/orders", label: "My Orders" },
                    { href: "/wishlist", label: "My Wishlist" },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block py-2 hover:text-yellow-500 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block py-2 text-red-600 hover:text-red-800 w-full text-left transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col space-y-3">
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full py-6 text-base border-2 border-yellow-200 text-yellow-600 hover:bg-yellow-50 rounded-xl"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full py-6 text-base bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 rounded-xl">
                    Register
                  </Button>
                </Link>
              </div>
            )}

            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <Phone className="h-5 w-5 text-yellow-500" />
                <span className="font-medium">+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-yellow-500" />
                <span className="font-medium">Store Locator</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md" ref={navbarRef}>
      <Toaster position="top-center" />

      {/* Top bar */}
      <div className="bg-primary text-white py-2 text-center text-xs md:text-sm font-semibold tracking-wide">
        Free shipping on all orders over ₹999
      </div>

      {/* Main navbar */}
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Menu toggle for mobile */}
            <div className="flex items-center md:hidden gap-2">
              <button
                className="p-2 text-primary hover:text-secondary transition-colors focus:outline-none"
                onClick={() => setIsMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>

            {/* Logo */}
            <Link href="/" className="flex items-center">
              <div className="bg-primary px-5 py-2 rounded-xl shadow-lg">
                <span className="text-2xl md:text-3xl font-extrabold tracking-tight text-white uppercase">muscelx</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8 text-base font-semibold">
              <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
              <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
              <Link href="/about" className="hover:text-primary transition-colors">About</Link>
              <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
              <Link href="/category/cate1" className="hover:text-primary transition-colors">Categories</Link>
            </nav>

            {/* Search, Cart, Account */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Search button/form */}
              <button
                className="p-2 rounded-full bg-gray-100 hover:bg-primary hover:text-white transition-colors"
                onClick={() => setIsSearchExpanded(true)}
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>
              <Link href="/cart" className="relative p-2 rounded-full bg-gray-100 hover:bg-primary hover:text-white transition-colors">
                <ShoppingCart className="h-5 w-5" />
                {cart?.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full px-1.5 py-0.5 font-bold">{cart.length}</span>
                )}
              </Link>
              <Link href="/account" className="p-2 rounded-full bg-gray-100 hover:bg-primary hover:text-white transition-colors">
                <User className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <ClientOnly>
        <MobileMenu
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          categories={categories}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          isAuthenticated={isAuthenticated}
          user={user}
          cart={cart}
          handleLogout={handleLogout}
        />
      </ClientOnly>
    </header>
  );
}

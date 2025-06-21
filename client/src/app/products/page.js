"use client";
import React, { useState, useEffect, Suspense, useCallback } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchApi, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Star,
  Filter,
  ChevronDown,
  Search,
  Eye,
  Loader2,
  AlertCircle,
  Heart,
} from "lucide-react";
import ProductQuickView from "@/components/ProductQuickView";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const ProductCardSkeleton = () => (
  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden animate-pulse">
    <div className="w-full h-56 bg-gray-200"></div>
    <div className="p-4 space-y-3">
      <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
      <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
      <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
    </div>
  </div>
);

const ProductCard = ({ product, onQuickView }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlistLoading(true);
    try {
      if (isWishlisted) {
        await fetchApi(`/users/wishlist/${product.id}`, {
          credentials: "include",
          method: "DELETE",
        });
        toast.success("Removed from wishlist!");
        setIsWishlisted(false);
      } else {
        await fetchApi("/users/wishlist", {
          credentials: "include",
          method: "POST",
          body: JSON.stringify({ productId: product.id }),
        });
        toast.success("Added to wishlist!");
        setIsWishlisted(true);
      }
    } catch (error) {
      toast.error("Please log in to manage your wishlist.");
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleQuickViewClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView(product);
  };

  return (
    <div className="bg-white border border-gray-200 hover:border-red-500 rounded-2xl overflow-hidden transition-all duration-300 group shadow-sm hover:shadow-xl hover:-translate-y-1">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative h-64 w-full bg-gray-50 overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
          {product.hasSale && (
            <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              SALE
            </div>
          )}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              aria-label="Toggle Wishlist"
              variant="outline"
              className="bg-white/80 backdrop-blur-sm rounded-full h-10 w-10 shadow-md hover:bg-white"
              onClick={handleWishlistToggle}
              disabled={wishlistLoading}
            >
              {wishlistLoading ? (
                <Loader2 className="h-10 w-10 animate-spin" />
              ) : (
                <Heart
                  className={`h-10 w-10 transition-all ${
                    isWishlisted ? "text-red-500 fill-current" : "text-gray-600"
                  }`}
                />
              )}
            </Button>
            <Button
              aria-label="Quick View"
              variant="outline"
              className="bg-white/80 backdrop-blur-sm rounded-full h-10 w-10 shadow-md hover:bg-white"
              onClick={handleQuickViewClick}
            >
              <Eye className="h-10 w-10 text-gray-600" />
            </Button>
          </div>
        </div>
        <div className="p-5 text-left">
          <div className="flex items-center mb-2">
            <div className="flex text-red-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4"
                  fill={
                    i < Math.round(product.avgRating || 0)
                      ? "currentColor"
                      : "none"
                  }
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-2">
              ({product.reviewCount || 0})
            </span>
          </div>
          <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 h-12 group-hover:text-red-600 transition-colors text-base">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="font-black text-2xl text-red-600">
              {formatCurrency(product.basePrice)}
            </span>
            {product.hasSale && (
              <span className="text-gray-400 line-through text-md">
                {formatCurrency(product.regularPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

function FilterSidebar({
  categories,
  filters,
  handleFilterChange,
  clearFilters,
}) {
  const [openSections, setOpenSections] = useState({
    category: true,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const content = (
    <div className="space-y-4">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold mb-4 text-gray-800">Search</h3>
        <Input
          placeholder="Search products..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
        />
      </div>

      <div className="p-4 border-b border-gray-200">
        <button
          onClick={() => toggleSection("category")}
          className="w-full flex justify-between items-center"
        >
          <h3 className="font-semibold text-white">Category</h3>
          <ChevronDown
            className={`h-5 w-5 transition-transform ${
              openSections.category ? "rotate-180" : ""
            }`}
          />
        </button>
        {openSections.category && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center">
              <Checkbox
                id="cat-all"
                checked={!filters.category}
                onCheckedChange={() => handleFilterChange("category", "")}
              />
              <label
                htmlFor="cat-all"
                className="ml-3 text-sm text-gray-700 cursor-pointer"
              >
                All Categories
              </label>
            </div>
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center">
                <Checkbox
                  id={`cat-${cat.id}`}
                  checked={filters.category === cat.slug}
                  onCheckedChange={(checked) =>
                    handleFilterChange("category", checked ? cat.slug : "")
                  }
                />
                <label
                  htmlFor={`cat-${cat.id}`}
                  className="ml-3 text-sm text-gray-600 cursor-pointer"
                >
                  {cat.name}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="p-4">
        <Button
          onClick={clearFilters}
          variant="outline"
          className="w-full border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
        >
          Clear All Filters
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block lg:w-1/4 xl:w-1/5">
        <div className="sticky top-24 bg-white border border-gray-200 rounded-2xl shadow-sm">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-bold">Filters</h2>
          </div>
          {content}
        </div>
      </aside>

      {/* Mobile Sheet */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-sm p-0">
            <SheetHeader className="p-4 border-b border-gray-200">
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="py-4">{content}</div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    sort: searchParams.get("sort") || "createdAt:desc",
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });

  const updateURL = useCallback(
    (newFilters) => {
      const params = new URLSearchParams();
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });
      router.push(`/products?${params.toString()}`, { scroll: false });
    },
    [router]
  );

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const [catRes] = await Promise.all([fetchApi("/public/categories")]);
        setCategories(catRes.data.categories || []);
      } catch (err) {
        console.error("Error fetching filter options:", err);
      }
    };
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          page: pagination.page,
          limit: pagination.limit,
          sort: filters.sort.split(":")[0],
          order: filters.sort.split(":")[1],
        });
        if (filters.search) params.set("search", filters.search);
        if (filters.category) params.set("category", filters.category);

        const { data } = await fetchApi(
          `/public/products?${params.toString()}`
        );
        setProducts(data.products || []);
        setPagination(data.pagination);
      } catch (err) {
        setError("Failed to load products. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filters, pagination.page, pagination.limit]);

  const handleFilterChange = (name, value) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    setPagination((p) => ({ ...p, page: 1 }));
    updateURL(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: "",
      category: "",
      sort: "createdAt:desc",
    };
    setFilters(clearedFilters);
    setPagination((p) => ({ ...p, page: 1 }));
    updateURL(clearedFilters);
  };

  const handleQuickView = (product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const handlePageChange = (newPage) => {
    setPagination((p) => ({ ...p, page: newPage }));
    window.scrollTo(0, 0);
  };

  const sortOptions = {
    "createdAt:desc": "Newest",
    "price:asc": "Price: Low to High",
    "price:desc": "Price: High to Low",
    "name:asc": "Alphabetically, A-Z",
    "name:desc": "Alphabetically, Z-A",
  };

  return (
    <div className="bg-gray-50">
      <div className="relative w-full h-64 md:h-80">
        <Image
          src="/banner-background.jpg"
          alt="Premium Supplements"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white p-4">
          <h1 className="text-4xl md:text-6xl font-black text-red-600">
            All Products
          </h1>
          <p className="text-lg md:text-xl mt-4 max-w-2xl">
            Find the perfect supplements to fuel your fitness journey.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <FilterSidebar
            categories={categories}
            filters={filters}
            handleFilterChange={handleFilterChange}
            clearFilters={clearFilters}
          />

          <main className="flex-1 w-full">
            <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row justify-between items-center mb-6 shadow-sm">
              <p className="text-sm text-gray-600 mb-3 md:mb-0">
                {loading ? (
                  <span className="h-5 w-48 bg-gray-200 rounded-md inline-block animate-pulse"></span>
                ) : (
                  <>
                    Showing{" "}
                    <b>
                      {pagination.page * pagination.limit -
                        pagination.limit +
                        1}
                      -
                      {Math.min(
                        pagination.page * pagination.limit,
                        pagination.total
                      )}
                    </b>{" "}
                    of <b>{pagination.total}</b> products
                  </>
                )}
              </p>
              <div className="flex items-center gap-2">
                <label htmlFor="sort" className="text-sm font-medium">
                  Sort by:
                </label>
                <select
                  id="sort"
                  value={filters.sort}
                  onChange={(e) => handleFilterChange("sort", e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block p-2.5"
                >
                  {Object.entries(sortOptions).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-20 bg-white border border-gray-200 rounded-xl">
                <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
                <h3 className="mt-4 text-lg font-semibold text-red-600">
                  {error}
                </h3>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-white border border-gray-200 rounded-xl">
                <Search className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-xl font-bold">No Products Found</h3>
                <p className="text-gray-500 mt-2">
                  Try adjusting your filters to find what you&apos;re looking
                  for.
                </p>
                <Button onClick={clearFilters} className="mt-6">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={handleQuickView}
                  />
                ))}
              </div>
            )}

            {pagination.pages > 1 && !loading && (
              <div className="flex justify-center mt-10">
                <nav className="flex items-center gap-2">
                  {pagination.page > 1 && (
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(pagination.page - 1)}
                    >
                      Previous
                    </Button>
                  )}
                  {Array.from(
                    { length: pagination.pages },
                    (_, i) => i + 1
                  ).map((page) => (
                    <Button
                      key={page}
                      className={
                        pagination.page === page ? "" : "hidden md:inline-flex"
                      }
                      variant={pagination.page === page ? "default" : "outline"}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  ))}
                  {pagination.page < pagination.pages && (
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(pagination.page + 1)}
                    >
                      Next
                    </Button>
                  )}
                </nav>
              </div>
            )}
          </main>
        </div>
      </div>
      <ProductQuickView
        product={quickViewProduct}
        open={isQuickViewOpen}
        onOpenChange={setIsQuickViewOpen}
      />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50"></div>}>
      <ProductsContent />
    </Suspense>
  );
}

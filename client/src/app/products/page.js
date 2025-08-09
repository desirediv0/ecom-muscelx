"use client";
import React, { useState, useEffect, Suspense, useCallback } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchApi, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Star,
  Filter,
  ChevronDown,
  Search,
  Eye,
  Loader2,
  AlertCircle,
  Heart,
  SlidersHorizontal,
  Grid3X3,
  Grid2X2,
  List,
  ChevronUp,
} from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
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

// Using shared ProductCard component instead of inline definitions

function FilterSidebar({
  categories,
  filters,
  handleFilterChange,
  clearFilters,
  availableFilters,
}) {
  const [openSections, setOpenSections] = useState({
    category: true,
    flavors: true,
    weights: true,
    availability: true,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === "sort") return false;
    if (Array.isArray(value)) return value.length > 0;
    return value !== "" && value !== false;
  }).length;

  const content = (
    <div className="space-y-4">
      {/* Simple Header */}
      <div className="bg-white border border-gray-300 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-red-600" />
            <h2 className="text-lg font-bold text-gray-800 group-hover:text-black">
              Smart Filters
            </h2>
          </div>
          {activeFiltersCount > 0 && (
            <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
              {activeFiltersCount}
            </div>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button
            onClick={clearFilters}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2"
          >
            Clear All Filters
          </Button>
        )}
      </div>

      {/* Categories */}
      <div className="bg-white border border-gray-300 rounded-lg">
        <button
          onClick={() => toggleSection("category")}
          className="w-full flex justify-between items-center p-4 hover:bg-gray-50 group bg-white"
        >
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-600" />
            <h3 className="font-bold text-black">Categories</h3>
          </div>
          {openSections.category ? (
            <ChevronUp className="h-5 w-5 text-gray-600" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-600" />
          )}
        </button>
        {openSections.category && (
          <div className="p-4 pt-0 space-y-2 max-h-64 overflow-y-auto">
            <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 group transition-colors">
              <div className="relative">
                <input
                  type="checkbox"
                  id="cat-all"
                  checked={!filters.category}
                  onChange={() => handleFilterChange("category", "")}
                  className="peer sr-only"
                />
                <div
                  className="h-5 w-5 rounded border-2 border-gray-300 bg-white peer-checked:border-red-500 peer-checked:bg-red-50 transition-all duration-200 flex items-center justify-center cursor-pointer group-hover:border-red-400"
                  onClick={() => handleFilterChange("category", "")}
                >
                  {!filters.category && (
                    <svg
                      className="h-3 w-3 text-red-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <label
                htmlFor="cat-all"
                className="ml-3 text-sm text-gray-700 cursor-pointer font-medium group-hover:text-gray-900 transition-colors"
              >
                All Categories
              </label>
            </div>
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center p-3 rounded-lg hover:bg-gray-50 group transition-colors"
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    id={`cat-${cat.id}`}
                    checked={filters.category === cat.slug}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      handleFilterChange("category", checked ? cat.slug : "");
                    }}
                    className="peer sr-only"
                  />
                  <div
                    className="h-5 w-5 rounded border-2 border-gray-300 bg-white peer-checked:border-red-500 peer-checked:bg-red-50 transition-all duration-200 flex items-center justify-center cursor-pointer group-hover:border-red-400"
                    onClick={() => {
                      const isCurrentlySelected = filters.category === cat.slug;
                      handleFilterChange(
                        "category",
                        isCurrentlySelected ? "" : cat.slug
                      );
                    }}
                  >
                    {filters.category === cat.slug && (
                      <svg
                        className="h-3 w-3 text-red-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <label
                  htmlFor={`cat-${cat.id}`}
                  className="ml-3 text-sm text-gray-700 cursor-pointer font-medium group-hover:text-gray-900 transition-colors"
                >
                  {cat.name}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Flavors */}
      {availableFilters.flavors.length > 0 && (
        <div className="bg-white border border-gray-300 rounded-lg">
          <button
            onClick={() => toggleSection("flavors")}
            className="w-full flex justify-between items-center p-4 hover:bg-gray-50 group bg-white"
          >
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-gray-600" />
              <h3 className="font-bold text-black">Flavors</h3>
            </div>
            {openSections.flavors ? (
              <ChevronUp className="h-5 w-5 text-gray-600" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-600" />
            )}
          </button>
          {openSections.flavors && (
            <div className="p-4 pt-0 space-y-2 max-h-64 overflow-y-auto">
              {availableFilters.flavors.map((flavor) => (
                <div
                  key={flavor}
                  className="flex items-center p-3 rounded-lg hover:bg-gray-50 group transition-colors"
                >
                  <div className="relative">
                    <input
                      type="checkbox"
                      id={`flavor-${flavor}`}
                      checked={filters.flavors.includes(flavor)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        const newFlavors = checked
                          ? [...filters.flavors, flavor]
                          : filters.flavors.filter((f) => f !== flavor);
                        handleFilterChange("flavors", newFlavors);
                      }}
                      className="peer sr-only"
                    />
                    <div
                      className="h-5 w-5 rounded border-2 border-gray-300 bg-white peer-checked:border-red-500 peer-checked:bg-red-50 transition-all duration-200 flex items-center justify-center cursor-pointer group-hover:border-red-400"
                      onClick={(e) => {
                        e.preventDefault();
                        const isCurrentlySelected =
                          filters.flavors.includes(flavor);
                        const newFlavors = isCurrentlySelected
                          ? filters.flavors.filter((f) => f !== flavor)
                          : [...filters.flavors, flavor];
                        handleFilterChange("flavors", newFlavors);
                      }}
                    >
                      {filters.flavors.includes(flavor) && (
                        <svg
                          className="h-3 w-3 text-red-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                  <label
                    htmlFor={`flavor-${flavor}`}
                    className="ml-3 text-sm text-gray-700 cursor-pointer font-medium group-hover:text-gray-900 transition-colors"
                  >
                    {flavor}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Weights */}
      {availableFilters.weights.length > 0 && (
        <div className="bg-white border border-gray-300 rounded-lg">
          <button
            onClick={() => toggleSection("weights")}
            className="w-full flex justify-between items-center p-4 hover:bg-gray-50 group bg-white"
          >
            <div className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 text-gray-600" />
              <h3 className="font-bold text-black">Weights</h3>
            </div>
            {openSections.weights ? (
              <ChevronUp className="h-5 w-5 text-gray-600" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-600" />
            )}
          </button>
          {openSections.weights && (
            <div className="p-4 pt-0 space-y-2 max-h-64 overflow-y-auto">
              {availableFilters.weights
                .sort((a, b) => {
                  // Convert weights to grams for proper comparison
                  const convertToGrams = (weight) => {
                    const numMatch = weight.match(/[\d.]+/);
                    const unitMatch = weight.match(/[a-zA-Z]+/);
                    if (!numMatch || !unitMatch) return 0;

                    const value = parseFloat(numMatch[0]);
                    const unit = unitMatch[0].toLowerCase();

                    if (unit === "kg") return value * 1000;
                    if (unit === "g") return value;
                    return value;
                  };

                  return convertToGrams(a) - convertToGrams(b);
                })
                .map((weight) => (
                  <div
                    key={weight}
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 group transition-colors"
                  >
                    <div className="relative">
                      <input
                        type="checkbox"
                        id={`weight-${weight}`}
                        checked={filters.weights.includes(weight)}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          const newWeights = checked
                            ? [...filters.weights, weight]
                            : filters.weights.filter((w) => w !== weight);
                          handleFilterChange("weights", newWeights);
                        }}
                        className="peer sr-only"
                      />
                      <div
                        className="h-5 w-5 rounded border-2 border-gray-300 bg-white peer-checked:border-red-500 peer-checked:bg-red-50 transition-all duration-200 flex items-center justify-center cursor-pointer group-hover:border-red-400"
                        onClick={(e) => {
                          e.preventDefault();
                          const isCurrentlySelected =
                            filters.weights.includes(weight);
                          const newWeights = isCurrentlySelected
                            ? filters.weights.filter((w) => w !== weight)
                            : [...filters.weights, weight];
                          handleFilterChange("weights", newWeights);
                        }}
                      >
                        {filters.weights.includes(weight) && (
                          <svg
                            className="h-3 w-3 text-red-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                    <label
                      htmlFor={`weight-${weight}`}
                      className="ml-3 text-sm text-gray-700 cursor-pointer font-medium group-hover:text-gray-900 transition-colors"
                    >
                      {weight}
                    </label>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <div className="sticky top-4">{content}</div>
      </div>

      {/* Mobile Sheet */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="lg"
              className="flex items-center gap-2 relative mb-6 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg"
            >
              <SlidersHorizontal className="h-5 w-5" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="bg-white text-red-600 px-2 py-1 rounded-full text-sm font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-sm p-0 bg-gray-50">
            <SheetHeader className="p-4 bg-red-600 text-white">
              <SheetTitle className="flex items-center gap-2 text-lg font-bold">
                <SlidersHorizontal className="h-5 w-5" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="bg-white text-red-600 px-2 py-1 rounded-full text-sm font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </SheetTitle>
            </SheetHeader>
            <div className="p-4 max-h-[calc(100vh-8rem)] overflow-y-auto">
              {content}
            </div>
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
  const [availableFilters, setAvailableFilters] = useState({
    flavors: [],
    weights: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("grid");

  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    flavors: searchParams.get("flavors")?.split(",").filter(Boolean) || [],
    weights: searchParams.get("weights")?.split(",").filter(Boolean) || [],
    inStock: searchParams.get("inStock") === "true",
    onSale: searchParams.get("onSale") === "true",
    sort: searchParams.get("sort") || "createdAt:desc",
  });

  const [pagination, setPagination] = useState({
    page: parseInt(searchParams.get("page")) || 1,
    limit: 12,
    total: 0,
    pages: 0,
  });

  const updateURL = useCallback(
    (newFilters, newPage = null) => {
      const params = new URLSearchParams();

      Object.entries(newFilters).forEach(([key, value]) => {
        if (Array.isArray(value) && value.length > 0) {
          params.set(key, value.join(","));
        } else if (typeof value === "boolean" && value) {
          params.set(key, "true");
        } else if (value && typeof value === "string") {
          params.set(key, value);
        }
      });

      if (newPage && newPage > 1) {
        params.set("page", newPage.toString());
      }

      const url = params.toString()
        ? `/products?${params.toString()}`
        : "/products";
      router.push(url, { scroll: false });
    },
    [router]
  );

  // Extract available filters from products
  useEffect(() => {
    if (products.length > 0) {
      const flavors = new Set();
      const weights = new Set();

      products.forEach((product) => {
        product.variants?.forEach((variant) => {
          if (variant.flavor?.name && variant.isActive) {
            flavors.add(variant.flavor.name);
          }
          if (variant.weight && variant.isActive) {
            weights.add(`${variant.weight.value}${variant.weight.unit}`);
          }
        });
      });

      setAvailableFilters({
        flavors: Array.from(flavors).sort(),
        weights: Array.from(weights),
      });
    }
  }, [products]);

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

        if (filters.category) params.set("category", filters.category);
        if (filters.flavors.length > 0)
          params.set("flavor", filters.flavors.join(","));
        if (filters.weights.length > 0)
          params.set("weight", filters.weights.join(","));
        if (filters.inStock) params.set("inStock", "true");
        if (filters.onSale) params.set("onSale", "true");

        console.log("Filters being sent:", {
          category: filters.category,
          flavors: filters.flavors,
          weights: filters.weights,
          apiUrl: `/public/products?${params.toString()}`,
        });

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
    updateURL(newFilters, 1);
  };

  const clearFilters = () => {
    const clearedFilters = {
      category: "",
      flavors: [],
      weights: [],
      inStock: false,
      onSale: false,
      sort: "createdAt:desc",
    };
    setFilters(clearedFilters);
    setPagination((p) => ({ ...p, page: 1 }));
    updateURL(clearedFilters, 1);
  };

  // Quick view handled within shared ProductCard

  const handlePageChange = (newPage) => {
    setPagination((p) => ({ ...p, page: newPage }));
    updateURL(filters, newPage);
    window.scrollTo(0, 0);
  };

  const sortOptions = {
    "createdAt:desc": "Newest First",
    "createdAt:asc": "Oldest First",
    "name:asc": "Name: A to Z",
    "name:desc": "Name: Z to A",
  };

  const gridModes = [
    {
      value: "grid",
      icon: Grid3X3,
      label: "Grid View",
      cols: "grid-cols-2 xl:grid-cols-4",
    },
    {
      value: "large-grid",
      icon: Grid2X2,
      label: "Large Grid",
      cols: "grid-cols-1 sm:grid-cols-2",
    },
    { value: "list", icon: List, label: "List View", cols: "grid-cols-1" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
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
          <h1 className="text-4xl md:text-6xl font-black text-red-600 mb-4">
            Premium Products
          </h1>
          <p className="text-lg md:text-xl max-w-2xl">
            Discover our complete range of high-quality supplements designed for
            your fitness goals.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Modern Filter Sidebar */}
          <div className="lg:w-80 lg:flex-shrink-0">
            <FilterSidebar
              categories={categories}
              filters={filters}
              handleFilterChange={handleFilterChange}
              clearFilters={clearFilters}
              availableFilters={availableFilters}
            />
          </div>

          <main className="flex-1 w-full min-w-0">
            {/* Results Header */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row justify-between items-center mb-6 shadow-sm">
              <div className="flex items-center gap-4 mb-3 md:mb-0">
                <p className="text-sm text-gray-500">
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
              </div>

              <div className="flex items-center gap-4">
                {/* View Mode Toggle */}
                <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-1">
                  {gridModes.map((mode) => (
                    <button
                      key={mode.value}
                      onClick={() => setViewMode(mode.value)}
                      className={`p-2 rounded-md transition-all ${
                        viewMode === mode.value
                          ? "bg-white shadow-sm text-red-600 hover:bg-red-50"
                          : "text-white hover:text-gray-300"
                      }`}
                      title={mode.label}
                    >
                      <mode.icon className="h-4 w-4" />
                    </button>
                  ))}
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <label
                    htmlFor="sort"
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    Sort by:
                  </label>
                  <select
                    id="sort"
                    value={filters.sort}
                    onChange={(e) => handleFilterChange("sort", e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block p-2.5 min-w-[160px]"
                  >
                    {Object.entries(sortOptions).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div
                className={`grid gap-6 ${
                  gridModes.find((m) => m.value === viewMode)?.cols ||
                  "grid-cols-2 xl:grid-cols-4"
                }`}
              >
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
                <Button
                  onClick={() => window.location.reload()}
                  className="mt-4"
                >
                  Try Again
                </Button>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-white border border-gray-200 rounded-xl">
                <Search className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-xl font-bold">No Products Found</h3>
                <p className="text-gray-500 mt-2">
                  We couldn&apos;t find any products matching your filters.
                </p>
                <Button onClick={clearFilters} className="mt-6">
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div
                className={`grid gap-6 ${
                  gridModes.find((m) => m.value === viewMode)?.cols ||
                  "grid-cols-2 lg:grid-cols-4"
                }`}
              >
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && !loading && (
              <div className="flex justify-center mt-10">
                <nav className="flex items-center gap-2">
                  {pagination.page > 1 && (
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      className="hover:bg-red-50 hover:border-red-300"
                    >
                      Previous
                    </Button>
                  )}
                  {Array.from(
                    { length: Math.min(5, pagination.pages) },
                    (_, i) => {
                      let page;
                      if (pagination.pages <= 5) {
                        page = i + 1;
                      } else if (pagination.page <= 3) {
                        page = i + 1;
                      } else if (pagination.page >= pagination.pages - 2) {
                        page = pagination.pages - 4 + i;
                      } else {
                        page = pagination.page - 2 + i;
                      }

                      return (
                        <Button
                          key={page}
                          variant={
                            pagination.page === page ? "default" : "outline"
                          }
                          onClick={() => handlePageChange(page)}
                          className={
                            pagination.page === page
                              ? "bg-red-600 hover:bg-red-700"
                              : "hover:bg-red-50 hover:border-red-300"
                          }
                        >
                          {page}
                        </Button>
                      );
                    }
                  )}
                  {pagination.page < pagination.pages && (
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      className="hover:bg-red-50 hover:border-red-300"
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

      {/* Quick view handled inside ProductCard */}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-red-600" />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}

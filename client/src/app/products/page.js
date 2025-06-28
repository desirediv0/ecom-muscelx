"use client";
import React, { useState, useEffect, Suspense, useCallback } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchApi, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Star,
  Filter,
  ChevronDown,
  Search,
  Eye,
  Loader2,
  AlertCircle,
  Heart,
  X,
  SlidersHorizontal,
  Grid3X3,
  Grid2X2,
  List,
  ChevronUp,
} from "lucide-react";
import ProductQuickView from "@/components/ProductQuickView";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
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

const ProductCard = ({ product, onQuickView, viewMode = "grid" }) => {
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

  const getProductImage = () => {
    if (product.image && product.image !== "/product-placeholder.jpg") {
      return product.image;
    }
    if (product.variants && product.variants.length > 0) {
      const variantWithPrimaryImage = product.variants.find(
        (v) => v.images && v.images.some((img) => img.isPrimary)
      );
      if (variantWithPrimaryImage) {
        const primaryImage = variantWithPrimaryImage.images.find(
          (img) => img.isPrimary
        );
        if (primaryImage) return primaryImage.url;
      }
      const variantWithImage = product.variants.find(
        (v) => v.images && v.images.length > 0
      );
      if (variantWithImage) return variantWithImage.images[0].url;
    }
    return "/product-placeholder.jpg";
  };

  // Get available flavors
  const getAvailableFlavors = () => {
    const flavors = product.variants
      ?.filter((v) => v.flavor && v.isActive)
      .map((v) => v.flavor.name)
      .filter((value, index, self) => self.indexOf(value) === index);
    return flavors || [];
  };

  // Get available weights
  const getAvailableWeights = () => {
    const weights = product.variants
      ?.filter((v) => v.weight && v.isActive)
      .map((v) => `${v.weight.value}${v.weight.unit}`)
      .filter((value, index, self) => self.indexOf(value) === index);
    return weights || [];
  };

  // Check if product is in stock
  const isInStock =
    product.variants?.some((v) => v.quantity > 0 && v.isActive) || false;

  if (viewMode === "list") {
    return (
      <div className="bg-white border border-gray-200 hover:border-red-500 rounded-2xl overflow-hidden transition-all duration-300 group shadow-sm hover:shadow-xl">
        <Link href={`/products/${product.slug}`} className="block">
          <div className="flex p-6 gap-6">
            <div className="relative h-32 w-32 bg-gray-50 overflow-hidden rounded-xl flex-shrink-0">
              <Image
                src={getProductImage()}
                alt={product.name}
                fill
                className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                sizes="128px"
                onError={(e) => {
                  e.target.src = "/product-placeholder.jpg";
                }}
              />
              {product.hasSale && (
                <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                  SALE
                </div>
              )}
              {!isInStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    OUT OF STOCK
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div className="flex-1">
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
                      ({product.reviewCount || 0} reviews)
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-red-600 transition-colors">
                    {product.name}
                  </h3>

                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                    {product.description ||
                      "Premium quality supplement for your fitness journey."}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {getAvailableFlavors()
                      .slice(0, 3)
                      .map((flavor, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="text-xs"
                        >
                          {flavor}
                        </Badge>
                      ))}
                    {getAvailableWeights()
                      .slice(0, 3)
                      .map((weight, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {weight}
                        </Badge>
                      ))}
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="font-black text-2xl text-red-600">
                      {formatCurrency(product.basePrice)}
                    </span>
                    {product.hasSale && (
                      <span className="text-gray-400 line-through text-lg">
                        {formatCurrency(product.regularPrice)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleWishlistToggle}
                    disabled={wishlistLoading}
                    className="bg-white/80 backdrop-blur-sm hover:bg-white"
                  >
                    {wishlistLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Heart
                        className={`h-4 w-4 ${
                          isWishlisted
                            ? "text-red-500 fill-current"
                            : "text-gray-800"
                        }`}
                      />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleQuickViewClick}
                    className="bg-white/80 backdrop-blur-sm hover:bg-white"
                  >
                    <Eye className="h-4 w-4 text-gray-800" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 hover:border-red-500 rounded-2xl overflow-hidden transition-all duration-300 group shadow-sm hover:shadow-xl hover:-translate-y-1">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative h-64 w-full bg-gray-50 overflow-hidden">
          <Image
            src={getProductImage()}
            alt={product.name}
            fill
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            onError={(e) => {
              e.target.src = "/product-placeholder.jpg";
            }}
          />
          {product.hasSale && (
            <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              SALE
            </div>
          )}
          {!isInStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold">OUT OF STOCK</span>
            </div>
          )}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              variant="outline"
              size="sm"
              onClick={handleWishlistToggle}
              disabled={wishlistLoading}
              className="bg-white/80 backdrop-blur-sm rounded-full h-10 w-10 shadow-md hover:bg-white"
            >
              {wishlistLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Heart
                  className={`h-4 w-4 transition-all ${
                    isWishlisted ? "text-red-500 fill-current" : "text-gray-800"
                  }`}
                />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleQuickViewClick}
              className="bg-white/80 backdrop-blur-sm rounded-full h-10 w-10 shadow-md hover:bg-white"
            >
              <Eye className="h-4 w-4 text-gray-800" />
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

          <div className="flex flex-wrap gap-1 mb-3">
            {getAvailableFlavors()
              .slice(0, 2)
              .map((flavor, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {flavor}
                </Badge>
              ))}
            {getAvailableWeights()
              .slice(0, 2)
              .map((weight, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {weight}
                </Badge>
              ))}
          </div>

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
  availableFilters,
}) {
  const [openSections, setOpenSections] = useState({
    category: true,
    price: true,
    flavors: true,
    weights: true,
    availability: true,
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === "sort") return false;
    if (key === "priceRange") return value[0] !== 0 || value[1] !== 10000;
    if (Array.isArray(value)) return value.length > 0;
    return value !== "";
  }).length;

  const content = (
    <div className="space-y-6">
      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold mb-4 text-gray-800 flex items-center gap-2">
          <Search className="h-4 w-4" />
          Search Products
        </h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="pl-10 focus:ring-red-500 focus:border-red-500"
          />
          {filters.search && (
            <button
              onClick={() => handleFilterChange("search", "")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={() => toggleSection("category")}
          className="w-full flex justify-between items-center mb-4"
        >
          <h3 className="font-semibold text-white">Categories</h3>
          {openSections.category ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </button>
        {openSections.category && (
          <div className="space-y-3 max-h-48 overflow-y-auto">
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
                  className="ml-3 text-sm text-gray-800 cursor-pointer"
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
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={() => toggleSection("flavors")}
            className="w-full flex justify-between items-center mb-4"
          >
            <h3 className="font-semibold text-white">Flavors</h3>
            {openSections.flavors ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </button>
          {openSections.flavors && (
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {availableFilters.flavors.map((flavor) => (
                <div key={flavor} className="flex items-center">
                  <Checkbox
                    id={`flavor-${flavor}`}
                    checked={filters.flavors.includes(flavor)}
                    onCheckedChange={(checked) => {
                      const newFlavors = checked
                        ? [...filters.flavors, flavor]
                        : filters.flavors.filter((f) => f !== flavor);
                      handleFilterChange("flavors", newFlavors);
                    }}
                  />
                  <label
                    htmlFor={`flavor-${flavor}`}
                    className="ml-3 text-sm text-gray-800 cursor-pointer"
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
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={() => toggleSection("weights")}
            className="w-full flex justify-between items-center mb-4"
          >
            <h3 className="font-semibold text-white">Weights</h3>
            {openSections.weights ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </button>
          {openSections.weights && (
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {availableFilters.weights
                .sort((a, b) => {
                  const aNum = parseFloat(a);
                  const bNum = parseFloat(b);
                  return aNum - bNum;
                })
                .map((weight) => (
                  <div key={weight} className="flex items-center">
                    <Checkbox
                      id={`weight-${weight}`}
                      checked={filters.weights.includes(weight)}
                      onCheckedChange={(checked) => {
                        const newWeights = checked
                          ? [...filters.weights, weight]
                          : filters.weights.filter((w) => w !== weight);
                        handleFilterChange("weights", newWeights);
                      }}
                    />
                    <label
                      htmlFor={`weight-${weight}`}
                      className="ml-3 text-sm text-gray-800 cursor-pointer"
                    >
                      {weight}
                    </label>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Availability */}
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={() => toggleSection("availability")}
          className="w-full flex justify-between items-center mb-4"
        >
          <h3 className="font-semibold text-white">Availability</h3>
          {openSections.availability ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </button>
        {openSections.availability && (
          <div className="space-y-3">
            <div className="flex items-center">
              <Checkbox
                id="in-stock"
                checked={filters.inStock}
                onCheckedChange={(checked) =>
                  handleFilterChange("inStock", checked)
                }
              />
              <label
                htmlFor="in-stock"
                className="ml-3 text-sm text-gray-800 cursor-pointer"
              >
                In Stock Only
              </label>
            </div>
            <div className="flex items-center">
              <Checkbox
                id="on-sale"
                checked={filters.onSale}
                onCheckedChange={(checked) =>
                  handleFilterChange("onSale", checked)
                }
              />
              <label
                htmlFor="on-sale"
                className="ml-3 text-sm text-gray-800 cursor-pointer"
              >
                On Sale
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Clear Filters */}
      <div className="p-4">
        <Button
          onClick={clearFilters}
          variant="outline"
          className="w-full border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
          disabled={activeFiltersCount === 0}
        >
          Clear All Filters{" "}
          {activeFiltersCount > 0 && `(${activeFiltersCount})`}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block lg:w-1/4 xl:w-1/5">
        <div className="sticky top-24 bg-white border border-gray-200 rounded-2xl shadow-sm max-h-[calc(100vh-6rem)] overflow-y-auto">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-red-50 to-red-100 rounded-t-2xl">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </h2>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="bg-red-100 text-red-700">
                {activeFiltersCount}
              </Badge>
            )}
          </div>
          {content}
        </div>
      </aside>

      {/* Mobile Sheet */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 relative"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-1 bg-red-100 text-red-700 text-xs"
                >
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-sm p-0">
            <SheetHeader className="p-4 border-b border-gray-200">
              <SheetTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="bg-red-100 text-red-700"
                  >
                    {activeFiltersCount}
                  </Badge>
                )}
              </SheetTitle>
            </SheetHeader>
            <div className="py-4 max-h-[calc(100vh-8rem)] overflow-y-auto">
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
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    priceRange: [
      parseInt(searchParams.get("minPrice")) || 0,
      parseInt(searchParams.get("maxPrice")) || 10000,
    ],
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
        if (key === "priceRange") {
          if (value[0] > 0) params.set("minPrice", value[0].toString());
          if (value[1] < 10000) params.set("maxPrice", value[1].toString());
        } else if (Array.isArray(value) && value.length > 0) {
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

        if (filters.search) params.set("search", filters.search);
        if (filters.category) params.set("category", filters.category);
        if (filters.priceRange[0] > 0)
          params.set("minPrice", filters.priceRange[0]);
        if (filters.priceRange[1] < 10000)
          params.set("maxPrice", filters.priceRange[1]);
        if (filters.flavors.length > 0)
          params.set("flavors", filters.flavors.join(","));
        if (filters.weights.length > 0)
          params.set("weights", filters.weights.join(","));
        if (filters.inStock) params.set("inStock", "true");
        if (filters.onSale) params.set("onSale", "true");

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
      search: "",
      category: "",
      priceRange: [0, 10000],
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

  const handleQuickView = (product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

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
      cols: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3",
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
          <FilterSidebar
            categories={categories}
            filters={filters}
            handleFilterChange={handleFilterChange}
            clearFilters={clearFilters}
            availableFilters={availableFilters}
          />

          <main className="flex-1 w-full">
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
                  "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
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
                  We couldn't find any products matching your filters.
                </p>
                <Button onClick={clearFilters} className="mt-6">
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div
                className={`grid gap-6 ${
                  gridModes.find((m) => m.value === viewMode)?.cols ||
                  "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                }`}
              >
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={handleQuickView}
                    viewMode={viewMode}
                  />
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

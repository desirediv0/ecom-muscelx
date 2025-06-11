"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { fetchApi, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Star,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Eye,
  Heart,
  Filter,
  Grid3X3,
  List,
  ShoppingBag,
} from "lucide-react";
import ProductQuickView from "@/components/ProductQuickView";

// Helper function to format image URLs correctly
const getImageUrl = (image) => {
  if (!image) return "/placeholder.svg?height=300&width=400";
  if (image.startsWith("http")) return image;
  return `https://desirediv-storage.blr1.digitaloceanspaces.com/${image}`;
};

export default function CategoryPage() {
  const params = useParams();
  const { slug } = params;

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("newest");
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });

  // Fetch category and products
  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      setLoading(true);
      try {
        // Parse sort option into API parameters
        let sort = "createdAt";
        let order = "desc";

        switch (sortOption) {
          case "newest":
            sort = "createdAt";
            order = "desc";
            break;
          case "oldest":
            sort = "createdAt";
            order = "asc";
            break;
          case "price-low":
            sort = "price";
            order = "asc";
            break;
          case "price-high":
            sort = "price";
            order = "desc";
            break;
          case "name-asc":
            sort = "name";
            order = "asc";
            break;
          case "name-desc":
            sort = "name";
            order = "desc";
            break;
          default:
            break;
        }

        const response = await fetchApi(
          `/public/categories/${slug}/products?page=${pagination.page}&limit=${pagination.limit}&sort=${sort}&order=${order}`
        );

        setCategory(response.data.category);
        setProducts(response.data.products || []);
        setPagination(response.data.pagination || pagination);
      } catch (err) {
        console.error("Error fetching category:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCategoryAndProducts();
    }
  }, [slug, pagination.page, sortOption]); // Removed pagination.limit from dependency array

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.pages) return;
    setPagination((prev) => ({ ...prev, page: newPage }));
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle sorting
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  // Handle quick view
  const handleQuickView = (product) => {
    setQuickViewProduct(product);
    setQuickViewOpen(true);
  };

  // Loading state
  if (loading && !category) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !category) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 p-6 rounded-2xl border border-red-200 flex items-start max-w-2xl mx-auto shadow-lg">
            <AlertCircle className="text-red-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h2 className="text-lg font-semibold text-red-700 mb-1">
                Error Loading Category
              </h2>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Category header */}
        {category && (
          <div className="mb-10">
            <div className="flex items-center mb-4 text-sm text-gray-600">
              <Link
                href="/"
                className="hover:text-red-600 transition-colors"
              >
                Home
              </Link>
              <span className="mx-2">•</span>
              <Link
                href="/products"
                className="hover:text-red-600 transition-colors"
              >
                Products
              </Link>
              <span className="mx-2">•</span>
              <span className="text-red-600 font-medium">
                {category.name}
              </span>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold mb-4 text-gray-800">
                    {category.name}
                  </h1>
                  {category.description && (
                    <p className="text-gray-600 text-lg max-w-2xl leading-relaxed">
                      {category.description}
                    </p>
                  )}
                </div>

                {category.image && (
                  <div className="w-32 h-32 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0 shadow-md">
                    <Image
                      src={getImageUrl(category.image) || "/placeholder.svg"}
                      alt={category.name}
                      width={128}
                      height={128}
                      className="w-full h-full object-contain p-4"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Products header with filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-gray-600">
                <Filter className="h-5 w-5 mr-2 text-red-600" />
                <span className="font-medium">
                  Showing {products.length} of {pagination.total} products
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-2 space-x-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "grid"
                      ? "bg-white text-red-600 shadow-sm"
                      : "text-gray-100 hover:text-gray-200"
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "list"
                      ? "bg-white text-red-600 shadow-sm"
                      : "text-gray-100 hover:text-gray-200"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                <span className="px-4 py-2 text-sm font-medium text-gray-800">
                  SORT BY
                </span>
                <select
                  className="border-l border-gray-200 px-4 py-2 focus:outline-none bg-white text-gray-800"
                  onChange={handleSortChange}
                  value={sortOption}
                >
                  <option value="newest">Featured</option>
                  <option value="price-low">Price, low to high</option>
                  <option value="price-high">Price, high to low</option>
                  <option value="name-asc">Alphabetically, A-Z</option>
                  <option value="name-desc">Alphabetically, Z-A</option>
                  <option value="oldest">Date, old to new</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid/List */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-pulse"
              >
                <div className="h-64 bg-gray-200" />
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
                  <div className="h-10 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
            <div className="text-gray-400 mb-6">
              <ShoppingBag className="h-16 w-16 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              No Products Found
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              We couldn&apos;t find any products in this category. Please check back later.
            </p>
            <Link href="/products">
              <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                Browse All Products
              </Button>
            </Link>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group"
              >
                <div className="relative h-64 w-full bg-gray-50 overflow-hidden">
                  <Link href={`/products/${product.slug}`}>
                    <Image
                      src={getImageUrl(product.image) || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-contain p-4 transition-transform group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </Link>

                  {product.hasSale && (
                    <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      SALE
                    </span>
                  )}

                  <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-10 h-10 p-0 bg-white/90 hover:bg-red-600 hover:text-white rounded-full shadow-md"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-10 h-10 p-0 bg-white/90 hover:bg-red-600 hover:text-white rounded-full shadow-md"
                      onClick={(e) => {
                        e.preventDefault();
                        handleQuickView(product);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-center mb-3">
                    <div className="flex text-yellow-400">
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

                  <Link
                    href={`/products/${product.slug}`}
                    className="block hover:text-red-600 transition-colors"
                  >
                    <h3 className="font-semibold text-gray-800 mb-3 line-clamp-2 text-center">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="text-center mb-4">
                    {product.hasSale ? (
                      <div className="flex items-center justify-center space-x-2">
                        <span className="font-bold text-xl text-red-600">
                          {formatCurrency(product.basePrice)}
                        </span>
                        <span className="text-gray-500 line-through">
                          {formatCurrency(product.regularPrice)}
                        </span>
                      </div>
                    ) : (
                      <span className="font-bold text-xl text-gray-800">
                        {formatCurrency(product.basePrice)}
                      </span>
                    )}
                  </div>

                  {product.flavors > 1 && (
                    <p className="text-xs text-gray-500 text-center mb-4">
                      {product.flavors} variants
                    </p>
                  )}

                  <Button
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                    onClick={(e) => {
                      e.preventDefault();
                      handleQuickView(product);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Quick View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="relative w-full md:w-64 h-64 md:h-auto bg-gray-50 overflow-hidden">
                    <Link href={`/products/${product.slug}`}>
                      <Image
                        src={getImageUrl(product.image) || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-contain p-4 transition-transform group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 256px"
                      />
                    </Link>

                    {product.hasSale && (
                      <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        SALE
                      </span>
                    )}
                  </div>

                  <div className="flex-1 p-6">
                    <div className="flex flex-col h-full">
                      <div className="flex-1">
                        <div className="flex items-center mb-3">
                          <div className="flex text-yellow-400">
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

                        <Link
                          href={`/products/${product.slug}`}
                          className="block hover:text-red-600 transition-colors"
                        >
                          <h3 className="text-xl font-semibold text-gray-800 mb-3">
                            {product.name}
                          </h3>
                        </Link>

                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {product.description}
                        </p>

                        {product.flavors > 1 && (
                          <p className="text-sm text-gray-500 mb-4">
                            {product.flavors} variants available
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          {product.hasSale ? (
                            <div className="flex items-center space-x-2">
                              <span className="font-bold text-2xl text-red-600">
                                {formatCurrency(product.basePrice)}
                              </span>
                              <span className="text-gray-500 line-through">
                                {formatCurrency(product.regularPrice)}
                              </span>
                            </div>
                          ) : (
                            <span className="font-bold text-2xl text-gray-800">
                              {formatCurrency(product.basePrice)}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-3">
                          <Button
                            variant="outline"
                            className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                            onClick={(e) => {
                              e.preventDefault();
                              handleQuickView(product);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Quick View
                          </Button>
                          <Button
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={(e) => {
                              e.preventDefault();
                              handleQuickView(product);
                            }}
                          >
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center items-center mt-12">
            <div className="flex items-center bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1 || loading}
                className="rounded-none border-0 hover:bg-red-600 hover:text-white px-4 py-3"
              >
                <ChevronUp className="h-4 w-4 rotate-90" />
              </Button>

              {[...Array(pagination.pages)].map((_, i) => {
                const page = i + 1;
                if (
                  page === 1 ||
                  page === pagination.pages ||
                  (page >= pagination.page - 1 && page <= pagination.page + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      disabled={loading}
                      className={`px-4 py-3 font-medium transition-colors ${
                        pagination.page === page
                          ? "bg-red-600 text-white"
                          : "hover:bg-gray-50 text-gray-800"
                      }`}
                    >
                      {page}
                    </button>
                  );
                }

                if (
                  (page === 2 && pagination.page > 3) ||
                  (page === pagination.pages - 1 &&
                    pagination.page < pagination.pages - 2)
                ) {
                  return (
                    <span key={page} className="px-4 py-3 text-gray-400">
                      ...
                    </span>
                  );
                }

                return null;
              })}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages || loading}
                className="rounded-none border-0 hover:bg-red-600 hover:text-white px-4 py-3"
              >
                <ChevronDown className="h-4 w-4 rotate-90" />
              </Button>
            </div>
          </div>
        )}

        {/* Quick View Dialog */}
        <ProductQuickView
          product={quickViewProduct}
          open={quickViewOpen}
          onOpenChange={setQuickViewOpen}
        />
      </div>
    </div>
  );
}

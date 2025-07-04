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
  if (!image) return "/product-placeholder.jpg";

  // If it's already an absolute URL, return as is
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  // If it's a relative path that doesn't start with "/", add it
  if (!image.startsWith("/")) {
    return `/${image}`;
  }

  return image;
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
      <div className="min-h-screen bg-white pt-32">
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
      <div className="min-h-screen bg-white pt-32">
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
    <div className="min-h-screen bg-white pt-32">
      <div className="container mx-auto px-4 py-8">
        {/* Category header */}
        {category && (
          <div className="mb-10">
            <div className="flex items-center mb-4 text-sm text-gray-600">
              <Link href="/" className="hover:text-red-600 transition-colors">
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
              <span className="text-red-600 font-medium">{category.name}</span>
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
                      src={
                        getImageUrl(category.image) ||
                        "/product-placeholder.jpg"
                      }
                      alt={category.name}
                      width={128}
                      height={128}
                      className="w-full h-full object-contain p-4"
                      onError={(e) => {
                        e.target.src = "/product-placeholder.jpg";
                      }}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-gray-200" />
                <div className="p-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-3" />
                  <div className="h-8 bg-gray-200 rounded" />
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
              We couldn&apos;t find any products in this category. Please check
              back later.
            </p>
            <Link href="/products">
              <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                Browse All Products
              </Button>
            </Link>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-gray-200 rounded-lg hover:border-red-400/70 transition-all duration-300 group shadow-sm hover:shadow-lg overflow-hidden flex flex-col h-full relative"
              >
                <div className="absolute top-2 right-2 z-10 flex flex-col gap-1 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                  <Button
                    variant="outline"
                    className="bg-white/90 backdrop-blur-sm rounded-full text-black h-8 w-8 p-0 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200"
                  >
                    <Heart className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-white/90 backdrop-blur-sm rounded-full text-black h-8 w-8 p-0 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200"
                    onClick={(e) => {
                      e.preventDefault();
                      handleQuickView(product);
                    }}
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                </div>

                <div className="relative p-3 flex-grow">
                  <div className="relative mb-3 overflow-hidden rounded-lg bg-gray-50 aspect-square">
                    <Image
                      src={
                        getImageUrl(product.image) || "/product-placeholder.jpg"
                      }
                      alt={product.name}
                      fill
                      className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300 ease-in-out"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
                      onError={(e) => {
                        e.target.src = "/product-placeholder.jpg";
                      }}
                    />
                    {product.hasSale && (
                      <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                        SALE
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-800 group-hover:text-red-600 transition-colors line-clamp-2 h-10">
                      {product.name}
                    </h3>

                    <div className="flex items-center justify-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={
                            i < Math.round(product.avgRating || 0)
                              ? "fill-red-400 text-red-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                      <span className="ml-1 text-xs text-gray-500">
                        ({product.reviewCount || 0})
                      </span>
                    </div>

                    <div className="flex flex-col items-center space-y-1">
                      <span className="text-lg font-bold text-red-600">
                        {product.basePrice
                          ? formatCurrency(product.basePrice)
                          : ""}
                      </span>
                      {product.hasSale && product.regularPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          {formatCurrency(product.regularPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="p-3 pt-0 mt-auto">
                  <Button
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 text-sm transition-all duration-300"
                    onClick={(e) => {
                      e.preventDefault();
                      handleQuickView(product);
                    }}
                  >
                    <Eye className="h-3 w-3 mr-1" />
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
                className="bg-white border border-gray-200/80 rounded-2xl hover:border-red-400/70 transition-all duration-300 group shadow-md hover:shadow-xl hover:shadow-red-500/10 overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="relative w-full md:w-64 h-64 md:h-auto bg-gray-50 overflow-hidden">
                    <Link href={`/products/${product.slug}`}>
                      <Image
                        src={
                          getImageUrl(product.image) ||
                          "/product-placeholder.jpg"
                        }
                        alt={product.name}
                        fill
                        className="object-cover p-4 transition-transform group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 256px"
                        onError={(e) => {
                          e.target.src = "/product-placeholder.jpg";
                        }}
                      />
                    </Link>

                    {product.hasSale && (
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                        SALE
                      </div>
                    )}
                  </div>

                  <div className="flex-1 p-6">
                    <div className="flex flex-col h-full">
                      <div className="flex-1">
                        <div className="flex items-center mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={
                                i < Math.round(product.avgRating || 0)
                                  ? "fill-red-400 text-red-400"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                          <span className="ml-2 text-sm text-gray-500">
                            ({product.reviewCount || 0})
                          </span>
                        </div>

                        <Link
                          href={`/products/${product.slug}`}
                          className="block hover:text-red-600 transition-colors"
                        >
                          <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-red-600">
                            {product.name}
                          </h3>
                        </Link>

                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {product.shortDescription ||
                            product.description ||
                            "Premium quality product designed for your fitness goals."}
                        </p>

                        {product.flavors > 1 && (
                          <p className="text-sm text-gray-500 mb-4">
                            {product.flavors} variants available
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-baseline space-x-2">
                          <span className="text-2xl font-black text-red-600">
                            {product.basePrice
                              ? formatCurrency(product.basePrice)
                              : ""}
                          </span>
                          {product.hasSale && product.regularPrice && (
                            <span className="text-base text-gray-400 line-through">
                              {formatCurrency(product.regularPrice)}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-3">
                          <Button
                            variant="outline"
                            className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-bold transition-all duration-200"
                            onClick={(e) => {
                              e.preventDefault();
                              handleQuickView(product);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Quick View
                          </Button>
                          <Button
                            className="bg-red-600 hover:bg-red-700 text-white font-bold transition-all duration-200"
                            onClick={(e) => {
                              e.preventDefault();
                              handleQuickView(product);
                            }}
                          >
                            <ShoppingBag className="h-4 w-4 mr-2" />
                            View Details
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
          isOpen={quickViewOpen}
          onClose={() => setQuickViewOpen(false)}
        />
      </div>
    </div>
  );
}

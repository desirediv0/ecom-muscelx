"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchApi, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Star,
  Minus,
  Plus,
  AlertCircle,
  ShoppingCart,
  Heart,
  Truck,
  ShieldCheck,
  Loader2,
  Eye,
  CheckCircle,
  ChevronRight,
  Award,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ProductCarousel from "./ProductCarousel";
import ReviewSection from "./ReviewSection";

// Helper function to normalize image URLs for Next.js Image component
const normalizeImageUrl = (url) => {
  if (!url) return "/placeholder.jpg";

  // If it's already an absolute URL, return as is
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // If it's a relative path that doesn't start with "/", add it
  if (!url.startsWith("/")) {
    return `/${url}`;
  }

  return url;
};

const ProductCard = React.memo(({ product, onQuickView }) => (
  <div className="bg-white border border-gray-200/80 rounded-2xl hover:border-red-400/70 transition-all duration-300 group shadow-md hover:shadow-xl hover:shadow-red-500/10 overflow-hidden flex flex-col h-full relative">
    <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
      <Button
        size="icon"
        variant="outline"
        className="bg-white/90 backdrop-blur-md rounded-full h-10 w-10 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200"
        onClick={() => onQuickView(product)}
      >
        <Eye className="h-5 w-5" />
      </Button>
    </div>

    <div className="relative p-4 flex-grow">
      <div className="relative mb-4 overflow-hidden rounded-xl bg-gray-50 aspect-square">
        <Image
          src={normalizeImageUrl(product.image)}
          alt={product.name}
          fill
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
          onError={(e) => {
            e.target.src = normalizeImageUrl("/product-placeholder.jpg");
          }}
        />
        {product.hasSale && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
            SALE
          </div>
        )}
      </div>

      <div className="p-2">
        <h3 className="text-lg font-bold mb-2 text-gray-800 group-hover:text-red-600 transition-colors line-clamp-2 h-14">
          {product.name}
        </h3>

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

        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-black text-red-600">
            {product.basePrice ? formatCurrency(product.basePrice) : ""}
          </span>
          {product.hasSale && product.regularPrice && (
            <span className="text-base text-gray-400 line-through">
              {formatCurrency(product.regularPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
    <div className="p-4 pt-0 mt-auto">
      <Button
        asChild
        className="w-full font-bold py-3 text-base"
        variant="outline"
      >
        <Link href={`/products/${product.slug}`}>View Details</Link>
      </Button>
    </div>
  </div>
));
ProductCard.displayName = "ProductCard";

const ProductPageSkeleton = () => (
  <div className="container mx-auto px-4 py-8 animate-pulse">
    <div className="h-6 w-3/4 bg-gray-200 rounded mb-10"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div>
        <div className="h-[450px] w-full bg-gray-200 rounded-lg"></div>
        <div className="grid grid-cols-5 gap-2 mt-4">
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
      <div className="space-y-6">
        <div className="h-8 w-3/4 bg-gray-200 rounded"></div>
        <div className="h-6 w-1/4 bg-gray-200 rounded"></div>
        <div className="h-10 w-1/2 bg-gray-200 rounded"></div>
        <div className="h-24 w-full bg-gray-200 rounded"></div>
        <div className="h-12 w-full bg-gray-200 rounded"></div>
        <div className="h-12 w-full bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
);

export default function ProductContent({ slug }) {
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [selectedFlavor, setSelectedFlavor] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [availableCombinations, setAvailableCombinations] = useState([]);
  const [currentImages, setCurrentImages] = useState([]);
  const [reviewsKey, setReviewsKey] = useState(0);

  const { addToCart } = useCart();

  const fetchProductDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchApi(`/public/products/${slug}`);
      const productData = response.data.product;

      // Calculate basePrice from variants if not available
      if (
        !productData.basePrice &&
        productData.variants &&
        productData.variants.length > 0
      ) {
        const firstVariant = productData.variants[0];
        productData.basePrice = parseFloat(
          firstVariant.salePrice || firstVariant.price
        );
        productData.regularPrice = parseFloat(firstVariant.price);
        productData.hasSale = !!firstVariant.salePrice;
      }

      setProduct(productData);
      setRelatedProducts(response.data.relatedProducts || []);

      if (productData.images && productData.images.length > 0) {
        setMainImage(productData.images[0]);
      }

      if (productData.variants && productData.variants.length > 0) {
        const combinations = productData.variants
          .filter((v) => v.isActive)
          .map((variant) => ({
            flavorId: variant.flavorId,
            weightId: variant.weightId,
            variant: variant,
          }));
        setAvailableCombinations(combinations);

        // Auto-select first available variant
        const firstAvailableVariant = combinations.find(
          (c) => c.variant.quantity > 0
        );
        if (firstAvailableVariant) {
          const flavor = productData.flavorOptions?.find(
            (f) => f.id === firstAvailableVariant.flavorId
          );
          const weight = productData.weightOptions?.find(
            (w) => w.id === firstAvailableVariant.weightId
          );
          setSelectedFlavor(flavor || null);
          setSelectedWeight(weight || null);
          setSelectedVariant(firstAvailableVariant.variant);
        }
      }

      // Set initial images with proper fallback handling
      if (productData.images && productData.images.length > 0) {
        setCurrentImages(productData.images);
      } else if (productData.variants && productData.variants.length > 0) {
        const firstVariantWithImages = productData.variants.find(
          (v) => v.images && v.images.length > 0
        );
        if (firstVariantWithImages) {
          const sortedImages = [...firstVariantWithImages.images].sort(
            (a, b) => {
              if (a.isPrimary && !b.isPrimary) return -1;
              if (!a.isPrimary && b.isPrimary) return 1;
              return 0;
            }
          );
          setCurrentImages(sortedImages);
        } else {
          setCurrentImages([]);
        }
      } else {
        setCurrentImages([]);
      }
    } catch (err) {
      console.error("Error fetching product details:", err);
      setError(err.message);
      setCurrentImages([]); // Ensure images is always an array even on error
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (slug) {
      fetchProductDetails();
    }
  }, [slug, fetchProductDetails]);

  useEffect(() => {
    const checkWishlist = async () => {
      if (!isAuthenticated || !product) return;
      try {
        const { data } = await fetchApi("/users/wishlist", {
          credentials: "include",
        });
        setIsInWishlist(
          data.wishlistItems.some((item) => item.productId === product.id)
        );
      } catch (err) {
        console.error("Failed to check wishlist", err);
      } finally {
      }
    };
    checkWishlist();
  }, [isAuthenticated, product]);

  const handleFlavorChange = (flavor) => {
    setSelectedFlavor(flavor);
    // Find a valid weight for this flavor
    const validWeight = product.weightOptions.find((weight) =>
      availableCombinations.some(
        (c) => c.flavorId === flavor.id && c.weightId === weight.id
      )
    );
    setSelectedWeight(validWeight || null);
  };

  const handleWeightChange = (weight) => {
    setSelectedWeight(weight);
    // Find a valid flavor for this weight
    const validFlavor = product.flavorOptions.find((flavor) =>
      availableCombinations.some(
        (c) => c.weightId === weight.id && c.flavorId === flavor.id
      )
    );
    setSelectedFlavor(validFlavor || null);
  };

  useEffect(() => {
    if (selectedFlavor || selectedWeight) {
      const variant = availableCombinations.find(
        (c) =>
          c.flavorId === selectedFlavor?.id && c.weightId === selectedWeight?.id
      )?.variant;
      setSelectedVariant(variant || null);

      // Update images based on selected variant
      if (variant && variant.images && variant.images.length > 0) {
        // Sort images so primary is first
        const sortedImages = [...variant.images].sort((a, b) => {
          if (a.isPrimary && !b.isPrimary) return -1;
          if (!a.isPrimary && b.isPrimary) return 1;
          return 0;
        });
        setCurrentImages(sortedImages);
      } else if (product && product.images && product.images.length > 0) {
        setCurrentImages(product.images);
      } else {
        // If no images, set empty array to show placeholder
        setCurrentImages([]);
      }

      // Reset quantity to 1 when variant changes
      setQuantity(1);
    }
  }, [selectedFlavor, selectedWeight, availableCombinations, product]);

  // Ensure quantity never exceeds available stock
  useEffect(() => {
    if (selectedVariant && quantity > selectedVariant.quantity) {
      setQuantity(selectedVariant.quantity);
    }
  }, [selectedVariant, quantity]);

  const handleQuantityChange = (change) => {
    setQuantity((prev) => {
      const newQuantity = prev + change;
      if (newQuantity < 1) return 1;
      if (selectedVariant && newQuantity > selectedVariant.quantity) {
        toast.warning(
          `Only ${selectedVariant.quantity} items available in stock.`
        );
        return selectedVariant.quantity;
      }
      return newQuantity;
    });
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toast.error("Please select an available variant.");
      return;
    }
    setIsAddingToCart(true);
    try {
      await addToCart(selectedVariant.id, quantity);
      toast.success(
        <div className="flex items-center gap-4">
          <CheckCircle className="text-green-500" />
          <span className="font-semibold">Product added to cart!</span>
        </div>
      );
    } catch (err) {
      toast.error(err.message || "Failed to add to cart.");
      console.error(err);
    } finally {
      setIsAddingToCart(false);
    }
  };
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!isAuthenticated || !product) return;

      try {
        const response = await fetchApi("/users/wishlist", {
          credentials: "include",
        });

        const wishlistItems = response.data.wishlistItems || [];
        const inWishlist = wishlistItems.some(
          (item) => item.productId === product.id
        );
        setIsInWishlist(inWishlist);
      } catch (error) {
        console.error("Failed to check wishlist status:", error);
      }
    };

    checkWishlistStatus();
  }, [isAuthenticated, product]);

  const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/products/${slug}`);
      return;
    }

    setIsAddingToWishlist(true);

    try {
      if (isInWishlist) {
        // Get wishlist to find the item ID
        const wishlistResponse = await fetchApi("/users/wishlist", {
          credentials: "include",
        });

        const wishlistItem = wishlistResponse.data.wishlistItems.find(
          (item) => item.productId === product.id
        );

        if (wishlistItem) {
          await fetchApi(`/users/wishlist/${wishlistItem.id}`, {
            method: "DELETE",
            credentials: "include",
          });

          setIsInWishlist(false);
        }
      } else {
        // Add to wishlist
        await fetchApi("/users/wishlist", {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({ productId: product.id }),
        });

        setIsInWishlist(true);
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  const handleReviewSubmitted = () => {
    fetchProductDetails();
    setReviewsKey((prev) => prev + 1);
  };

  if (loading) {
    return <ProductPageSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Could Not Load Product</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <Button asChild>
          <Link href="/products">
            <ChevronRight className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>
      </div>
    );
  }

  if (!product) return null;

  // Improved price calculation logic
  const getDisplayPrice = () => {
    if (selectedVariant) {
      const variantPrice = parseFloat(selectedVariant.price);
      const variantSalePrice = selectedVariant.salePrice
        ? parseFloat(selectedVariant.salePrice)
        : null;

      return {
        currentPrice: variantSalePrice || variantPrice,
        originalPrice: variantSalePrice ? variantPrice : null,
        onSale: !!variantSalePrice && variantSalePrice < variantPrice,
      };
    } else if (product.variants && product.variants.length > 0) {
      // Use first variant pricing as fallback
      const firstVariant = product.variants[0];
      const variantPrice = parseFloat(firstVariant.price);
      const variantSalePrice = firstVariant.salePrice
        ? parseFloat(firstVariant.salePrice)
        : null;

      return {
        currentPrice: variantSalePrice || variantPrice,
        originalPrice: variantSalePrice ? variantPrice : null,
        onSale: !!variantSalePrice && variantSalePrice < variantPrice,
      };
    } else {
      return {
        currentPrice: product.basePrice || 0,
        originalPrice: product.hasSale ? product.regularPrice : null,
        onSale: product.hasSale,
      };
    }
  };

  const priceInfo = getDisplayPrice();

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-red-600">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link href="/products" className="hover:text-red-600">
            Products
          </Link>
          {product.category && (
            <>
              <ChevronRight className="h-4 w-4 mx-2" />
              <Link
                href={`/category/${product.category.slug}`}
                className="hover:text-red-600"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-gray-800 font-medium">{product.name}</span>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12">
          {/* Left: Image Carousel */}
          <div className="lg:sticky top-24 self-start">
            <ProductCarousel
              images={currentImages}
              productName={product.name}
              showSaleBadge={priceInfo.onSale}
            />
          </div>

          {/* Right: Product Details */}
          <div className="mt-8 lg:mt-0">
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center mt-3 mb-5 gap-4">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-red-500" fill="currentColor" />
                <span className="ml-1.5 font-bold text-gray-800">
                  {(product.avgRating || 0).toFixed(1)}
                </span>
                <span className="text-sm text-gray-500 ml-1">
                  ({product.reviewCount || 0} Reviews)
                </span>
              </div>
              <div className="h-5 w-px bg-gray-300"></div>
              {selectedVariant ? (
                <span
                  className={`text-sm font-bold ${
                    selectedVariant.quantity > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {selectedVariant.quantity > 0 ? "In Stock" : "Out of Stock"}
                </span>
              ) : (
                <span className="text-sm font-bold text-green-600">
                  In Stock
                </span>
              )}
            </div>

            <div className="text-4xl font-bold text-gray-900 flex items-baseline gap-3 mb-6">
              <span>{formatCurrency(priceInfo.currentPrice)}</span>
              {priceInfo.onSale && (
                <span className="text-2xl text-gray-400 line-through">
                  {formatCurrency(priceInfo.originalPrice)}
                </span>
              )}
            </div>

            <div
              className="prose prose-lg text-gray-700 max-w-none mb-8 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html:
                  product.description ||
                  product.shortDescription ||
                  "Experience premium quality with this exceptional product designed for your fitness goals.",
              }}
            />

            {/* Selection Status */}
            {(product.flavorOptions?.length > 0 ||
              product.weightOptions?.length > 0) &&
              !selectedVariant && (
                <div className="bg-yellow-50 border border-yellow-200 p-4 mb-6">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mr-3" />
                    <span className="text-yellow-800 font-medium">
                      Please select{" "}
                      {product.flavorOptions?.length > 0 ? "a flavor" : ""}
                      {product.flavorOptions?.length > 0 &&
                      product.weightOptions?.length > 0
                        ? " and "
                        : ""}
                      {product.weightOptions?.length > 0 ? "a weight" : ""} to
                      continue
                    </span>
                  </div>
                </div>
              )}

            {product.flavorOptions?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Choose Flavor
                  {selectedFlavor && (
                    <span className="ml-2 text-red-600">
                      ({selectedFlavor.name})
                    </span>
                  )}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {product.flavorOptions.map((flavor) => (
                    <button
                      key={flavor.id}
                      onClick={() => handleFlavorChange(flavor)}
                      className={`px-6 py-3 text-sm font-bold border-2 transition-all duration-200 ${
                        selectedFlavor?.id === flavor.id
                          ? "border-red-600 bg-red-600 text-white shadow-md"
                          : "border-gray-300 bg-white hover:border-red-500 hover:text-red-600 text-gray-700"
                      }`}
                    >
                      {flavor.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.weightOptions?.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Choose Weight
                  {selectedWeight && (
                    <span className="ml-2 text-red-600">
                      (
                      {selectedWeight.display ||
                        `${selectedWeight.value}${selectedWeight.unit}`}
                      )
                    </span>
                  )}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {product.weightOptions.map((weight) => (
                    <button
                      key={weight.id}
                      onClick={() => handleWeightChange(weight)}
                      className={`px-6 py-3 text-sm font-bold border-2 transition-all duration-200 ${
                        selectedWeight?.id === weight.id
                          ? "border-red-600 bg-red-600 text-white shadow-md"
                          : "border-gray-300 bg-white hover:border-red-500 hover:text-red-600 text-gray-700"
                      }`}
                    >
                      {weight.display || `${weight.value}${weight.unit}`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-gray-50 border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Quantity & Add to Cart
              </h3>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <div className="flex items-center  bg-white">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className={`px-4 py-3 bg-red-600 text-white hover:bg-red-700 transition-all duration-200 ${
                        quantity <= 1
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:shadow-md"
                      }`}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-6 py-3 font-bold text-lg bg-white min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={
                        selectedVariant && quantity >= selectedVariant.quantity
                      }
                      className={`px-4 py-3 bg-red-600 text-white hover:bg-red-700 transition-all duration-200 ${
                        selectedVariant && quantity >= selectedVariant.quantity
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:shadow-md"
                      }`}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  {selectedVariant && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Available:</span>{" "}
                      <span className="text-green-600 font-bold">
                        {selectedVariant.quantity} in stock
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-1 gap-3 w-full sm:w-auto">
                  <Button
                    onClick={handleAddToCart}
                    size="lg"
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 shadow-lg hover:shadow-xl transition-all duration-200"
                    disabled={
                      isAddingToCart ||
                      !selectedVariant ||
                      selectedVariant.quantity < 1
                    }
                  >
                    {isAddingToCart ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Add to Cart
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    className={`border-2 transition-all duration-200 px-4 ${
                      isInWishlist
                        ? "text-red-600 border-red-600 bg-red-50 hover:bg-red-100"
                        : "text-gray-600 border-gray-300 hover:border-red-600 hover:text-red-600 hover:bg-red-50"
                    }`}
                    onClick={handleAddToWishlist}
                    disabled={isAddingToWishlist}
                  >
                    {isAddingToWishlist ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Heart
                        className={`h-5 w-5 ${
                          isInWishlist ? "fill-current" : ""
                        }`}
                      />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 p-6 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Award className="h-6 w-6 text-red-600 mr-2" />
                Product Guarantees
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center text-sm font-medium bg-white p-4 border border-gray-100 hover:shadow-md transition-all duration-200">
                  <div className="bg-green-100 p-2 mr-3">
                    <ShieldCheck className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">
                      100% Authentic
                    </div>
                    <div className="text-gray-600 text-xs">
                      Lab-Tested Quality
                    </div>
                  </div>
                </div>
                <div className="flex items-center text-sm font-medium bg-white p-4 border border-gray-100 hover:shadow-md transition-all duration-200">
                  <div className="bg-yellow-100 p-2 mr-3">
                    <Award className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Trusted Brand</div>
                    <div className="text-gray-600 text-xs">
                      India&apos;s #1 Choice
                    </div>
                  </div>
                </div>
                <div className="flex items-center text-sm font-medium bg-white p-4 border border-gray-100 hover:shadow-md transition-all duration-200">
                  <div className="bg-blue-100 p-2 mr-3">
                    <Truck className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Fast Shipping</div>
                    <div className="text-gray-600 text-xs">Free Delivery</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs for Description & Reviews */}
        <div className="mt-16">
          <div className="border-b border-gray-200 bg-white">
            <nav className="-mb-px flex space-x-8 px-8">
              <button
                onClick={() => setActiveTab("description")}
                className={`whitespace-nowrap py-5 px-4 border-b-2 font-bold text-lg transition-all duration-300 ${
                  activeTab === "description"
                    ? "border-red-600 text-red-600 bg-white hover:text-white hover:border-red-300"
                    : "border-transparent text-gray-200 hover:text-white hover:border-red-300"
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`whitespace-nowrap py-5 px-4 border-b-2 font-bold text-lg transition-all duration-300 ${
                  activeTab === "reviews"
                    ? "border-red-600 text-red-600 bg-white hover:text-white hover:border-red-300"
                    : "border-transparent text-gray-200 hover:text-white hover:border-red-300"
                }`}
              >
                Reviews ({product.reviewCount || 0})
              </button>
            </nav>
          </div>
          <div className="p-8 bg-white shadow-lg">
            {activeTab === "description" && (
              <div className="space-y-8">
                <div
                  className="prose max-w-none text-gray-800 prose-headings:text-gray-900 prose-a:text-red-600 prose-strong:text-gray-900 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            )}
            {activeTab === "reviews" && (
              <ReviewSection
                key={reviewsKey}
                productId={product.id}
                productName={product.name}
                productSlug={product.slug}
                onReviewSubmitted={handleReviewSubmitted}
              />
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-16 bg-gray-50 p-8">
            <h2 className="text-3xl font-bold text-center mb-10 text-gray-900">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <div key={p.id} className="group">
                  <Link href={`/products/${p.slug}`} className="block">
                    <div className="bg-white border border-gray-200 p-4 hover:shadow-lg transition-all duration-300">
                      <div className="relative aspect-square bg-gray-50 mb-4 overflow-hidden">
                        <Image
                          src={p.image || "/product-placeholder.jpg"}
                          alt={p.name || "Product"}
                          fill
                          className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = "/product-placeholder.jpg";
                          }}
                        />
                      </div>
                      <h3 className="font-bold text-lg mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                        {p.name}
                      </h3>
                      <div className="flex items-center mb-2">
                        <div className="flex text-red-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="h-4 w-4"
                              fill={
                                i < Math.round(p.avgRating || 0)
                                  ? "currentColor"
                                  : "none"
                              }
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 ml-2">
                          ({p.reviewCount || 0})
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-bold text-xl text-red-600">
                          {formatCurrency(p.basePrice)}
                        </span>
                        {p.hasSale && p.regularPrice && (
                          <span className="text-gray-400 line-through text-sm">
                            {formatCurrency(p.regularPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

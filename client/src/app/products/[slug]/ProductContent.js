"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  Package,
  Loader2,
  Share2,
  Eye,
  CheckCircle,
  ChevronRight,
  Award,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import ReviewSection from "./ReviewSection";
import { toast } from "sonner";
import ProductQuickView from "@/components/ProductQuickView";
import ProductCarousel from "./ProductCarousel";

const ProductCard = React.memo(({ product, onQuickView }) => (
  <div className="bg-white border border-gray-200/80 rounded-2xl hover:border-red-400/70 transition-all duration-300 group shadow-md hover:shadow-xl hover:shadow-red-500/10 overflow-hidden flex flex-col h-full relative">
    <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
      <Button
        size="icon"
        variant="outline"
        className="bg-white/80 backdrop-blur-md rounded-full h-10 w-10 hover:bg-white hover:text-red-500"
        onClick={() => onQuickView(product)}
      >
        <Eye className="h-5 w-5" />
      </Button>
    </div>

    <div className="relative p-4 flex-grow">
      <div className="relative mb-4 overflow-hidden rounded-xl bg-gray-50 aspect-square">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
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

  const { addToCart } = useCart();

  const fetchProductDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchApi(`/public/products/${slug}`);
      const productData = response.data.product;
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
    } catch (err) {
      console.error("Error fetching product details:", err);
      setError(err.message);
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
      // Reset quantity to 1 when variant changes
      setQuantity(1);
    }
  }, [selectedFlavor, selectedWeight, availableCombinations]);

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

  const price = selectedVariant?.price || product.basePrice;
  const salePrice =
    selectedVariant?.salePrice || (product.hasSale ? product.basePrice : null);
  const regularPrice = selectedVariant?.price || product.regularPrice;
  const onSale = salePrice && salePrice < regularPrice;

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
              images={product.images}
              productName={product.name}
              showSaleBadge={onSale}
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
              <span>{formatCurrency(onSale ? salePrice : price)}</span>
              {onSale && (
                <span className="text-2xl text-gray-400 line-through">
                  {formatCurrency(regularPrice)}
                </span>
              )}
            </div>

            <div
              className="prose prose-sm text-gray-600 max-w-none mb-8"
              dangerouslySetInnerHTML={{
                __html: product.shortDescription || "",
              }}
            />

            {product.flavorOptions?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                  Flavor:{" "}
                  <span className="font-bold text-red-600">
                    {selectedFlavor?.name}
                  </span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.flavorOptions.map((flavor) => (
                    <button
                      key={flavor.id}
                      onClick={() => handleFlavorChange(flavor)}
                      className={`px-4 py-2 text-sm font-semibold rounded-lg border-2 transition-all ${
                        selectedFlavor?.id === flavor.id
                          ? "border-red-600 bg-red-600 text-white shadow-md"
                          : "border-gray-300 bg-white hover:border-red-500 text-black"
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
                <h3 className="text-sm font-semibold text-gray-800 mb-3">
                  Weight:{" "}
                  <span className="font-bold text-red-600">
                    {selectedWeight?.value}
                    {selectedWeight?.unit}
                  </span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.weightOptions.map((weight) => (
                    <button
                      key={weight.id}
                      onClick={() => handleWeightChange(weight)}
                      className={`px-4 py-2 text-sm font-semibold rounded-lg border-2 transition-all ${
                        selectedWeight?.id === weight.id
                          ? "border-red-600 bg-red-600 text-white shadow-md"
                          : "border-gray-300 bg-white hover:border-red-500 text-black"
                      }`}
                    >
                      {weight.value}
                      {weight.unit}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 mb-6">
              <div className="flex flex-col gap-2">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className={`px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-l-lg transition ${
                      quantity <= 1 ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-6 py-3 font-bold text-lg">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={
                      selectedVariant && quantity >= selectedVariant.quantity
                    }
                    className={`px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-r-lg transition ${
                      selectedVariant && quantity >= selectedVariant.quantity
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {selectedVariant && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Available:</span>{" "}
                    {selectedVariant.quantity} in stock
                  </div>
                )}
              </div>
              <Button
                onClick={handleAddToCart}
                size="lg"
                className="w-full bg-red-600 hover:bg-red-700 text-base font-bold"
                disabled={
                  isAddingToCart ||
                  !selectedVariant ||
                  selectedVariant.quantity < 1
                }
              >
                {isAddingToCart ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <ShoppingCart className="mr-2 h-5 w-5" />
                )}
                {isAddingToCart ? "Adding..." : "Add to Cart"}
              </Button>
              <Button
                variant="outline"
                className={`rounded-md py-6  ${
                  isInWishlist
                    ? "text-red-600 border-red-600 hover:bg-red-50"
                    : "text-black border-black hover:bg-black hover:text-white"
                }`}
                onClick={handleAddToWishlist}
                disabled={isAddingToWishlist}
              >
                <Heart
                  className={`h-5 w-5 ${isInWishlist ? "fill-current" : ""}`}
                />
              </Button>
            </div>

            <div className="border-t border-gray-200 pt-6 space-y-4">
              <div className="flex items-center text-sm text-gray-600">
                <ShieldCheck className="h-5 w-5 text-green-600 mr-3" />
                <span>100% Authentic & Lab-Tested</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Award className="h-5 w-5 text-yellow-500 mr-3" />
                <span>India's #1 Most Trusted Supplement Brand</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Truck className="h-5 w-5 text-blue-500 mr-3" />
                <span>Fast & Free Shipping on All Orders</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs for Description & Reviews */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("description")}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-semibold text-base ${
                  activeTab === "description"
                    ? "border-red-600 text-white"
                    : "border-transparent text-white hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Description
              </button>
            </nav>
          </div>
          <div className="py-10">
            {activeTab === "description" && (
              <div
                className="prose max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-10">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((p) => (
                <Link href={`/products/${p.slug}`} key={p.id} className="group">
                  <div className="bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={p.image}
                      alt={p.name}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="font-bold text-lg mt-4 group-hover:text-red-600 transition">
                    {p.name}
                  </h3>
                  <p className="font-bold text-red-600 mt-1">
                    {formatCurrency(p.basePrice)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

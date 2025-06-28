"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchApi, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Star,
  Minus,
  Plus,
  ShoppingCart,
  CheckCircle,
  AlertCircle,
  X,
  Zap,
  Shield,
  Award,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";

// Helper function to normalize image URLs for Next.js Image component
const normalizeImageUrl = (url) => {
  if (!url) return "/product-placeholder.jpg";

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

export default function ProductQuickView({ product, open, onOpenChange }) {
  const [selectedFlavor, setSelectedFlavor] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [success, setSuccess] = useState(false);
  const { addToCart } = useCart();
  const [productDetails, setProductDetails] = useState(null);
  const [imgSrc, setImgSrc] = useState("");
  const [availableCombinations, setAvailableCombinations] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);

  // Reset states when product changes or dialog closes
  useEffect(() => {
    if (!open) {
      setSelectedFlavor(null);
      setSelectedWeight(null);
      setSelectedVariant(null);
      setQuantity(1);
      setError(null);
      setSuccess(false);
      setProductDetails(null);
      setImgSrc("/product-placeholder.jpg");
      setAvailableCombinations([]);
      setInitialLoading(true);
      return;
    }

    if (product) {
      // Use product as initial data - don't modify it here, let the API call handle the complete data
      setProductDetails(product);

      // Set initial image from product or first variant
      if (product.variants && product.variants.length > 0) {
        const firstActiveVariant = product.variants.find(
          (v) => v.isActive && v.images && v.images.length > 0
        );
        if (firstActiveVariant) {
          const primaryImage = firstActiveVariant.images.find(
            (img) => img.isPrimary
          );
          setImgSrc(
            normalizeImageUrl(
              primaryImage ? primaryImage.url : firstActiveVariant.images[0].url
            )
          );
        } else if (product.images && product.images.length > 0) {
          setImgSrc(normalizeImageUrl(product.images[0].url));
        } else {
          setImgSrc(normalizeImageUrl(product.image));
        }
      } else if (product.images && product.images.length > 0) {
        setImgSrc(normalizeImageUrl(product.images[0].url));
      } else {
        setImgSrc(normalizeImageUrl(product.image));
      }

      setInitialLoading(false);
    }
  }, [product, open]);

  // Fetch product details when product changes
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!product || !open) return;

      setLoading(true);
      setInitialLoading(true);
      try {
        const response = await fetchApi(`/public/products/${product.slug}`);
        if (response.data && response.data.product) {
          const productData = response.data.product;
          setProductDetails(productData);

          // Set initial image - prioritize variant images over product images
          if (productData.variants && productData.variants.length > 0) {
            const firstActiveVariant = productData.variants.find(
              (v) => v.isActive && v.images && v.images.length > 0
            );
            if (firstActiveVariant) {
              const primaryImage = firstActiveVariant.images.find(
                (img) => img.isPrimary
              );
              setImgSrc(
                normalizeImageUrl(
                  primaryImage
                    ? primaryImage.url
                    : firstActiveVariant.images[0].url
                )
              );
            } else if (productData.images && productData.images.length > 0) {
              setImgSrc(normalizeImageUrl(productData.images[0].url));
            } else {
              setImgSrc(normalizeImageUrl(productData.image));
            }
          } else if (productData.images && productData.images.length > 0) {
            setImgSrc(normalizeImageUrl(productData.images[0].url));
          } else {
            setImgSrc(normalizeImageUrl(productData.image));
          }

          // Set up available combinations from active variants
          if (productData.variants && productData.variants.length > 0) {
            const combinations = productData.variants
              .filter((v) => v.isActive)
              .map((variant) => ({
                flavorId: variant.flavorId,
                weightId: variant.weightId,
                variant: variant,
              }));

            setAvailableCombinations(combinations);

            // Auto-select first available options
            if (productData.flavorOptions?.length > 0) {
              const firstFlavor = productData.flavorOptions[0];
              setSelectedFlavor(firstFlavor);

              // Find available variants for this flavor
              const availableVariantsForFlavor = combinations.filter(
                (combo) =>
                  combo.flavorId === firstFlavor.id &&
                  combo.variant.quantity > 0
              );

              if (
                availableVariantsForFlavor.length > 0 &&
                productData.weightOptions
              ) {
                // Select the first available weight for this flavor
                const firstAvailableVariant = availableVariantsForFlavor[0];
                const matchingWeight = productData.weightOptions.find(
                  (weight) => weight.id === firstAvailableVariant.weightId
                );

                if (matchingWeight) {
                  setSelectedWeight(matchingWeight);
                  setSelectedVariant(firstAvailableVariant.variant);
                }
              }
            } else if (productData.weightOptions?.length > 0) {
              const firstWeight = productData.weightOptions[0];
              setSelectedWeight(firstWeight);

              const matchingVariant = combinations.find(
                (combo) =>
                  combo.weightId === firstWeight.id &&
                  combo.variant.quantity > 0
              );

              if (matchingVariant) {
                setSelectedVariant(matchingVariant.variant);
              }
            } else {
              // If no flavor/weight options, just select first available variant
              const firstActiveVariant = productData.variants.find(
                (v) => v.isActive && v.quantity > 0
              );
              setSelectedVariant(firstActiveVariant || productData.variants[0]);
            }
          }
        } else {
          setError("Product details not available");
        }
      } catch (err) {
        console.error("Error fetching product details:", err);
        setError("Failed to load product details");
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    };

    fetchProductDetails();
  }, [product, open]);

  // Update image when selected variant changes
  useEffect(() => {
    if (
      selectedVariant &&
      selectedVariant.images &&
      selectedVariant.images.length > 0
    ) {
      // Sort images so primary is first
      const sortedImages = [...selectedVariant.images].sort((a, b) => {
        if (a.isPrimary && !b.isPrimary) return -1;
        if (!a.isPrimary && b.isPrimary) return 1;
        return 0;
      });
      setImgSrc(normalizeImageUrl(sortedImages[0].url));
    } else if (productDetails) {
      // Fallback to product images or default
      if (productDetails.images && productDetails.images.length > 0) {
        setImgSrc(normalizeImageUrl(productDetails.images[0].url));
      } else {
        setImgSrc(normalizeImageUrl(productDetails.image));
      }
    }
  }, [selectedVariant, productDetails]);

  const getAvailableWeightsForFlavor = (flavorId) => {
    const availableWeights = availableCombinations
      .filter((combo) => combo.flavorId === flavorId)
      .map((combo) => combo.weightId);

    return availableWeights;
  };

  const getAvailableFlavorsForWeight = (weightId) => {
    const availableFlavors = availableCombinations
      .filter((combo) => combo.weightId === weightId)
      .map((combo) => combo.flavorId);

    return availableFlavors;
  };

  const handleFlavorChange = (flavor) => {
    setSelectedFlavor(flavor);

    const availableWeightIds = getAvailableWeightsForFlavor(flavor.id);

    if (
      productDetails?.weightOptions?.length > 0 &&
      availableWeightIds.length > 0
    ) {
      if (selectedWeight && availableWeightIds.includes(selectedWeight.id)) {
        const matchingVariant = availableCombinations.find(
          (combo) =>
            combo.flavorId === flavor.id && combo.weightId === selectedWeight.id
        );

        if (matchingVariant) {
          setSelectedVariant(matchingVariant.variant);
        }
      } else {
        const firstAvailableWeight = productDetails.weightOptions.find(
          (weight) => availableWeightIds.includes(weight.id)
        );

        if (firstAvailableWeight) {
          setSelectedWeight(firstAvailableWeight);

          const matchingVariant = availableCombinations.find(
            (combo) =>
              combo.flavorId === flavor.id &&
              combo.weightId === firstAvailableWeight.id
          );

          if (matchingVariant) {
            setSelectedVariant(matchingVariant.variant);
          }
        }
      }
    } else {
      setSelectedWeight(null);
      setSelectedVariant(null);
    }
  };

  const handleWeightChange = (weight) => {
    setSelectedWeight(weight);

    const availableFlavorIds = getAvailableFlavorsForWeight(weight.id);

    if (
      productDetails?.flavorOptions?.length > 0 &&
      availableFlavorIds.length > 0
    ) {
      if (selectedFlavor && availableFlavorIds.includes(selectedFlavor.id)) {
        const matchingVariant = availableCombinations.find(
          (combo) =>
            combo.weightId === weight.id && combo.flavorId === selectedFlavor.id
        );

        if (matchingVariant) {
          setSelectedVariant(matchingVariant.variant);
        }
      } else {
        const firstAvailableFlavor = productDetails.flavorOptions.find(
          (flavor) => availableFlavorIds.includes(flavor.id)
        );

        if (firstAvailableFlavor) {
          setSelectedFlavor(firstAvailableFlavor);

          const matchingVariant = availableCombinations.find(
            (combo) =>
              combo.weightId === weight.id &&
              combo.flavorId === firstAvailableFlavor.id
          );

          if (matchingVariant) {
            setSelectedVariant(matchingVariant.variant);
          }
        }
      }
    } else {
      setSelectedFlavor(null);
      setSelectedVariant(null);
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity < 1) return;
    if (
      selectedVariant &&
      selectedVariant.quantity > 0 &&
      newQuantity > selectedVariant.quantity
    )
      return;
    setQuantity(newQuantity);
  };

  const handleAddToCart = async () => {
    setAddingToCart(true);
    setError(null);
    setSuccess(false);

    let variantToAdd = selectedVariant;

    if (!variantToAdd && productDetails?.variants?.length > 0) {
      variantToAdd = productDetails.variants[0];
    }

    if (!variantToAdd) {
      setError("No product variant available");
      setAddingToCart(false);
      return;
    }

    try {
      await addToCart(variantToAdd.id, quantity);
      setSuccess(true);

      setTimeout(() => {
        onOpenChange(false);
      }, 2000);
    } catch (err) {
      console.error("Error adding to cart:", err);
      setError("Failed to add to cart. Please try again.");
    } finally {
      setAddingToCart(false);
    }
  };

  const getPriceDisplay = () => {
    if (initialLoading || loading) {
      return <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>;
    }

    if (selectedVariant) {
      const salePrice = parseFloat(selectedVariant.salePrice);
      const regularPrice = parseFloat(selectedVariant.price);

      if (selectedVariant.salePrice && salePrice > 0) {
        return (
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-red-600">
              {formatCurrency(salePrice)}
            </span>
            <span className="text-xl text-gray-500 line-through">
              {formatCurrency(regularPrice)}
            </span>
          </div>
        );
      }
      return (
        <span className="text-3xl font-bold text-red-600">
          {formatCurrency(regularPrice || 0)}
        </span>
      );
    }

    if (productDetails) {
      if (productDetails.hasSale && productDetails.basePrice > 0) {
        return (
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-red-600">
              {formatCurrency(productDetails.basePrice)}
            </span>
            <span className="text-xl text-gray-500 line-through">
              {formatCurrency(productDetails.regularPrice || 0)}
            </span>
          </div>
        );
      }
      return (
        <span className="text-3xl font-bold text-red-600">
          {formatCurrency(productDetails.basePrice || 0)}
        </span>
      );
    }

    if (product) {
      if (product.hasSale && product.basePrice > 0) {
        return (
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-red-600">
              {formatCurrency(product.basePrice)}
            </span>
            <span className="text-xl text-gray-500 line-through">
              {formatCurrency(product.regularPrice || 0)}
            </span>
          </div>
        );
      }
      return (
        <span className="text-3xl font-bold text-red-600">
          {formatCurrency(product.basePrice || 0)}
        </span>
      );
    }

    return null;
  };

  if (!product) return null;

  const displayProduct = productDetails || product;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[850px] max-h-[80vh] overflow-y-auto p-0 bg-white border-0 shadow-2xl rounded-3xl">
        {/* Header */}
        <DialogHeader className="p-4 border-b border-gray-100 flex justify-end sticky top-0 bg-white z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="w-8 h-8 p-0 rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-800"
          >
            <X className="h-5 w-5" />
          </Button>
        </DialogHeader>

        {loading && !productDetails ? (
          <div className="py-20 flex justify-center">
            <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 bg-white rounded-b-3xl">
            {/* Product Image */}
            <div className="relative">
              <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden bg-gray-50 shadow-lg border border-gray-100">
                <Image
                  src={imgSrc}
                  alt={displayProduct.name}
                  fill
                  className="object-contain p-6"
                  sizes="(max-width: 768px) 100vw, 450px"
                  onError={() =>
                    setImgSrc(normalizeImageUrl("/product-placeholder.jpg"))
                  }
                />
                {displayProduct.hasSale && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-lg">
                    SALE
                  </div>
                )}
              </div>

              {/* Product Features */}
              <div className="grid grid-cols-3 gap-3 mt-6">
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
                  <Shield className="h-5 w-5 text-green-600 mx-auto mb-1" />
                  <span className="text-xs font-semibold text-green-700">
                    Lab Tested
                  </span>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
                  <Zap className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                  <span className="text-xs font-semibold text-blue-700">
                    Fast Acting
                  </span>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-center">
                  <Award className="h-5 w-5 text-yellow-600 mx-auto mb-1" />
                  <span className="text-xs font-semibold text-yellow-700">
                    Premium
                  </span>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col space-y-3">
              <DialogTitle className="text-3xl font-bold text-gray-900 -mt-2">
                {displayProduct.name}
              </DialogTitle>

              {/* Success Message */}
              {success && (
                <div className="p-4 bg-green-50 border border-green-200 text-green-700 text-base rounded-xl flex items-center">
                  <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0" />
                  <span className="font-semibold">
                    Item added to cart successfully!
                  </span>
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-base rounded-xl flex items-center">
                  <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
                  <span className="font-semibold">{error}</span>
                </div>
              )}

              {/* Price */}
              <div className="border-b border-gray-100 pb-4">
                {getPriceDisplay()}
              </div>

              {/* Rating */}
              {displayProduct.avgRating > 0 && (
                <div className="flex items-center space-x-3">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= Math.round(displayProduct.avgRating || 0)
                            ? "text-red-400 fill-red-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 font-medium">
                    {displayProduct.avgRating?.toFixed(1)} (
                    {displayProduct.reviewCount || 0} reviews)
                  </span>
                </div>
              )}

              {/* Flavor selection */}
              {productDetails?.flavorOptions &&
                productDetails.flavorOptions.length > 0 && (
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-3">
                      Choose Flavor
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {productDetails.flavorOptions.map((flavor) => {
                        const availableWeightIds = getAvailableWeightsForFlavor(
                          flavor.id
                        );
                        const isAvailable = availableWeightIds.length > 0;

                        return (
                          <button
                            key={flavor.id}
                            type="button"
                            onClick={() => handleFlavorChange(flavor)}
                            disabled={!isAvailable}
                            className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all shadow-sm ${
                              selectedFlavor?.id === flavor.id
                                ? "border-red-500 bg-red-500 text-white shadow-md"
                                : isAvailable
                                ? "border-gray-300 bg-white text-gray-800 hover:border-red-500 hover:text-red-600"
                                : "border-gray-200 text-gray-400 bg-gray-100 cursor-not-allowed"
                            }`}
                          >
                            {flavor.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

              {/* Weight selection */}
              {productDetails?.weightOptions &&
                productDetails.weightOptions.length > 0 && (
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-3">
                      Choose Weight
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {productDetails.weightOptions.map((weight) => {
                        const availableFlavorIds = getAvailableFlavorsForWeight(
                          weight.id
                        );
                        const isAvailable = selectedFlavor
                          ? availableCombinations.some(
                              (combo) =>
                                combo.flavorId === selectedFlavor.id &&
                                combo.weightId === weight.id
                            )
                          : availableFlavorIds.length > 0;

                        return (
                          <button
                            key={weight.id}
                            type="button"
                            onClick={() => handleWeightChange(weight)}
                            disabled={!isAvailable}
                            className={`px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all shadow-sm ${
                              selectedWeight?.id === weight.id
                                ? "border-red-500 bg-red-500 text-white shadow-md"
                                : isAvailable
                                ? "border-gray-300 bg-white text-gray-800 hover:border-red-500 hover:text-red-600"
                                : "border-gray-200 text-gray-400 bg-gray-100 cursor-not-allowed"
                            }`}
                          >
                            {weight.display || `${weight.value} ${weight.unit}`}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

              {/* Stock Availability */}
              {selectedVariant && (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <span
                    className={`text-sm font-semibold ${
                      selectedVariant.quantity > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {selectedVariant.quantity > 0
                      ? `✓ In Stock (${selectedVariant.quantity} available)`
                      : "✗ Out of Stock"}
                  </span>
                </div>
              )}

              {/* Quantity */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  Quantity
                </label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden bg-white">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="p-3 bg-gray-50 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={quantity <= 1 || loading}
                    >
                      <Minus className="h-4 w-4 text-gray-600" />
                    </button>
                    <span className="px-6 py-3 bg-white font-bold text-gray-900 min-w-[4rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="p-3 bg-gray-50 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={
                        loading ||
                        (selectedVariant &&
                          selectedVariant.quantity > 0 &&
                          quantity >= selectedVariant.quantity)
                      }
                    >
                      <Plus className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-4 pt-4">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
                  disabled={
                    loading ||
                    addingToCart ||
                    (!selectedVariant &&
                      (!productDetails?.variants ||
                        productDetails.variants.length === 0)) ||
                    (selectedVariant && selectedVariant.quantity < 1)
                  }
                >
                  {addingToCart ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-5 w-5 mr-3" />
                      Add to Cart
                    </>
                  )}
                </Button>

                <Link
                  href={`/products/${displayProduct.slug}`}
                  className="flex-1"
                >
                  <Button
                    variant="outline"
                    className="w-full py-4 border-2 border-red-500 text-red-600 hover:bg-red-50 hover:text-red-600 font-bold text-lg rounded-xl transition-all"
                  >
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

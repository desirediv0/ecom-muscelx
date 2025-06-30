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
import { Star, AlertCircle, Zap, Shield, Award } from "lucide-react";

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

export default function ProductQuickView({ product, isOpen, onClose }) {
  const [selectedFlavor, setSelectedFlavor] = useState(null);
  const [selectedWeight, setSelectedWeight] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [productDetails, setProductDetails] = useState(null);
  const [imgSrc, setImgSrc] = useState("");
  const [availableCombinations, setAvailableCombinations] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);

  // Reset states when product changes or dialog closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedFlavor(null);
      setSelectedWeight(null);
      setSelectedVariant(null);
      setError(null);
      setProductDetails(null);
      setImgSrc("/placeholder.jpg");
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
  }, [product, isOpen]);

  // Fetch product details when product changes
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!product || !isOpen) return;

      setLoading(true);
      setInitialLoading(true);
      setError(null);
      try {
        console.log("Fetching details for product:", product.name);
        const response = await fetchApi(`/public/products/${product.slug}`);

        if (response.data && response.data.product) {
          const productData = response.data.product;
          console.log("Product data loaded:", productData);
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
            console.log("Available combinations:", combinations);

            // Auto-select first available options
            if (productData.flavorOptions?.length > 0) {
              const firstFlavor = productData.flavorOptions[0];
              const availableVariantsForFlavor = combinations.filter(
                (combo) =>
                  combo.flavorId === firstFlavor.id &&
                  combo.variant.quantity > 0
              );

              if (availableVariantsForFlavor.length > 0) {
                setSelectedFlavor(firstFlavor);

                if (productData.weightOptions?.length > 0) {
                  // Select the first available weight for this flavor
                  const firstAvailableVariant = availableVariantsForFlavor[0];
                  const matchingWeight = productData.weightOptions.find(
                    (weight) => weight.id === firstAvailableVariant.weightId
                  );

                  if (matchingWeight) {
                    setSelectedWeight(matchingWeight);
                    setSelectedVariant(firstAvailableVariant.variant);
                  }
                } else {
                  // No weight options, just set the variant
                  setSelectedVariant(availableVariantsForFlavor[0].variant);
                }
              }
            } else if (productData.weightOptions?.length > 0) {
              const firstWeight = productData.weightOptions[0];
              const matchingVariant = combinations.find(
                (combo) =>
                  combo.weightId === firstWeight.id &&
                  combo.variant.quantity > 0
              );

              if (matchingVariant) {
                setSelectedWeight(firstWeight);
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
          console.error("No product data in response");
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
  }, [product, isOpen]);

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

  const getPriceDisplay = () => {
    if (initialLoading || loading) {
      return <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>;
    }

    if (selectedVariant) {
      const salePrice = selectedVariant.salePrice
        ? parseFloat(selectedVariant.salePrice)
        : null;
      const regularPrice = parseFloat(selectedVariant.price);

      if (salePrice && salePrice > 0) {
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

    return (
      <span className="text-3xl font-bold text-red-600">
        {formatCurrency(0)}
      </span>
    );
  };

  if (!product) return null;

  const displayProduct = productDetails || product;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white border-2 border-gray-300 rounded-lg shadow-xl">
        <DialogHeader className="border-b-2 border-gray-200 pb-4">
          <DialogTitle className="text-2xl font-bold text-gray-900 pr-8">
            {productDetails?.name || "Product Details"}
          </DialogTitle>
        </DialogHeader>

        {initialLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-900 font-medium">{error}</p>
          </div>
        ) : !productDetails ? (
          <div className="text-center py-12">
            <p className="text-gray-700 font-medium">Product not found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Left - Product Image */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-300">
                <Image
                  src={imgSrc}
                  alt={productDetails.name}
                  fill
                  className="object-contain p-4"
                  onError={(e) => {
                    e.target.src = "/product-placeholder.jpg";
                  }}
                />
                {productDetails.hasSale && (
                  <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-md shadow-md">
                    SALE
                  </div>
                )}
              </div>

              {/* Additional Images */}
              {productDetails.variants &&
                productDetails.variants.some((v) => v.images?.length > 1) && (
                  <div className="flex gap-2 overflow-x-auto">
                    {productDetails.variants
                      .filter((v) => v.images?.length > 0)
                      .slice(0, 1)[0]
                      ?.images?.slice(0, 4)
                      .map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setImgSrc(normalizeImageUrl(img.url))}
                          className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg border-2 border-gray-300 overflow-hidden hover:border-red-500 transition-colors"
                        >
                          <Image
                            src={normalizeImageUrl(img.url)}
                            alt={`Product ${idx + 1}`}
                            width={80}
                            height={80}
                            className="w-full h-full object-contain p-1"
                            onError={(e) => {
                              e.target.src = "/product-placeholder.jpg";
                            }}
                          />
                        </button>
                      ))}
                  </div>
                )}
            </div>

            {/* Right - Product Details */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {productDetails.name}
                </h2>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4"
                        fill={
                          i < Math.round(productDetails.avgRating || 0)
                            ? "#ef4444"
                            : "none"
                        }
                        stroke="#ef4444"
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-700 font-medium">
                      ({productDetails.reviewCount || 0} reviews)
                    </span>
                  </div>
                </div>

                <div className="flex items-baseline space-x-3 mb-4">
                  {getPriceDisplay()}
                </div>
              </div>

              {/* Product Description */}
              {productDetails.shortDescription && (
                <div className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
                  <p className="text-gray-800 leading-relaxed font-medium">
                    {productDetails.shortDescription}
                  </p>
                </div>
              )}

              {/* Flavor Selection */}
              {productDetails.flavorOptions?.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    Available Flavors
                    {selectedFlavor && (
                      <span className="ml-2 text-red-600 font-black">
                        ({selectedFlavor.name})
                      </span>
                    )}
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {productDetails.flavorOptions.map((flavor) => {
                      const isAvailable =
                        getAvailableWeightsForFlavor(flavor.id).length > 0;
                      return (
                        <button
                          key={flavor.id}
                          onClick={() =>
                            isAvailable && handleFlavorChange(flavor)
                          }
                          disabled={!isAvailable}
                          className={`px-4 py-2 text-sm font-bold border-2 rounded-lg transition-all duration-200 ${
                            selectedFlavor?.id === flavor.id
                              ? "border-red-600 bg-red-600 text-white shadow-lg"
                              : isAvailable
                              ? "border-gray-400 bg-white text-gray-800 hover:border-red-500 hover:text-red-600 hover:bg-red-50"
                              : "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          {flavor.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Weight Selection */}
              {productDetails.weightOptions?.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    Available Weights
                    {selectedWeight && (
                      <span className="ml-2 text-red-600 font-black">
                        (
                        {selectedWeight.display ||
                          `${selectedWeight.value}${selectedWeight.unit}`}
                        )
                      </span>
                    )}
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {productDetails.weightOptions
                      .filter((weight) => {
                        if (!selectedFlavor) return true;
                        return availableCombinations.some(
                          (combo) =>
                            combo.flavorId === selectedFlavor.id &&
                            combo.weightId === weight.id &&
                            combo.variant.quantity > 0
                        );
                      })
                      .map((weight) => {
                        const isAvailable = selectedFlavor
                          ? availableCombinations.some(
                              (combo) =>
                                combo.flavorId === selectedFlavor.id &&
                                combo.weightId === weight.id &&
                                combo.variant.quantity > 0
                            )
                          : availableCombinations.some(
                              (combo) =>
                                combo.weightId === weight.id &&
                                combo.variant.quantity > 0
                            );
                        return (
                          <button
                            key={weight.id}
                            onClick={() =>
                              isAvailable && handleWeightChange(weight)
                            }
                            disabled={!isAvailable}
                            className={`px-4 py-2 text-sm font-bold border-2 rounded-lg transition-all duration-200 ${
                              selectedWeight?.id === weight.id
                                ? "border-red-600 bg-red-600 text-white shadow-lg"
                                : isAvailable
                                ? "border-gray-400 bg-white text-gray-800 hover:border-red-500 hover:text-red-600 hover:bg-red-50"
                                : "border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
                            }`}
                          >
                            {weight.display || `${weight.value}${weight.unit}`}
                          </button>
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Stock Information */}
              {selectedVariant && (
                <div className="bg-gray-100 border-2 border-gray-300 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Stock Information
                  </h3>
                  <div className="text-sm text-gray-700 font-medium">
                    <span className="font-bold">Available:</span>{" "}
                    <span className="text-green-600 font-bold">
                      {selectedVariant.quantity} in stock
                    </span>
                  </div>
                </div>
              )}

              {/* Product Features */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-green-50 border-2 border-green-200 rounded-lg">
                  <Shield className="h-6 w-6 text-green-600 mx-auto mb-1" />
                  <div className="text-xs font-bold text-green-800">
                    100% Authentic
                  </div>
                </div>
                <div className="text-center p-3 bg-blue-50 border-2 border-blue-200 rounded-lg">
                  <Zap className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                  <div className="text-xs font-bold text-blue-800">
                    Fast Delivery
                  </div>
                </div>
                <div className="text-center p-3 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                  <Award className="h-6 w-6 text-yellow-600 mx-auto mb-1" />
                  <div className="text-xs font-bold text-yellow-800">
                    Trusted Brand
                  </div>
                </div>
              </div>

              {/* View Full Details Link */}
              <div className="pt-4 border-t-2 border-gray-200">
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-bold rounded-lg py-3 text-base transition-all duration-200"
                >
                  <Link href={`/products/${productDetails.slug}`}>
                    View Full Details & Purchase
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

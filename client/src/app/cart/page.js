"use client";

import React, { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Loader2,
  Tag,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

const CartItem = React.memo(
  ({ item, onUpdateQuantity, onRemove, isLoading }) => {
    return (
      <div className="grid grid-cols-[100px_1fr_auto] items-start gap-6 py-6 border-b border-gray-100">
        <div className="relative h-28 w-28 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
          <Image
            src={item.product.image || "/placeholder.svg"}
            alt={item.product.name}
            fill
            className="object-contain p-2"
          />
        </div>
        <div className="flex flex-col h-full">
          <Link
            href={`/products/${item.product.slug}`}
            className="font-bold text-lg text-gray-800 hover:text-red-600 transition-colors line-clamp-2"
          >
            {item.product.name}
          </Link>
          <div className="text-sm text-gray-500 mt-1 flex items-center space-x-2">
            {item.variant.flavor && <span>{item.variant.flavor.name}</span>}
            {item.variant.flavor && item.variant.weight && <span>•</span>}
            {item.variant.weight && (
              <span>
                {item.variant.weight.value}
                {item.variant.weight.unit}
              </span>
            )}
          </div>
          <div className="font-extrabold text-red-600 text-lg mt-auto">
            {formatCurrency(item.price)}
          </div>
        </div>
        <div className="flex flex-col items-end justify-between h-full">
          <div className="flex items-center bg-white rounded-full border-2 border-gray-200">
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity, -1)}
              className="p-2 hover:bg-gray-100 disabled:opacity-50 rounded-l-full transition-colors"
              disabled={isLoading || item.quantity <= 1}
            >
              <Minus className="h-4 w-4 text-gray-600" />
            </button>
            <span className="px-4 py-1.5 min-w-[3rem] text-center font-bold text-lg text-gray-800">
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin inline text-gray-500" />
              ) : (
                item.quantity
              )}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity, 1)}
              className="p-2 hover:bg-gray-100 disabled:opacity-50 rounded-r-full transition-colors"
              disabled={isLoading}
            >
              <Plus className="h-4 w-4 text-gray-600" />
            </button>
          </div>
          <button
            onClick={() => onRemove(item.id)}
            className="text-gray-500 hover:text-red-600 text-sm font-medium flex items-center gap-1.5 transition-colors"
            aria-label="Remove item"
            disabled={isLoading}
          >
            <Trash2 className="h-4 w-4" />
            Remove
          </button>
        </div>
      </div>
    );
  }
);
CartItem.displayName = "CartItem";

export default function CartPage() {
  const {
    cart,
    loading,
    cartItemsLoading,
    error,
    removeFromCart,
    updateCartItem,
    clearCart,
    applyCoupon,
    removeCoupon,
    coupon,
    couponLoading,
    getCartTotals,
  } = useCart();
  const { isAuthenticated } = useAuth();
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const router = useRouter();

  const handleQuantityChange = useCallback(
    async (cartItemId, currentQuantity, change) => {
      const newQuantity = currentQuantity + change;
      if (newQuantity < 1) return;

      try {
        await updateCartItem(cartItemId, newQuantity);
        toast.success("Cart updated successfully");
      } catch (err) {
        console.error("Error updating quantity:", err);
        toast.error(err.message || "Failed to update cart");
      }
    },
    [updateCartItem]
  );

  const handleRemoveItem = useCallback(
    async (cartItemId) => {
      try {
        await removeFromCart(cartItemId);
        toast.success("Item removed from cart");
      } catch (err) {
        console.error("Error removing item:", err);
        toast.error(err.message || "Failed to remove item");
      }
    },
    [removeFromCart]
  );

  const handleClearCart = useCallback(async () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      try {
        await clearCart();
        toast.success("Cart has been cleared");
      } catch (err) {
        console.error("Error clearing cart:", err);
        toast.error("Failed to clear cart");
      }
    }
  }, [clearCart]);

  const handleApplyCoupon = useCallback(
    async (e) => {
      e.preventDefault();

      if (!couponCode.trim()) {
        setCouponError("Please enter a coupon code");
        return;
      }

      setCouponError("");

      try {
        await applyCoupon(couponCode);
        setCouponCode("");
        toast.success("Coupon applied successfully");
      } catch (err) {
        setCouponError(err.message || "Invalid coupon code");
        toast.error(err.message || "Invalid coupon code");
      }
    },
    [couponCode, applyCoupon]
  );

  const handleRemoveCoupon = useCallback(() => {
    removeCoupon();
    setCouponCode("");
    setCouponError("");
    toast.success("Coupon removed");
  }, [removeCoupon]);

  const totals = useMemo(() => getCartTotals(), [cart, coupon]);

  const handleCheckout = useCallback(() => {
    if (totals.total < 1) {
      toast.info("Minimum order amount is ₹1");
      return;
    }

    if (!isAuthenticated) {
      router.push("/login?redirect=checkout");
    } else {
      router.push("/checkout");
    }
  }, [isAuthenticated, router, totals]);

  if (loading && !cart?.items?.length) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-2xl font-semibold text-gray-700">
            Loading Your Cart...
          </h1>
        </div>
      </div>
    );
  }

  if ((!cart?.items || cart.items.length === 0) && !loading && !error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-full w-28 h-28 flex items-center justify-center mx-auto mb-8 shadow-lg shadow-red-500/20">
            <ShoppingBag className="h-14 w-14 text-white" />
          </div>
          <h1 className="text-4xl font-black text-gray-800 mb-4">
            Your Cart is Empty
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            Looks like you haven&apos;t added anything to your cart yet.
          </p>
          <Button
            asChild
            size="lg"
            className="w-full text-lg font-bold  rounded-xl py-6 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-red-500/30 transition-all"
          >
            <Link
              href="/products"
              className="flex items-center justify-center text-white hover:text-white"
            >
              Start Shopping
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
            Shopping Cart
          </h1>
          {cart?.items?.length > 0 && (
            <button
              onClick={handleClearCart}
              className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              Clear Cart
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 flex items-center shadow-sm">
            <AlertCircle className="h-5 w-5 mr-3" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12 items-start">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-800 border-b border-gray-100 pb-4 mb-2">
              {cart?.items?.length || 0} items
            </h2>
            {cart?.items?.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={handleQuantityChange}
                onRemove={handleRemoveItem}
                isLoading={cartItemsLoading[item.id]}
              />
            ))}
          </div>

          <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-8 sticky top-28">
            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-4 mb-6">
              Order Summary
            </h2>
            <div className="space-y-4 text-base">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold text-gray-800">
                  {formatCurrency(totals.subtotal)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Discount</span>
                <span className="font-semibold text-green-600">
                  - {formatCurrency(totals.discount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold text-gray-800">
                  {totals.shipping > 0
                    ? formatCurrency(totals.shipping)
                    : "FREE"}
                </span>
              </div>
              <div className="border-t-2 border-dashed border-gray-200 my-4"></div>
              <div className="flex justify-between font-bold text-xl">
                <span>Total</span>
                <span>{formatCurrency(totals.total)}</span>
              </div>
            </div>

            <div className="mt-8">
              {!coupon ? (
                <form onSubmit={handleApplyCoupon} className="space-y-3">
                  <label
                    htmlFor="coupon"
                    className="text-sm font-semibold text-gray-700 flex items-center gap-2"
                  >
                    <Tag className="w-5 h-5 text-gray-400" /> Apply Coupon
                  </label>
                  <div className="flex gap-2">
                    <Input
                      id="coupon"
                      placeholder="Enter Coupon Code"
                      value={couponCode}
                      onChange={(e) =>
                        setCouponCode(e.target.value.toUpperCase())
                      }
                      className="flex-grow text-base rounded-lg"
                      disabled={couponLoading}
                    />
                    <Button
                      type="submit"
                      className="whitespace-nowrap bg-gray-800 hover:bg-gray-900 rounded-lg"
                      disabled={couponLoading}
                    >
                      {couponLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        "Apply"
                      )}
                    </Button>
                  </div>
                  {couponError && (
                    <p className="text-red-500 text-sm mt-1">{couponError}</p>
                  )}
                </form>
              ) : (
                <div className="bg-green-50 border-2 border-dashed border-green-200 p-4 rounded-lg text-center">
                  <p className="font-bold text-lg text-green-700">
                    Coupon &quot;{coupon.code}&quot; applied!
                  </p>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-sm font-medium text-green-600 hover:underline mt-1"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            <Button
              onClick={handleCheckout}
              size="lg"
              className="w-full mt-8 text-lg font-bold rounded-xl py-6 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-red-500/30 transition-all"
              disabled={
                loading ||
                couponLoading ||
                !cart?.items ||
                cart.items.length === 0
              }
            >
              <CreditCard className="mr-3 h-6 w-6" />
              Proceed to Checkout
            </Button>

            <div className="flex items-center justify-center mt-6 gap-2 text-gray-500">
              <ShieldCheck className="h-5 w-5" />
              <span className="text-sm font-medium">100% Secure Payments</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

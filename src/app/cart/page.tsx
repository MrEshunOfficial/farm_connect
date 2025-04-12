"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/hooks/useCartHook";

export default function CartPage() {
  const {
    items,
    isLoading,
    error,
    totalItems,
    totalAmount,
    isEmpty,
    updateQuantity,
    removeItem,
    clear,
  } = useCart();

  const formatCurrency = (amount: number, currency: string = "GHS") => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency,
    }).format(amount);
  };

  if (isLoading) {
    return <CartLoadingState />;
  }

  if (isEmpty) {
    return <EmptyCartState />;
  }

  if (error) {
    return <ErrorState errorMessage={error} />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl transition-colors duration-200">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Your Cart ({totalItems} items)
        </h1>
        <button
          onClick={clear}
          className="text-red-600 dark:text-red-400 flex items-center gap-1 hover:text-red-800 dark:hover:text-red-300 transition-colors duration-200"
        >
          <Trash2 size={18} />
          <span>Clear Cart</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items Section */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/30 overflow-hidden transition-colors duration-200">
            <div className="p-6 divide-y divide-gray-200 dark:divide-gray-700">
              {items.map((item) => (
                <CartItem
                  key={item._id}
                  item={item}
                  updateQuantity={updateQuantity}
                  removeItem={removeItem}
                  formatCurrency={formatCurrency}
                />
              ))}
            </div>
          </div>

          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
            >
              <ArrowLeft size={18} className="mr-2" />
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary Section */}
        <div className="lg:col-span-1">
          <OrderSummary
            totalItems={totalItems}
            totalAmount={totalAmount}
            formatCurrency={formatCurrency}
          />
        </div>
      </div>
    </div>
  );
}

// Individual Cart Item Component
interface CartItemProps {
  item: {
    _id: string;
    title?: string;
    imageUrl?: string;
    quantity: number;
    price: number;
    currency?: string;
    unit?: string;
  };
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  formatCurrency: (amount: number, currency?: string) => string;
}

function CartItem({
  item,
  updateQuantity,
  removeItem,
  formatCurrency,
}: CartItemProps) {
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(item._id, newQuantity);
    }
  };

  return (
    <div className="py-6 first:pt-0 last:pb-0 flex items-center transition-colors duration-200">
      {/* Product Image */}
      <div className="w-20 h-20 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-md overflow-hidden transition-colors duration-200">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.title || "Product"}
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-600 transition-colors duration-200">
            <ShoppingBag
              size={24}
              className="text-gray-400 dark:text-gray-300"
            />
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="ml-4 flex-1">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 transition-colors duration-200">
          {item.title || "Product Item"}
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
          {formatCurrency(item.price, item.currency)}
          {item.unit && ` / ${item.unit}`}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md ml-4 transition-colors duration-200">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          disabled={item.quantity <= 1}
          className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent transition-colors duration-200"
          aria-label="Decrease quantity"
        >
          <Minus size={16} />
        </button>
        <span className="px-2 py-1 min-w-[40px] text-center text-gray-800 dark:text-gray-200 transition-colors duration-200">
          {item.quantity}
        </span>
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          aria-label="Increase quantity"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Item Total */}
      <div className="ml-4 text-right">
        <p className="text-base font-medium text-gray-900 dark:text-gray-100 transition-colors duration-200">
          {formatCurrency(item.price * item.quantity, item.currency)}
        </p>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => removeItem(item._id)}
        className="ml-4 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-full transition-colors duration-200"
        aria-label="Remove item"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
}

// Order Summary Component
interface OrderSummaryProps {
  totalItems: number;
  totalAmount: number;
  formatCurrency: (amount: number, currency?: string) => string;
}

function OrderSummary({
  totalItems,
  totalAmount,
  formatCurrency,
}: OrderSummaryProps) {
  // Sample shipping cost calculation (replace with actual logic)
  const shippingCost = totalAmount > 0 ? 10 : 0;
  const tax = totalAmount * 0.05; // 5% tax (example)
  const finalTotal = totalAmount + shippingCost + tax;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/30 p-6 sticky top-6 transition-colors duration-200">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        Order Summary
      </h2>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400 transition-colors duration-200">
            Subtotal ({totalItems} items)
          </span>
          <span className="font-medium text-gray-800 dark:text-gray-200 transition-colors duration-200">
            {formatCurrency(totalAmount)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400 transition-colors duration-200">
            Shipping Estimate
          </span>
          <span className="font-medium text-gray-800 dark:text-gray-200 transition-colors duration-200">
            {formatCurrency(shippingCost)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400 transition-colors duration-200">
            Tax Estimate
          </span>
          <span className="font-medium text-gray-800 dark:text-gray-200 transition-colors duration-200">
            {formatCurrency(tax)}
          </span>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between transition-colors duration-200">
          <span className="font-semibold text-gray-900 dark:text-white transition-colors duration-200">
            Order Total
          </span>
          <span className="font-bold text-lg text-gray-900 dark:text-white transition-colors duration-200">
            {formatCurrency(finalTotal)}
          </span>
        </div>
      </div>

      <button className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-3 px-4 rounded-md transition-colors duration-200 font-medium">
        Proceed to Checkout
      </button>

      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
        <p>Secure checkout powered by our trusted payment providers</p>
      </div>
    </div>
  );
}

// Loading State Component
function CartLoadingState() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mx-auto mb-8 transition-colors duration-200"></div>
        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg max-w-4xl mx-auto transition-colors duration-200"></div>
      </div>
      <p className="mt-4 text-gray-500 dark:text-gray-400 transition-colors duration-200">
        Loading your cart...
      </p>
    </div>
  );
}

// Empty Cart State Component
function EmptyCartState() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="mb-6 flex justify-center">
        <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-700 transition-colors duration-200">
          <ShoppingBag
            size={64}
            className="text-gray-400 dark:text-gray-300 transition-colors duration-200"
          />
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        Your cart is empty
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8 transition-colors duration-200">
        Looks like you haven&apos;t added any items to your cart yet.
      </p>
      <Link
        href="/"
        className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-2 px-6 rounded-md transition-colors duration-200 inline-flex items-center"
      >
        <ArrowLeft size={18} className="mr-2" />
        Browse Products
      </Link>
    </div>
  );
}

// Error State Component
function ErrorState({ errorMessage }: { errorMessage: string }) {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="mb-6 text-red-500 dark:text-red-400 flex justify-center transition-colors duration-200">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        Something went wrong
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4 transition-colors duration-200">
        {errorMessage}
      </p>
      <button
        onClick={() => window.location.reload()}
        className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-2 px-6 rounded-md transition-colors duration-200"
      >
        Try Again
      </button>
    </div>
  );
}

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../store';

import {
  fetchCart, 
  addToCart, 
  AddCartItemRequest, 
  UpdateCartItemRequest,
  updateCartItem,
  removeCartItem,
  clearCart,
  updateQuantityLocally,
  selectCartItems,
  selectCartStatus,
  selectCartError,
  selectCartTotalItems,
  selectCartTotalAmount,
  selectIsCartEmpty,
  CartItem,
} from '@/store/cart.slice';

export const useCart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector(selectCartItems);
  const status = useSelector(selectCartStatus);
  const error = useSelector(selectCartError);
  const totalItems = useSelector(selectCartTotalItems);
  const totalAmount = useSelector(selectCartTotalAmount);
  const isEmpty = useSelector(selectIsCartEmpty);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCart());
    }
  }, [dispatch, status]);

  // Add an item to the cart
  const addItem = (item: AddCartItemRequest) => {
    return dispatch(addToCart(item));
  };

  // Update a cart item
  const updateItem = (updateData: UpdateCartItemRequest) => {
    return dispatch(updateCartItem(updateData));
  };

  // Update quantity locally and in API
  const updateQuantity = (id: string, quantity: number) => {
    // First, update locally to immediately reflect in UI
    dispatch(updateQuantityLocally({ id: id, quantity }));
    // Then, update via API
    return dispatch(updateCartItem({ id, quantity }));
  };

  // Remove an item from the cart
  const removeItem = (id: string) => {
    return dispatch(removeCartItem(id));
  };

  // Clear the entire cart
  const clear = () => {
    return dispatch(clearCart());
  };

  // Find a specific item in the cart by product ID
  const findItem = (productId: string): CartItem | undefined => {
    return items.find(item => item.id === productId);
  };

  // Check if a product is in the cart
  const isInCart = (productId: string): boolean => {
    return items.some(item => item.id === productId);
  };

  // Get the quantity of a specific product in the cart
  const getItemQuantity = (productId: string): number => {
    const item = items.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  // Find cart item ID by product ID
  const findCartItemId = (productId: string): string | undefined => {
    const item = items.find(item => item.id === productId);
    return item ? item._id : undefined;
  };

  return {
    // State
    items,
    status,
    error,
    totalItems,
    totalAmount,
    isEmpty,
    isLoading: status === 'loading',
    
    // Actions
    fetchCart: () => dispatch(fetchCart()),
    addItem,
    updateItem,
    updateQuantity,
    removeItem,
    clear,
    
    // Helpers
    findItem,
    isInCart,
    getItemQuantity,
    findCartItemId
  };
};
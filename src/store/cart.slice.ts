import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Define types
export interface CartItem {
  _id: string;
  userId: string;
  id: string;
  type: string;
  quantity: number;
  price: number;
  title?: string;
  imageUrl?: string;
  currency?: string;
  unit?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AddCartItemRequest {
  id: string;
  type: string;
  quantity: number;
  price: number;
  title?: string;
  imageUrl?: string;
  currency?: string;
  unit?: string;
}

export interface UpdateCartItemRequest {
  id: string;
  quantity?: number;
  price?: number;
  title?: string;
  imageUrl?: string;
  currency?: string;
  unit?: string;
}

interface CartState {
  items: CartItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  totalItems: number;
  totalAmount: number;
}

// Initial state
const initialState: CartState = {
  items: [],
  status: 'idle',
  error: null,
  totalItems: 0,
  totalAmount: 0
};

// Helper function to calculate cart totals
const calculateCartTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  return { totalItems, totalAmount };
};

// Async thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/catApi');
      
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to fetch cart items');
      }
      
      const data = await response.json();
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch cart items');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (item: AddCartItemRequest, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/catApi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to add item to cart');
      }
      
      const data = await response.json();
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add item to cart');
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async (updateData: UpdateCartItemRequest, { rejectWithValue }) => {
    const { id, ...itemData } = updateData;
    
    try {
      const response = await fetch(`/api/catApi/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to update cart item');
      }
      
      const data = await response.json();
      return { ...data.data, id }; // Return with the original itemId to ensure we can match locally
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update cart item');
    }
  }
);

export const removeCartItem = createAsyncThunk(
  'cart/removeCartItem',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/catApi/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to remove item from cart');
      }
      
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to remove item from cart');
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/catApi/clear', {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to clear cart');
      }
      
      return true;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to clear cart');
    }
  }
);

// Create slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Local reducers for handling changes before API calls
    updateQuantityLocally(state, action: PayloadAction<{ id: string; quantity: number }>) {
      const { id, quantity } = action.payload;
      const itemIndex = state.items.findIndex(item => item._id === id);
      
      if (itemIndex !== -1) {
        state.items[itemIndex].quantity = quantity;
        const { totalItems, totalAmount } = calculateCartTotals(state.items);
        state.totalItems = totalItems;
        state.totalAmount = totalAmount;
      }
    },
    resetCartState(state) {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCart.fulfilled, (state, action: PayloadAction<CartItem[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
        const { totalItems, totalAmount } = calculateCartTotals(action.payload);
        state.totalItems = totalItems;
        state.totalAmount = totalAmount;
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addToCart.fulfilled, (state, action: PayloadAction<CartItem>) => {
        state.status = 'succeeded';
        
        // Check if item already exists (due to quantity update)
        const existingItemIndex = state.items.findIndex(item => item._id === action.payload._id);
        
        if (existingItemIndex !== -1) {
          // Update existing item
          state.items[existingItemIndex] = action.payload;
        } else {
          // Add new item
          state.items.push(action.payload);
        }
        
        const { totalItems, totalAmount } = calculateCartTotals(state.items);
        state.totalItems = totalItems;
        state.totalAmount = totalAmount;
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Update cart item
      .addCase(updateCartItem.pending, (state) => {
        // Don't set loading state here to prevent flicker
        // state.status = 'loading';
      })
      .addCase(updateCartItem.fulfilled, (state, action: PayloadAction<CartItem>) => {
        state.status = 'succeeded';
        const index = state.items.findIndex(item => item._id === action.payload._id);
        
        if (index !== -1) {
          state.items[index] = action.payload;
          const { totalItems, totalAmount } = calculateCartTotals(state.items);
          state.totalItems = totalItems;
          state.totalAmount = totalAmount;
        }
        
        state.error = null;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Remove cart item
      .addCase(removeCartItem.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(removeCartItem.fulfilled, (state, action: PayloadAction<string>) => {
        state.status = 'succeeded';
        state.items = state.items.filter(item => item._id !== action.payload);
        const { totalItems, totalAmount } = calculateCartTotals(state.items);
        state.totalItems = totalItems;
        state.totalAmount = totalAmount;
        state.error = null;
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Clear cart
      .addCase(clearCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.status = 'succeeded';
        state.items = [];
        state.totalItems = 0;
        state.totalAmount = 0;
        state.error = null;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const { updateQuantityLocally, resetCartState } = cartSlice.actions;

// Export selectors
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartStatus = (state: RootState) => state.cart.status;
export const selectCartError = (state: RootState) => state.cart.error;
export const selectCartTotalItems = (state: RootState) => state.cart.totalItems;
export const selectCartTotalAmount = (state: RootState) => state.cart.totalAmount;
export const selectIsCartEmpty = (state: RootState) => state.cart.items.length === 0;

// Export reducer
export default cartSlice.reducer;
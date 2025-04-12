// src/redux/features/wishlist/wishlistSlice.ts
import { IWishlist, IWishlistItem, WishlistItemType, AddToWishlistRequest } from '@/models/profileI-interfaces';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { WritableDraft } from 'immer';

// Define the state type
interface WishlistState {
  wishlist: IWishlist | null;
  wishlistItems: IWishlistItem[];
  loading: boolean;
  error: string | null;
  summary: {
    totalItems: number;
    farmProducts: number;
    storeProducts: number;
  };
}

// Define initial state
const initialState: WishlistState = {
  wishlist: null,
  wishlistItems: [],
  loading: false,
  error: null,
  summary: {
    totalItems: 0,
    farmProducts: 0,
    storeProducts: 0,
  },
};

// Local storage keys
const GUEST_WISHLIST_KEY = 'guestWishlist';

// Helper functions for guest wishlist
const getGuestWishlist = (): IWishlistItem[] => {
  if (typeof window === 'undefined') return [];
  
  const storedWishlist = localStorage.getItem(GUEST_WISHLIST_KEY);
  return storedWishlist ? JSON.parse(storedWishlist) : [];
};

const saveGuestWishlist = (wishlistItems: IWishlistItem[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(GUEST_WISHLIST_KEY, JSON.stringify(wishlistItems));
  }
};

const calculateGuestSummary = (items: IWishlistItem[]) => {
  return {
    totalItems: items.length,
    farmProducts: items.filter(item => item.itemType === WishlistItemType.FarmProduct).length,
    storeProducts: items.filter(item => item.itemType === WishlistItemType.StoreProduct).length,
  };
};

// Async thunks for authenticated users
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/wishlist');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlist');
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (item: AddToWishlistRequest, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/wishlist', item);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add item to wishlist');
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (itemId: string, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/api/wishlist/${itemId}`);
      return { ...response.data, itemId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove item from wishlist');
    }
  }
);

export const clearWishlist = createAsyncThunk(
  'wishlist/clearWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.delete('/api/wishlist');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to clear wishlist');
    }
  }
);

export const updateWishlistItem = createAsyncThunk(
  'wishlist/updateWishlistItem',
  async ({ itemId, updates }: { itemId: string; updates: Partial<IWishlistItem> }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/wishlist/${itemId}`, updates);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update wishlist item');
    }
  }
);

// Create wishlist slice
const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    // For guest users
    initGuestWishlist: (state) => {
      const guestItems = getGuestWishlist();
      state.wishlistItems = guestItems.map(item => ({ ...item })) as WritableDraft<IWishlistItem>[];
      state.summary = calculateGuestSummary(guestItems);
    },
    
    addToGuestWishlist: (state, action: PayloadAction<IWishlistItem>) => {
      // Check if item already exists
      const existingItem = state.wishlistItems.find(
        item => item.itemId.toString() === action.payload.itemId.toString() &&
               item.itemType === action.payload.itemType
      );
      
      if (!existingItem) {
        // Add temporary ID for guest items
        const newItem = {
          ...action.payload,
          _id: `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          addedAt: new Date()
        };
        
        state.wishlistItems.push(newItem as unknown as WritableDraft<IWishlistItem>);
        saveGuestWishlist(state.wishlistItems);
        state.summary = calculateGuestSummary(state.wishlistItems);
      }
    },
    
    removeFromGuestWishlist: (state, action: PayloadAction<string>) => {
      state.wishlistItems = state.wishlistItems.filter(item => item._id.toString() !== action.payload);
      saveGuestWishlist(state.wishlistItems);
      state.summary = calculateGuestSummary(state.wishlistItems);
    },
    
    clearGuestWishlist: (state) => {
      state.wishlistItems = [];
      saveGuestWishlist([]);
      state.summary = calculateGuestSummary([]);
    },
    
    updateGuestWishlistItem: (state, action: PayloadAction<{ itemId: string; updates: Partial<IWishlistItem> }>) => {
      const { itemId, updates } = action.payload;
      state.wishlistItems = state.wishlistItems.map(item => 
        item._id.toString() === itemId ? { ...item, ...updates } as WritableDraft<IWishlistItem> : item
      );
      saveGuestWishlist(state.wishlistItems as IWishlistItem[]);
    },
    
    // For migrating guest wishlist to user wishlist after login
    mergeGuestWishlistToUser: (state) => {
      // This action will be handled in an effect, not directly in the reducer
      // Just mark that we need to migrate
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch wishlist
    builder.addCase(fetchWishlist.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchWishlist.fulfilled, (state, action) => {
      state.loading = false;
      state.wishlist = action.payload.data;
      state.wishlistItems = action.payload.data.items || [];
      state.summary = action.payload.summary || {
        totalItems: state.wishlistItems.length,
        farmProducts: 0,
        storeProducts: 0,
      };
    });
    builder.addCase(fetchWishlist.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    // Add to wishlist
    builder.addCase(addToWishlist.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addToWishlist.fulfilled, (state, action) => {
      state.loading = false;
      state.wishlist = action.payload.data;
      state.wishlistItems = action.payload.data.items || [];
      state.summary = action.payload.summary || {
        totalItems: state.wishlistItems.length,
        farmProducts: 0,
        storeProducts: 0,
      };
    });
    builder.addCase(addToWishlist.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    // Remove from wishlist
    builder.addCase(removeFromWishlist.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(removeFromWishlist.fulfilled, (state, action) => {
      state.loading = false;
      // Remove item from local state
      state.wishlistItems = state.wishlistItems.filter(
        item => item._id.toString() !== action.meta.arg
      );
      // Recalculate summary
      if (state.wishlist) {
        state.summary = {
          totalItems: state.wishlistItems.length,
          farmProducts: state.wishlistItems.filter(item => item.itemType === WishlistItemType.FarmProduct).length,
          storeProducts: state.wishlistItems.filter(item => item.itemType === WishlistItemType.StoreProduct).length,
        };
      }
    });
    builder.addCase(removeFromWishlist.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    // Clear wishlist
    builder.addCase(clearWishlist.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(clearWishlist.fulfilled, (state) => {
      state.loading = false;
      state.wishlistItems = [];
      state.summary = {
        totalItems: 0,
        farmProducts: 0,
        storeProducts: 0,
      };
    });
    builder.addCase(clearWishlist.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    // Update wishlist item
    builder.addCase(updateWishlistItem.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateWishlistItem.fulfilled, (state, action) => {
      state.loading = false;
      // Update the item in the local state
      const updatedItem = action.payload.data;
      state.wishlistItems = state.wishlistItems.map(item => 
        item._id.toString() === updatedItem._id.toString() ? updatedItem : item
      );
    });
    builder.addCase(updateWishlistItem.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

// Export actions and reducer
export const {
  initGuestWishlist,
  addToGuestWishlist,
  removeFromGuestWishlist,
  clearGuestWishlist,
  updateGuestWishlistItem,
  mergeGuestWishlistToUser,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;

function produce<T>(baseState: T, recipe: (draft: WritableDraft<T>) => void): T {
  return produce(baseState, recipe);
}

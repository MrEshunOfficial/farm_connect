import { IReview } from '@/models/profileI-interfaces';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Define the pagination metadata structure
interface PaginationMeta {
  page: number;
  limit: number;
  totalDocs: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// Define the state structure
interface ReviewState {
  reviews: IReview[];
  currentReview: IReview | null;
  pagination: PaginationMeta;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: ReviewState = {
  reviews: [],
  currentReview: null,
  pagination: {
    page: 1,
    limit: 10,
    totalDocs: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  },
  isLoading: false,
  error: null
};

// Async thunks
export const fetchMyReviews = createAsyncThunk(
  'reviews/fetchMyReviews',
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/review/me?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch reviews');
    }
  }
);

export const fetchUserReviews = createAsyncThunk(
  'reviews/fetchUserReviews',
  async ({ 
    userId, 
    page = 1, 
    limit = 10 
  }: { 
    userId: string; 
    page?: number; 
    limit?: number 
  }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/review/user/${userId}?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch user reviews');
    }
  }
);

export const fetchReviewById = createAsyncThunk(
  'reviews/fetchReviewById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/review/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch review');
    }
  }
);

export const createReview = createAsyncThunk(
  'reviews/createReview',
  async (reviewData: {
    recipientId: string;
    rating: number;
    content: string;
    role: string;
  }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/review/me', reviewData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create review');
    }
  }
);

export const updateReview = createAsyncThunk(
  'reviews/updateReview',
  async ({ 
    id, 
    reviewData 
  }: { 
    id: string; 
    reviewData: { rating?: number; content?: string } 
  }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/api/review/${id}`, reviewData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update review');
    }
  }
);

export const deleteReview = createAsyncThunk(
  'reviews/deleteReview',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/review/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete review');
    }
  }
);

export const markReviewAsHelpful = createAsyncThunk(
  'reviews/markReviewAsHelpful',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/api/review/${id}/helpful`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to mark review as helpful');
    }
  }
);

// Create the review slice
const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    clearReviewError: (state) => {
      state.error = null;
    },
    resetReviewState: () => initialState,
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch my reviews
      .addCase(fetchMyReviews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchMyReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch review by ID
      .addCase(fetchReviewById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReviewById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentReview = action.payload.data;
      })
      .addCase(fetchReviewById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Create review
      .addCase(createReview.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = [action.payload.data, ...state.reviews];
        state.pagination.totalDocs += 1;
        state.pagination.totalPages = Math.ceil(state.pagination.totalDocs / state.pagination.limit);
        state.currentReview = action.payload.data;
      })
      .addCase(createReview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Update review
      .addCase(updateReview.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = state.reviews.map(review => 
          review._id.toString() === action.payload.data._id.toString() 
            ? action.payload.data 
            : review
        );
        state.currentReview = action.payload.data;
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Delete review
      .addCase(deleteReview.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = state.reviews.filter(review => 
          review._id.toString() !== action.payload.toString()
        );
        state.pagination.totalDocs -= 1;
        state.pagination.totalPages = Math.ceil(state.pagination.totalDocs / state.pagination.limit);
        if (state.currentReview && state.currentReview._id.toString() === action.payload.toString()) {
          state.currentReview = null;
        }
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Mark review as helpful
      .addCase(markReviewAsHelpful.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(markReviewAsHelpful.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedReview = action.payload.data;
        
        // Update in reviews array if present
        state.reviews = state.reviews.map(review => 
          review._id.toString() === updatedReview._id.toString() 
            ? updatedReview 
            : review
        );
        
        // Update current review if it's the same one
        if (state.currentReview && state.currentReview._id.toString() === updatedReview._id.toString()) {
          state.currentReview = updatedReview;
        }
      })
      .addCase(markReviewAsHelpful.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Add these cases to your extraReducers builder
      .addCase(fetchUserReviews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchUserReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions and reducer
export const { clearReviewError, resetReviewState, setCurrentPage } = reviewSlice.actions;
export default reviewSlice.reducer;

// Add this to your review slice or in a selectors file
export const selectAverageRating = (reviews: IReview[]): number => {
  if (!reviews || reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return parseFloat((sum / reviews.length).toFixed(1));
};
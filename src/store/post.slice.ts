import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { produce, WritableDraft } from 'immer';
import { IFarmPostDocument, IStorePostDocument } from '@/models/profileI-interfaces';

// State interface
interface PostsState {
  farmPosts: IFarmPostDocument[];
  storePosts: IStorePostDocument[];
  currentFarmPost: IFarmPostDocument | null;
  currentStorePost: IStorePostDocument | null;
  loading: boolean;
  error: string | null;
  pagination: PaginationParams | null;
}

interface PaginationParams {
  page: number;
  limit: number;
  totalDocs: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalPages: number;
}

interface PostsResponse {
  success: boolean;
  error?: string;
  data: {
    farmPosts: IFarmPostDocument[];
    storePosts: IStorePostDocument[];
    pagination: {
      currentPage: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
      totalDocs: number;
    };
  };
}

// Initial state
const initialState: PostsState = {
  farmPosts: [],
  storePosts: [],
  currentFarmPost: null,
  currentStorePost: null,
  loading: false,
  error: null,
  pagination: null,
};
interface FetchPostsParams {
  page?: number;
  limit?: number;
  category?: string;
  subcategory?: string;
  userId?: string;
  location?: LocationParams;
  searchQuery?: string;
  region?: string;
  district?: string;
}

interface PaginationResponse {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalDocs: number;
}

interface PostsResponse {
  success: boolean;
  error?: string;
  data: {
    farmPosts: IFarmPostDocument[];
    storePosts: IStorePostDocument[];
    pagination: PaginationResponse;
  };
}


interface LocationParams {
  region?: string;
  district?: string;
}



export const fetchAllPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (params: FetchPostsParams, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();

      // Basic pagination params
      if (params.page) queryParams.set('page', params.page.toString());
      if (params.limit) queryParams.set('limit', params.limit.toString());

      // Category and subcategory filters
      if (params.category) queryParams.set('category', params.category);
      if (params.subcategory) queryParams.set('subcategory', params.subcategory);

      // User filter
      if (params.userId) queryParams.set('userId', params.userId);

      // Location filters
      if (params.location?.region) queryParams.set('region', params.location.region);
      if (params.location?.district) queryParams.set('district', params.location.district);

      // Search query - adding this to match the API endpoint
      if (params.searchQuery) queryParams.set('search', params.searchQuery);

      const response = await fetch(`/api/postapi?${queryParams.toString()}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch posts');
      }

      const data: PostsResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch posts');
      }

      return {
        farmPosts: data.data.farmPosts || [],
        storePosts: data.data.storePosts || [],
        pagination: {
          currentPage: data.data.pagination.currentPage,
          totalPages: data.data.pagination.totalPages,
          hasNextPage: data.data.pagination.hasNextPage,
          hasPrevPage: data.data.pagination.hasPrevPage,
          totalDocs: data.data.pagination.totalDocs,
        },
        requestedPage: params.page || 1,
        isNewSearch: params.page === 1 || !params.page
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch posts');
    }
  }
);

// Async thunks for farm posts
export const fetchFarmPosts = createAsyncThunk(
  'posts/fetchFarmPosts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/postapi/me/farm-post');
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error);
      }
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);


export const createFarmPost = createAsyncThunk(
  'posts/createFarmPost',
  async (postData: Partial<IFarmPostDocument>, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/postapi/me/farm-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error);
      }
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateFarmPost = createAsyncThunk(
  'posts/updateFarmPost',
  async ({ id, postData }: { id: string; postData: Partial<IFarmPostDocument> }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/postapi/me/farm-post/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error);
      }
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteFarmPost = createAsyncThunk(
  'posts/deleteFarmPost',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/postapi/me/farm-post/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error);
      }
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunks for store posts
export const fetchStorePosts = createAsyncThunk(
  'posts/fetchStorePosts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/postapi/me/store-post');
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error);
      }
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

interface FetchStorePostsParams {
  id?: string;
  userId?: string;
}

export const fetchStorePostsParam = createAsyncThunk(
  'posts/fetchStorePostsByParams',
  async (params: FetchStorePostsParams = {}, { rejectWithValue }) => {
    try {
      let url = '/api/postapi/me/store-post';
      if (params.id) {
        url += `/${params.id}`;
      } else if (params.userId) {
        url += `?userId=${params.userId}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createStorePost = createAsyncThunk(
  'posts/createStorePost',
  async (postData: Partial<IStorePostDocument>, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      
      // Handle ProductSubImages separately
      const productSubImages = postData.ProductSubImages || [];
      const postDataCopy = { ...postData };
      delete postDataCopy.ProductSubImages;

      // Add all non-file data as a properly formatted JSON string
      formData.append('postData', JSON.stringify(postDataCopy));

      // Add images separately
      productSubImages.forEach((image, index) => {
        if (image.file) {
          formData.append(`images`, image.file);
          // Include the URL in the imageData if it exists
          formData.append(`imageData${index}`, JSON.stringify({
            index,
            fileName: image.fileName,
            url: image.url // Make sure this is included
          }));
        }
      });

      const response = await fetch('/api/postapi/me/store-post', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create store post');
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error);
      }
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateStorePost = createAsyncThunk(
  'posts/updateStorePost',
  async ({ id, postData }: { id: string; postData: Partial<IStorePostDocument> }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      
      // Handle ProductSubImages separately if they exist
      const productSubImages = postData.ProductSubImages || [];
      const postDataCopy = { ...postData };
      delete postDataCopy.ProductSubImages;

      // Add all non-file data as a properly formatted JSON string
      formData.append('postData', JSON.stringify(postDataCopy));

      // Add images separately
      productSubImages.forEach((image, index) => {
        if (image.file) {
          formData.append(`images`, image.file);
          formData.append(`imageData${index}`, JSON.stringify({
            index,
            fileName: image.fileName,
            url: image.url
          }));
        }
      });

      // Correct API endpoint to match the pattern used in other API calls
      const response = await fetch(`/api/postapi/me/store-post/${id}`, {
        method: 'PUT',
        body: formData,
      });
      
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to update store post');
      }
      return data.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteStorePost = createAsyncThunk(
  'posts/deleteStorePost',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/postapi/me/store-post/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.error);
      }
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Create the slice
const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setCurrentFarmPost: (state, action: PayloadAction<IFarmPostDocument | null>) => {
      return produce(state, (draft: { currentFarmPost: IFarmPostDocument | null; }) => {
        draft.currentFarmPost = action.payload;
      });
    },
    setCurrentStorePost: (state, action: PayloadAction<IStorePostDocument | null>) => {
      return produce(state, (draft: { currentStorePost: IStorePostDocument | null; }) => {
        draft.currentStorePost = action.payload;
      });
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Farm Posts
    builder
      .addCase(fetchFarmPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFarmPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.farmPosts = action.payload;
      })
      .addCase(fetchFarmPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createFarmPost.fulfilled, (state, action) => {
        state.farmPosts.push(action.payload);
      })
      .addCase(updateFarmPost.fulfilled, (state, action) => {
        const index = state.farmPosts.findIndex(post => post._id === action.payload._id);
        if (index !== -1) {
          state.farmPosts[index] = action.payload;
        }
      })
      .addCase(deleteFarmPost.fulfilled, (state, action) => {
        state.farmPosts = state.farmPosts.filter(post => post._id.toString() !== action.payload);
      })
      // Store Posts
      .addCase(fetchStorePosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStorePosts.fulfilled, (state, action) => {
        state.loading = false;
        state.storePosts = action.payload;
      })
      .addCase(fetchStorePosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createStorePost.fulfilled, (state, action) => {
        state.storePosts.push(action.payload);
      })
      .addCase(updateStorePost.fulfilled, (state, action) => {
        const index = state.storePosts.findIndex(post => post._id === action.payload._id);
        if (index !== -1) {
          state.storePosts[index] = action.payload;
        }
      })
      .addCase(deleteStorePost.fulfilled, (state, action) => {
        state.storePosts = state.storePosts.filter(post => post._id.toString() !== action.payload);
      })
      .addCase(fetchAllPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPosts.fulfilled, (state, action) => {
        const { farmPosts, storePosts, pagination, requestedPage, isNewSearch } = action.payload;
        
        // If it's a new search or first page, replace the posts
        // Otherwise, append the new posts
        if (isNewSearch) {
          state.farmPosts = farmPosts as WritableDraft<IFarmPostDocument>[];
          state.storePosts = storePosts as WritableDraft<IStorePostDocument>[];
        } else {
          state.farmPosts = [...state.farmPosts, ...farmPosts] as WritableDraft<IFarmPostDocument>[];
          state.storePosts = [...state.storePosts, ...storePosts] as WritableDraft<IStorePostDocument>[];
        }
        
        state.pagination = {
          page: pagination.currentPage,
          limit: state.pagination?.limit || 10,
          totalDocs: pagination.totalDocs,
          hasNextPage: pagination.hasNextPage,
          hasPrevPage: pagination.hasPrevPage,
          totalPages: pagination.totalPages,
        };
        state.loading = false;
      })
      .addCase(fetchAllPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch posts';
      })
      .addCase(fetchStorePostsParam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStorePostsParam.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(action.payload)) {
          state.storePosts = action.payload;
        } else {
          state.currentStorePost = action.payload;
        }
      })
      .addCase(fetchStorePostsParam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
  },
});

export const { setCurrentFarmPost, setCurrentStorePost, clearError } = postsSlice.actions;
export default postsSlice.reducer;

// Selectors
export const selectAllFarmPosts = (state: { posts: PostsState }) => state.posts.farmPosts;
export const selectAllStorePosts = (state: { posts: PostsState }) => state.posts.storePosts;
export const selectCurrentFarmPost = (state: { posts: PostsState }) => state.posts.currentFarmPost;
export const selectCurrentStorePost = (state: { posts: PostsState }) => state.posts.currentStorePost;
export const selectPostsLoading = (state: { posts: PostsState }) => state.posts.loading;
export const selectPostsError = (state: { posts: PostsState }) => state.posts.error;
export const selectPagination = (state: { posts: PostsState }) => state.posts.pagination;
export const selectUserStorePosts = (state: { posts: PostsState }, userId: string) => 
  state.posts.storePosts.filter(post => post.userProfile._id.toString() === userId);
export const selectUserFarmPosts = (state: { posts: PostsState }, userId: string) => 
  state.posts.farmPosts.filter(post => post.userProfile._id.toString() === userId);

// Add a new selector
export const selectPostsByCategory = (state: { posts: PostsState }, categoryId: string) => ({
  farmPosts: state.posts.farmPosts.filter(post => post.category?.id === categoryId),
  storePosts: state.posts.storePosts.filter(post => post.category?.id === categoryId),
});

export const selectFilteredPosts = (
  state: { posts: PostsState },
  filters: {
    categoryId?: string;
    subcategoryId?: string;
    userId?: string;
    region?: string;
    district?: string;
    searchQuery?: string;
  }
) => {
  let farmPosts = state.posts.farmPosts;
  let storePosts = state.posts.storePosts;

  if (filters.categoryId) {
    farmPosts = farmPosts.filter(post => post.category?.id === filters.categoryId);
    storePosts = storePosts.filter(post => post.category?.id === filters.categoryId);
  }

  if (filters.subcategoryId) {
    farmPosts = farmPosts.filter(post => post.subcategory?.id === filters.subcategoryId);
    storePosts = storePosts.filter(post => post.subcategory?.id === filters.subcategoryId);
  }

  if (filters.userId) {
    farmPosts = farmPosts.filter(post => post.userProfile._id.toString() === filters.userId);
    storePosts = storePosts.filter(post => post.userProfile._id.toString() === filters.userId);
  }

  if (filters.region) {
    farmPosts = farmPosts.filter(post => post.FarmProfile?.farmLocation?.region === filters.region);
    storePosts = storePosts.filter(post => post.storeLocation?.region === filters.region);
  }

  if (filters.district) {
    farmPosts = farmPosts.filter(post => post.FarmProfile?.farmLocation?.district === filters.district);
    storePosts = storePosts.filter(post => post.storeLocation?.district === filters.district);
  }

  return { farmPosts, storePosts };
};

export const selectCategoryName = (state: { posts: PostsState }, categoryId: string) => {
  const firstPost = 
    state.posts.farmPosts.find(post => post.category?.id === categoryId) ||
    state.posts.storePosts.find(post => post.category?.id === categoryId);
  return firstPost?.category?.name;
};

export const selectSubcategoryName = (state: { posts: PostsState }, subcategoryId: string) => {
  const firstPost = 
    state.posts.farmPosts.find(post => post.subcategory?.id === subcategoryId) ||
    state.posts.storePosts.find(post => post.subcategory?.id === subcategoryId);
  return firstPost?.subcategory?.name;
};
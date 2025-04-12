import { IStoreProfile, StoreBranch, StoreImage } from '@/models/profileI-interfaces';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Types from the API
export type UpdateOperation = 
  | 'addBranch' 
  | 'updateBranch' 
  | 'deleteBranch'
  | 'addImage' 
  | 'updateImage' 
  | 'deleteImage'
  | 'updateStoreInfo';

interface StoreState {
  profile: IStoreProfile | null;
  isLoading: boolean;
  error: string | null;
  isUpdating: boolean;
  updateError: string | null;
  isDeleting: boolean;
  deleteError: string | null;
}

const initialState: StoreState = {
  profile: null,
  isLoading: false,
  error: null,
  isUpdating: false,
  updateError: null,
  isDeleting: false,
  deleteError: null,
};

// Helper type for API responses
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string[];
}

// Async thunks for API calls
export const fetchStoreProfile = createAsyncThunk(
  'store/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<ApiResponse<IStoreProfile>>('/api/profileapi/store/me');
      if (!response.data.success || !response.data.data) {
        return rejectWithValue(response.data.error || 'Failed to fetch store profile');
      }
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch store profile');
    }
  }
);

export const fetchStoreProfileById = createAsyncThunk(
  'store/fetchProfileByUserId',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<ApiResponse<IStoreProfile>>(`/api/profileapi/store/${userId}`);
      if (!response.data.success || !response.data.data) {
        return rejectWithValue(response.data.error || 'Failed to fetch store profile');
      }
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch store profile');
    }
  }
);


export const createStore = createAsyncThunk(
  'store/createProfile',
  async (newProfile: Partial<IStoreProfile>, { rejectWithValue }) => {
    try {
      const response = await axios.post<ApiResponse<IStoreProfile>>('/api/profileapi/store/me', newProfile);
      if (!response.data.success || !response.data.data) {
        return rejectWithValue(response.data.error || 'Failed to create store profile');
      }
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create store profile');
    }
  }
);

interface UpdateStoreInfoPayload {
  storeName?: string;
  description?: string;
  productionScale?: string;
  storeOwnership?: string;
  productSold?: string[];
  belongsToGroup?: boolean;
  available?: boolean;
  groupName?: string;
}

export const updateStoreInfo = createAsyncThunk(
  'store/updateInfo',
  async (updateData: UpdateStoreInfoPayload, { rejectWithValue }) => {
    try {
      const response = await axios.put<ApiResponse<IStoreProfile>>('/api/profileapi/store/me', {
        operation: 'updateStoreInfo',
        storeInfo: updateData
      });
      if (!response.data.success || !response.data.data) {
        return rejectWithValue(response.data.error || 'Failed to update store info');
      }
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update store info');
    }
  }
);

// Branch management thunks
export const addBranch = createAsyncThunk(
  'store/addBranch',
  async (branch: StoreBranch, { rejectWithValue }) => {
    try {
      const response = await axios.put<ApiResponse<IStoreProfile>>('/api/profileapi/store/me', {
        operation: 'addBranch',
        branches: branch
      });
      if (!response.data.success || !response.data.data) {
        return rejectWithValue(response.data.error || 'Failed to add branch');
      }
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to add branch');
    }
  }
);

interface UpdateBranchPayload {
  branchId: string;
  data: StoreBranch;
}

export const updateBranch = createAsyncThunk(
  'store/updateBranch',
  async ({ branchId, data }: UpdateBranchPayload, { rejectWithValue }) => {
    try {
      const response = await axios.put<ApiResponse<IStoreProfile>>('/api/profileapi/store/me', {
        operation: 'updateBranch',
        branchId,
        branches: data
      });
      if (!response.data.success || !response.data.data) {
        return rejectWithValue(response.data.error || 'Failed to update branch');
      }
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update branch');
    }
  }
);

export const deleteBranch = createAsyncThunk(
  'store/deleteBranch',
  async (branchId: string, { rejectWithValue }) => {
    try {
      const response = await axios.put<ApiResponse<IStoreProfile>>('/api/profileapi/store/me', {
        operation: 'deleteBranch',
        branchId
      });
      if (!response.data.success || !response.data.data) {
        return rejectWithValue(response.data.error || 'Failed to delete branch');
      }
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete branch');
    }
  }
);

// Image management thunks
export const addImage = createAsyncThunk(
  'store/addImage',
  async (image: StoreImage, { rejectWithValue }) => {
    try {
      const response = await axios.put<ApiResponse<IStoreProfile>>('/api/profileapi/store/me', {
        operation: 'addImage',
        storeImages: image
      });
      if (!response.data.success || !response.data.data) {
        return rejectWithValue(response.data.error || 'Failed to add image');
      }
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to add image');
    }
  }
);

interface UpdateImagePayload {
  imageId: string;
  data: StoreImage;
}

export const updateImage = createAsyncThunk(
  'store/updateImage',
  async ({ imageId, data }: UpdateImagePayload, { rejectWithValue }) => {
    try {
      const response = await axios.put<ApiResponse<IStoreProfile>>('/api/profileapi/store/me', {
        operation: 'updateImage',
        imageId,
        storeImages: data
      });
      if (!response.data.success || !response.data.data) {
        return rejectWithValue(response.data.error || 'Failed to update image');
      }
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update image');
    }
  }
);

// update image availability

interface UpdateImageAvailabilityPayload {
  imageId: string;
  available: boolean;
}

export const updateImageAvailability = createAsyncThunk(
  'store/updateImageAvailability',
  async ({ imageId, available }: UpdateImageAvailabilityPayload, { rejectWithValue }) => {
    try {
      // Find existing image data first
      const state = getState() as { store: StoreState };
      const image = state.store.profile?.storeImages?.find(img => img._id === imageId);
      
      if (!image) {
        return rejectWithValue('Image not found');
      }

      const response = await axios.put<ApiResponse<IStoreProfile>>('/api/profileapi/store/me', {
        operation: 'updateImage',
        imageId,
        storeImages: { ...image, available }
      });

      if (!response.data.success || !response.data.data) {
        return rejectWithValue(response.data.error || 'Failed to update image availability');
      }
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update image availability');
    }
  }
);

export const deleteImage = createAsyncThunk(
  'store/deleteImage',
  async (imageId: string, { rejectWithValue }) => {
    try {
      const response = await axios.put<ApiResponse<IStoreProfile>>('/api/profileapi/store/me', {
        operation: 'deleteImage',
        imageId
      });
      if (!response.data.success || !response.data.data) {
        return rejectWithValue(response.data.error || 'Failed to delete image');
      }
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete image');
    }
  }
);

export const deleteStoreProfile = createAsyncThunk(
  'store/deleteProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.delete<ApiResponse<void>>('/api/profileapi/store/me');
      if (!response.data.success) {
        return rejectWithValue(response.data.error || 'Failed to delete store profile');
      }
      return undefined;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete store profile');
    }
  }
);

// Create the slice
const storeSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    resetStoreState: () => initialState,
    resetErrors: (state) => {
      state.error = null;
      state.updateError = null;
      state.deleteError = null;
    },
  },
  extraReducers: (builder) => {
    // Generic handler for pending state
    const setPending = (state: StoreState) => {
      state.isLoading = true;
      state.error = null;
    };

    // Generic handler for rejected state
    const setRejected = (state: StoreState, action: any) => {
      state.isLoading = false;
      state.error = action.payload;
    };

    // Generic handler for fulfilled state with profile update
    const setFulfilledWithProfile = (state: StoreState, action: PayloadAction<IStoreProfile>) => {
      state.isLoading = false;
      state.error = null;
      state.profile = action.payload;
    };

    builder
      // Fetch profile
      .addCase(fetchStoreProfile.pending, setPending)
      .addCase(fetchStoreProfile.fulfilled, setFulfilledWithProfile)
      .addCase(fetchStoreProfile.rejected, setRejected)

      // Create store
      .addCase(createStore.pending, setPending)
      .addCase(createStore.fulfilled, setFulfilledWithProfile)
      .addCase(createStore.rejected, setRejected)

      // Update store info
      .addCase(updateStoreInfo.pending, setPending)
      .addCase(updateStoreInfo.fulfilled, setFulfilledWithProfile)
      .addCase(updateStoreInfo.rejected, setRejected)

      // Branch operations
      .addCase(addBranch.pending, setPending)
      .addCase(addBranch.fulfilled, setFulfilledWithProfile)
      .addCase(addBranch.rejected, setRejected)

      .addCase(updateBranch.pending, setPending)
      .addCase(updateBranch.fulfilled, setFulfilledWithProfile)
      .addCase(updateBranch.rejected, setRejected)

      .addCase(deleteBranch.pending, setPending)
      .addCase(deleteBranch.fulfilled, setFulfilledWithProfile)
      .addCase(deleteBranch.rejected, setRejected)

      // Image operations
      .addCase(addImage.pending, setPending)
      .addCase(addImage.fulfilled, setFulfilledWithProfile)
      .addCase(addImage.rejected, setRejected)

      .addCase(updateImage.pending, setPending)
      .addCase(updateImage.fulfilled, setFulfilledWithProfile)
      .addCase(updateImage.rejected, setRejected)

      .addCase(updateImageAvailability.pending, setPending)
      .addCase(updateImageAvailability.fulfilled, setFulfilledWithProfile)
      .addCase(updateImageAvailability.rejected, setRejected)

      .addCase(deleteImage.pending, setPending)
      .addCase(deleteImage.fulfilled, setFulfilledWithProfile)
      .addCase(deleteImage.rejected, setRejected)

      // Delete profile
      .addCase(fetchStoreProfileById.pending, setPending)
      .addCase(fetchStoreProfileById.fulfilled, setFulfilledWithProfile)
      .addCase(fetchStoreProfileById.rejected, setRejected)
  },
});

export const { resetStoreState, resetErrors } = storeSlice.actions;

export default storeSlice.reducer;

// Selectors
export const selectStoreProfile = (state: { store: StoreState }) => state.store.profile;
export const selectStoreLoading = (state: { store: StoreState }) => state.store.isLoading;
export const selectStoreError = (state: { store: StoreState }) => state.store.error;
export const selectStoreUpdating = (state: { store: StoreState }) => state.store.isUpdating;
export const selectStoreUpdateError = (state: { store: StoreState }) => state.store.updateError;
export const selectStoreDeleting = (state: { store: StoreState }) => state.store.isDeleting;
export const selectStoreDeleteError = (state: { store: StoreState }) => state.store.deleteError;

function getState(): { store: StoreState; } {
  throw new Error('Function not implemented.');
}

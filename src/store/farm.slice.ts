import { IFarmProfile, FarmType, ProductionScale } from "@/models/profileI-interfaces";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface ArrayUpdateOperation {
  operation: 'add' | 'remove' | 'update';
  field: string;
  value?: any;
  index?: number;
}

interface UpdateFarmProfilePayload {
  id: string;
  basicInfo?: Partial<IFarmProfile>;
  arrayUpdates?: ArrayUpdateOperation[];
}

interface FarmProfileState {
  farmProfiles: IFarmProfile[];
  currentFarmProfile: IFarmProfile | null;
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

const initialState: FarmProfileState = {
  farmProfiles: [],
  currentFarmProfile: null,
  loading: "idle",
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
  },
};

export const fetchFarmProfiles = createAsyncThunk(
  "farmProfiles/fetchFarmProfiles",
  async (
    params: {
      userId?: string;
      page?: number;
      limit?: number;
      farmType?: (typeof FarmType)[keyof typeof FarmType];
      productionScale?: (typeof ProductionScale)[keyof typeof ProductionScale];
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const { userId, page = 1, limit = 10, farmType, productionScale } = params;

      const queryParams = new URLSearchParams();
      queryParams.append("page", page.toString());
      queryParams.append("limit", limit.toString());

      if (userId) queryParams.append("userId", userId);
      if (farmType) queryParams.append("farmType", farmType);
      if (productionScale) queryParams.append("productionScale", productionScale);

      // Use the generic farm endpoint when userId is provided, otherwise use farm_me
      const endpoint = '/api/profileapi/farm_me';
      const response = await axios.get(`${endpoint}?${queryParams}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "An error occurred"
      );
    }
  }
);


export const createFarmProfile = createAsyncThunk(
  "farmProfiles/createFarmProfile",
  async (farmProfileData: Partial<IFarmProfile>, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/profileapi/farm_me", farmProfileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "An error occurred"
      );
    }
  }
);


export const updateFarmProfile = createAsyncThunk(
  "farmProfiles/updateFarmProfile",
  async (
    { 
      id, 
      basicInfo, 
      arrayUpdates 
    }: UpdateFarmProfilePayload,
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(`/api/profileapi/farm_me/${id}`, {
        basicInfo,
        arrayUpdates
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.error || 'An error occurred');
      }
      return rejectWithValue(error instanceof Error ? error.message : 'An error occurred');
    }
  }
);

// Delete a farm profile
export const deleteFarmProfile = createAsyncThunk(
  "farmProfiles/deleteFarmProfile",
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/profileapi/farm_me/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "An error occurred"
      );
    }
  }
);


// Create the farm profile slice
const farmProfileSlice = createSlice({
  name: "farmProfiles",
  initialState,
  reducers: {
    clearCurrentFarmProfile: (state) => {
      state.currentFarmProfile = null;
    },
    resetError: (state) => {
      state.error = null;
    },
    setCurrentFarmProfile: (state, action) => {
      state.currentFarmProfile = action.payload;
    },
    updateLocalArrays: (state, action: { payload: ArrayUpdateOperation }) => {
      if (!state.currentFarmProfile) return;

      const { operation, field, value, index } = action.payload;
      const arrayField = state.currentFarmProfile[field as keyof IFarmProfile] as any[];

      switch (operation) {
        case 'add':
          if (Array.isArray(arrayField)) {
            arrayField.push(value);
          }
          break;
        case 'remove':
          if (Array.isArray(arrayField) && typeof index === 'number') {
            arrayField.splice(index, 1);
          }
          break;
        case 'update':
          if (Array.isArray(arrayField) && typeof index === 'number') {
            arrayField[index] = value;
          }
          break;
      }
    }
  },
  extraReducers: (builder) => {
    // Fetch farm profiles
    builder.addCase(fetchFarmProfiles.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(fetchFarmProfiles.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.farmProfiles = action.payload.data;
      state.pagination = action.payload.pagination;
    });
    builder.addCase(fetchFarmProfiles.rejected, (state, action) => {
      state.loading = "failed";
      state.error = action.payload as string;
    });

    // Create farm profile
    builder.addCase(createFarmProfile.fulfilled, (state, action) => {
      state.farmProfiles.push(action.payload);
      state.currentFarmProfile = action.payload;
    });
    builder.addCase(createFarmProfile.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    // Delete farm profile
    builder.addCase(deleteFarmProfile.fulfilled, (state, action) => {
      state.farmProfiles = state.farmProfiles.filter(
        (profile) => profile._id.toString() !== action.payload
      );
      state.currentFarmProfile = null;
    });

    // Update farm profile cases
    builder.addCase(updateFarmProfile.pending, (state) => {
      state.loading = "pending";
    });
    builder.addCase(updateFarmProfile.fulfilled, (state, action) => {
      state.loading = "succeeded";
      const updatedProfile = action.payload.data;
      
      // Update in profiles list
      const index = state.farmProfiles.findIndex(
        (profile) => profile._id === updatedProfile._id
      );
      if (index !== -1) {
        state.farmProfiles[index] = updatedProfile;
      }
      
      // Update current profile
      state.currentFarmProfile = updatedProfile;
    });
    builder.addCase(updateFarmProfile.rejected, (state, action) => {
      state.loading = "failed";
      state.error = action.payload as string;
    });
  },
});

// Export actions and reducer
export const { clearCurrentFarmProfile, resetError, updateLocalArrays, setCurrentFarmProfile } = farmProfileSlice.actions;
export default farmProfileSlice.reducer;
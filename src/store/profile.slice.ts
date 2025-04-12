import {
  createSlice,
  createAsyncThunk,
  Draft,
  PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";
import { IUserProfile, UserRole } from "@/models/profileI-interfaces";

// Type definitions
interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
}

interface FilterParams {
  role?: (typeof UserRole)[keyof typeof UserRole];
  country?: string;
  verified?: boolean;
  userId?: string;
  page?: number;
  limit?: number;
}

interface UserProfileState {
  profile: IUserProfile | null;              // Current logged-in user
  viewedProfile: IUserProfile | null;        // Profile being viewed
  profiles: IUserProfile[];
  pagination: PaginationInfo;
  loading: "idle" | "pending" | "succeeded" | "failed";
  error: string | null;
  filters: FilterParams;
}

// Initial state
const initialState: UserProfileState = {
  profile: null,
  viewedProfile: null,
  profiles: [],
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
  },
  loading: "idle",
  error: null,
  filters: {},
};

export const fetchProfiles = createAsyncThunk(
  "userProfile/fetchProfiles",
  async (filters: FilterParams, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (filters.role) params.append("role", filters.role);
      if (filters.country) params.append("country", filters.country);
      if (filters.verified !== undefined)
        params.append("verified", filters.verified.toString());
      if (filters.userId) params.append("userId", filters.userId);
      if (filters.page) params.append("page", filters.page.toString());
      if (filters.limit) params.append("limit", filters.limit.toString());

      const response = await axios.get<{
        success: boolean;
        data: IUserProfile[];
        pagination: PaginationInfo;
      }>(`/api/profileapi?${params.toString()}`);

      if (!response.data.success) {
        throw new Error("Failed to fetch profiles");
      }

      return {
        profiles: response.data.data,
        pagination: response.data.pagination,
      };
    } catch (error) {
      console.error("Full error:", error);
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error || "Failed to fetch profiles"
        );
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const fetchMyProfile = createAsyncThunk(
  "userProfile/fetchMyProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<{
        success: boolean;
        data: IUserProfile;
      }>("/api/profileapi/me");

      if (!response.data.success) {
        throw new Error("Failed to fetch user profile");
      }

      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error || "Failed to fetch my profile"
        );
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const fetchProfileByParams = createAsyncThunk(
  "userProfile/fetchProfile",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<{
        success: boolean;
        data: IUserProfile;
      }>(`/api/profileapi/${id}`);

      if (!response.data.success) {
        throw new Error("Failed to fetch profile");
      }

      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error || "Failed to fetch profile"
        );
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const createUserProfile = createAsyncThunk(
  "userProfile/createProfile",
  async (profileData: Partial<IUserProfile>, { rejectWithValue }) => {
    try {
      const response = await axios.post<{
        success: boolean;
        data: IUserProfile;
      }>("/api/profileapi", profileData);

      if (!response.data.success) {
        throw new Error("Failed to create profile");
      }

      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data || "Failed to create user profile"
        );
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "userProfile/updateProfile",
  async (
    { updateData }: { userId: string; updateData: Partial<IUserProfile> },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.patch<{
        success: boolean;
        data: IUserProfile;
      }>(`/api/profileapi/me`, updateData);

      if (!response.data.success) {
        throw new Error("Failed to update profile");
      }

      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data || "Failed to update user profile"
        );
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const verifyUserProfile = createAsyncThunk(
  "userProfile/verifyProfile",
  async (_userId: string, { rejectWithValue }) => {
    try {
      const response = await axios.patch<{
        success: boolean;
        data: IUserProfile;
      }>(`/api/profileapi/me`);

      if (!response.data.success) {
        throw new Error("Failed to verify profile");
      }

      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data || "Failed to verify user profile"
        );
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const deleteUserAccount = createAsyncThunk(
  "userProfile/deleteAccount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.delete<{
        success: boolean;
        message: string;
      }>("/api/profileapi/me");

      if (!response.data.success) {
        throw new Error("Failed to delete account");
      }

      return response.data.message;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.error || "Failed to delete account"
        );
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);


// Slice
const userProfileSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {
    clearUserProfile: (state) => {
      state.profile = null;
      state.loading = "idle";
      state.error = null;
    },
    clearViewedProfile: (state) => {
      state.viewedProfile = null;
    },
    clearProfiles: (state) => {
      state.profiles = [];
      state.pagination = initialState.pagination;
      state.loading = "idle";
      state.error = null;
    },
    updateSocialMediaLinks: (
      state,
      action: PayloadAction<{
        twitter?: string | null;
        facebook?: string | null;
        instagram?: string | null;
        linkedIn?: string | null;
      }>
    ) => {
      if (state.profile) {
        state.profile.socialMediaLinks = {
          twitter: action.payload.twitter ?? null,
          facebook: action.payload.facebook ?? null,
          instagram: action.payload.instagram ?? null,
          linkedIn: action.payload.linkedIn ?? null,
        };
      }
    },
    setFilters: (state, action: PayloadAction<FilterParams>) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
        page: 1,
      };
    },
    clearFilters: (state) => {
      state.filters = {};
      state.pagination.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.pagination.limit = action.payload;
      state.pagination.page = 1;
    },
  },
  extraReducers: (builder) => {
    // Fetch Multiple Profiles
    builder
      .addCase(fetchProfiles.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchProfiles.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.profiles = action.payload.profiles as Draft<IUserProfile>[];
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchProfiles.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as string;
      })
      .addCase(fetchProfileByParams.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchProfileByParams.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.viewedProfile = action.payload as Draft<IUserProfile>; // Store in viewedProfile instead of profile
        state.error = null;
      })
      .addCase(fetchProfileByParams.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as string;
      })
      .addCase(fetchMyProfile.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchMyProfile.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.profile = action.payload as Draft<IUserProfile>;
        state.error = null;
      })
      .addCase(fetchMyProfile.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as string;
      })
      // Create Profile
      .addCase(createUserProfile.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(createUserProfile.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.profile = action.payload as Draft<IUserProfile>;
        state.error = null;
        if (state.profiles.length > 0) {
          state.profiles = [
            action.payload as Draft<IUserProfile>,
            ...state.profiles,
          ];
        }
      })
      .addCase(createUserProfile.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as string;
      })

      // Update Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.profile = action.payload as Draft<IUserProfile>;
        state.error = null;
        const index = state.profiles.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.profiles[index] = action.payload as Draft<IUserProfile>;
        }
        // Update viewedProfile if it's the same as the updated profile
        if (state.viewedProfile && state.viewedProfile._id === action.payload._id) {
          state.viewedProfile = action.payload as Draft<IUserProfile>;
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as string;
      })

      // Verify Profile
      .addCase(verifyUserProfile.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(verifyUserProfile.fulfilled, (state, action) => {
        state.loading = "succeeded";
        if (state.profile && state.profile._id === action.payload._id) {
          state.profile = action.payload as Draft<IUserProfile>;
        }
        // Update in profiles array if exists
        const index = state.profiles.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.profiles[index] = action.payload as Draft<IUserProfile>;
        }
        // Update viewedProfile if it's the same as the verified profile
        if (state.viewedProfile && state.viewedProfile._id === action.payload._id) {
          state.viewedProfile = action.payload as Draft<IUserProfile>;
        }
      })
      .addCase(verifyUserProfile.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as string;
      })
       // Delete Account
    .addCase(deleteUserAccount.pending, (state) => {
      state.loading = "pending";
    })
    .addCase(deleteUserAccount.fulfilled, (state) => {
      state.loading = "succeeded";
      state.profile = null;
      state.viewedProfile = null;
      state.error = null;
      // We don't need to update profiles array as the user will be redirected
      // to login page after account deletion
    })
    .addCase(deleteUserAccount.rejected, (state, action) => {
      state.loading = "failed";
      state.error = action.payload as string;
    });
  },
});

// Selectors
export const selectUserProfile = (state: { userProfile: UserProfileState }) =>
  state.userProfile.profile;

export const selectViewedProfile = (state: { userProfile: UserProfileState }) =>
  state.userProfile.viewedProfile;

export const selectUserProfiles = (state: { userProfile: UserProfileState }) =>
  state.userProfile.profiles;

export const selectPagination = (state: { userProfile: UserProfileState }) =>
  state.userProfile.pagination;

export const selectFilters = (state: { userProfile: UserProfileState }) =>
  state.userProfile.filters;

export const selectUserProfileLoading = (state: {
  userProfile: UserProfileState;
}) => state.userProfile.loading;

export const selectUserProfileError = (state: {
  userProfile: UserProfileState;
}) => state.userProfile.error;

export const selectUserRole = (state: { userProfile: UserProfileState }) =>
  state.userProfile.profile?.role as
    | (typeof UserRole)[keyof typeof UserRole]
    | undefined;

// Export actions
export const {
  clearUserProfile,
  clearViewedProfile,
  clearProfiles,
  updateSocialMediaLinks,
  setFilters,
  clearFilters,
  setPage,
  setLimit,
} = userProfileSlice.actions;

export const selectMyProfile = (state: { userProfile: UserProfileState }) =>
  state.userProfile.profile;

export default userProfileSlice.reducer;
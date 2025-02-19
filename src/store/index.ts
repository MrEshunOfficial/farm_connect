// store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import userProfileReducer from "./profile.slice";
import storeProfilesReducer from "./store.slice";
import farmProfilesReducer from "./farm.slice";
import postReducer from './post.slice'

export const store = configureStore({
  reducer: {
    userProfile: userProfileReducer,
    store: storeProfilesReducer,
    posts: postReducer,
    farmProfiles: farmProfilesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import mongoose from 'mongoose';

import { UserProfileSchema } from './profileModel';
import {  StoreProfileSchema } from './storeProfile';
import { IFarmProfile, IStoreProfile, IUserProfile } from '../profileI-interfaces';
import { FarmProfileSchema } from './farmProfile';

// Model creation with error handling
let UserProfile: mongoose.Model<IUserProfile>;
let StoreProfile: mongoose.Model<IStoreProfile>;
let FarmProfile: mongoose.Model<IFarmProfile>;

try {
  UserProfile = mongoose.model<IUserProfile>('UserProfile');
} catch {
  UserProfile = mongoose.model<IUserProfile>('UserProfile', UserProfileSchema);
}

try {
  StoreProfile = mongoose.model<IStoreProfile>('StoreProfile');
} catch {
  StoreProfile = mongoose.model<IStoreProfile>('StoreProfile', StoreProfileSchema);
}

try {
  FarmProfile = mongoose.model<IFarmProfile>('FarmProfile');
} catch {
  FarmProfile = mongoose.model<IFarmProfile>('FarmProfile', FarmProfileSchema);
}

export {
  UserProfile,
  StoreProfile,
  FarmProfile,
};
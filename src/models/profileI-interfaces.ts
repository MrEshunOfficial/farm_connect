import { Document, Types } from 'mongoose';

// Enums for user profile
export const Gender = {
  Male: 'Male',
  Female: 'Female',
  NonBinary: 'Non-binary',
  PreferNotToSay: 'Prefer not to say'
} as const;

export const UserRole = {
  Farmer: 'Farmer',
  Seller: 'Seller',
  Buyer: 'Buyer',
  Both: 'Both'
} as const;

// Enums for farm profile
export const OwnershipStatus = {
  Owned: 'Owned',
  Leased: 'Leased',
  Rented: 'Rented',
  Communal: 'Communal'
} as const;

export const FarmType = {
  CropFarming: 'Crop Farming',
  LivestockFarming: 'Livestock Farming',
  Mixed: 'Mixed',
  Aquaculture: 'Aquaculture',
  Nursery: 'Nursery',
  Poultry: 'Poultry',
  Others: 'Others',
} as const;

export const ProductionScale = {
  Small: 'Small',
  Medium: 'Medium',
  Commercial: 'Commercial'
} as const;

export interface IReview extends Document {
  _id: Types.ObjectId;
  userId: string;
  recipientId: Types.ObjectId;
  authorName: string;
  reviewerAvatar: string;
  rating: number;
  content: string;
  helpful: number;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

// Types for cart items
export interface ICartItem extends Document {
  userId: string;
  id: string;
  type: string;
  quantity: number;
  price: number;
  title?: string;
  imageUrl?: string;
  currency?: string;
  unit?: string;
  calculateTotal: () => number;
}

export interface IUserProfile extends Document {
  _id: Types.ObjectId;
  userId: string;
  email: string;
  fullName: string;
  username: string;
  profilePicture?: {
    url: string;
    fileName: string;
  };
  bio?: string;
  gender: typeof Gender[keyof typeof Gender];
  phoneNumber: string;
  country: string;
  socialMediaLinks?: {
    twitter?: string | null;
    facebook?: string | null;
    instagram?: string | null;
    linkedIn?: string | null;
  };
  verified?: boolean;
  identityCardType?: string;
  identityCardNumber?: string;
  role: typeof UserRole[keyof typeof UserRole];
  getProfileSummary(): string;
  calculateAverageRating(): number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFarmProfile extends Document {
  _id: Types.ObjectId;
  userId: string;
  userProfile: Types.ObjectId | IUserProfile;
  farmName: string;
  farmLocation: {
    region: string;
    district: string;
  };
  nearbyLandmarks?: string[];
  gpsAddress?: string;
  farmSize: number;
  productionScale: typeof ProductionScale[keyof typeof ProductionScale];
  farmImages?: Array<{
    url: string;
    fileName: string;
  }>;
  ownershipStatus: typeof OwnershipStatus[keyof typeof OwnershipStatus];
  fullName: string;
  contactPhone: string;
  contactEmail?: string;
  farmType: typeof FarmType[keyof typeof FarmType];
  cropsGrown?: string[];
  livestockProduced?: string[];
  mixedCropsGrown?: string[];
  aquacultureType?: string[];
  nurseryType?: string[];
  poultryType?: string[];
  othersType?: string[];
  belongsToCooperative: boolean;
  cooperativeName?: string;
  additionalNotes?: string;
  getFullFarmDetails(): string;
  calculateFarmProductivity(): number;
}


export type StoreImage = {
  _id: string;
  url: string;
  itemName: string;
  itemPrice: string;
  available?: boolean;
  currency?: string;
};

export type StoreBranch = {
  _id: string;
  branchName: string;
  branchLocation: string;
  gpsAddress?: string;
  branchPhone: string;
  branchEmail?: string;
};

export interface IStoreProfile extends Document {
  _id: Types.ObjectId;
  userId: string;
  userProfile: Types.ObjectId | IUserProfile;
  storeName: string;
  description?: string;
  branches?: StoreBranch[];
  productionScale: typeof ProductionScale[keyof typeof ProductionScale];
  StoreOwnerShip?: string;
  storeImages?: StoreImage[];
  productSold?: string[];
  belongsToGroup: boolean;
  groupName?: string;
  getFullStoreDetails(): string;
  calculateStoreProductivity(): number;
}

export interface IFarmPostDocument {
  _id: Types.ObjectId;
  userId: string;
  userProfile: IUserProfile;
  FarmProfile: {
    farmName: string;
    farmLocation?: {
      region: string;
      district: string;
    };
    farmSize: string;
    gpsAddress: string;
    productionScale: 'Small' | 'Medium' | 'Commercial';
  };

  product: {
    nameOfProduct: string;
    pricingMethod: string;
    requestPricingDetails: boolean;
    baseStartingPrice: boolean;
    currency: string;
    productPrice?: number;
    pricePerUnit?: number;
    availableQuantity?: string;
    unit?: string;
    availabilityStatus: boolean;
    awaitingHarvest: boolean;
    dateHarvested?: Date;
    quality_grade?: string;
    negotiablePrice: boolean;
    bulk_discount?: string;
    discount: boolean;
    description: string;
  }
  
  useFarmLocation: boolean;
  postLocation?: {
    region: string;
    district: string;
  };

  productImages: Array<{
    url: string;
    fileName?: string;
    file?: File;
  }>;
  
 tags?: { label: string; value: string }[];
  category: {
    name: string;
    id: string;
  };
  subcategory: {
    name: string;
    id: string;
  };
  deliveryAvailable: boolean;
  delivery?: {
    deliveryRequirement: string;
    delivery_cost: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IStorePostDocument {
  _id: Types.ObjectId;
  userId: string;
  userProfile: IUserProfile;
  storeProfile: {
    _id: Types.ObjectId;
    storeName: string;
    description?: string;
    branches?: StoreBranch[];
  };
  storeLocation: {
    region: string;
    district: string;
  };
  product: {
    rentOptions: boolean;
    rentPricing?: number;
    rentUnit?: string;
    negotiable: boolean;
    discount?: boolean;
    bulk_discount?: string;
    rentInfo?: string;
  };
  storeImage: {
    _id: string;
    url: string;
    available: boolean;
    itemName: string;
    itemPrice: string;
    currency?: string;
  };
  delivery?: {
    deliveryAvailable: boolean;
    deliveryRequirement?: string;
    delivery_cost?: string;
  };
  category: {
    name: string;
    id: string;
  };
  subcategory: {
    name: string;
    id: string;
  };
  description: string;
  condition?: string;
  tags?: { label: string; value: string }[];
  GPSLocation?: string;
  ProductSubImages?: Array<{
    url: string;
    fileName?: string;
    file?: File;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

// Enum for wishlist item types
export const WishlistItemType = {
  FarmProduct: 'FarmProduct',
  StoreProduct: 'StoreProduct'
} as const;

// Interface for individual wishlist items
export interface IWishlistItem extends Document {
  _id: Types.ObjectId;
  userId: string;
  itemId: Types.ObjectId;
  itemType: typeof WishlistItemType[keyof typeof WishlistItemType];
  productName: string;
  productImage?: string;
  price?: number;
  currency?: string;
  addedAt: Date;
  inStock: boolean;
  availability?: {
    status: boolean;
    availableQuantity?: string;
    unit?: string;
  };
  notes?: string;
}

// Interface for the wishlist collection
export interface IWishlist extends Document {
  _id: Types.ObjectId;
  userId: string;
  userProfile: Types.ObjectId | IUserProfile;
  items: Types.ObjectId[] | IWishlistItem[];
  createdAt: Date;
  updatedAt: Date;
  
  // Methods
  addItem(item: IWishlistItem): Promise<IWishlist>;
  removeItem(itemId: Types.ObjectId): Promise<IWishlist>;
  clearWishlist(): Promise<IWishlist>;
  getWishlistSummary(): {
    totalItems: number;
    farmProducts: number;
    storeProducts: number;
  };
}

// Request interface for adding an item to wishlist
export interface AddToWishlistRequest {
  userId: string;
  itemId: string;
  itemType: typeof WishlistItemType[keyof typeof WishlistItemType];
  notes?: string;
}

// Response interface for wishlist operations
export interface WishlistResponse {
  success: boolean;
  message: string;
  wishlist?: IWishlist;
  item?: IWishlistItem;
}
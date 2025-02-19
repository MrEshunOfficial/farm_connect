import { IStorePostDocument, IFarmPostDocument } from "@/models/profileI-interfaces";

// Define interface for sanitized wishlist items
export interface ISanitizedStoreWishlistItem {
  _id: string;
  type: 'store';
  storeImage: {
    url: string;
    itemName: string;
    itemPrice: string;
    currency?: string;
  };
  storeProfile: {
    storeName: string;
  };
  storeLocation: {
    region: string;
    district: string;
  };
  delivery?: {
    deliveryAvailable: boolean;
  };
  category: {
    name: string;
  };
  subcategory: {
    name: string;
  };
}

export interface ISanitizedFarmWishlistItem {
  _id: string;
  type: 'farm';
  product: {
    nameOfProduct: string;
    productPrice?: number;
    currency: string;
    availableQuantity?: string;
    unit?: string;
  };
  productImages: Array<{
    url: string;
  }>;
  FarmProfile: {
    farmName: string;
    farmLocation?: {
      region: string;
      district: string;
    };
  };
  postLocation?: {
    region: string;
    district: string;
  };
  delivery?: {
    deliveryAvailable: boolean;
  };
  category: {
    name: string;
  };
  subcategory: {
    name: string;
  };
}

export type ISanitizedWishlistItem = ISanitizedStoreWishlistItem | ISanitizedFarmWishlistItem;

export const sanitizeStoreWishlistItem = (item: IStorePostDocument): ISanitizedStoreWishlistItem => {
  return {
    _id: item._id.toString(),
    type: 'store',
    storeImage: {
      url: item.storeImage.url,
      itemName: item.storeImage.itemName,
      itemPrice: item.storeImage.itemPrice,
      currency: item.storeImage.currency,
    },
    storeProfile: {
      storeName: item.storeProfile.storeName,
    },
    storeLocation: {
      region: item.storeLocation.region,
      district: item.storeLocation.district,
    },
    delivery: item.delivery ? {
      deliveryAvailable: item.delivery.deliveryAvailable,
    } : undefined,
    category: {
      name: item.category.name,
    },
    subcategory: {
      name: item.subcategory.name,
    },
  };
};

export const sanitizeFarmWishlistItem = (item: IFarmPostDocument): ISanitizedFarmWishlistItem => {
  return {
    _id: item._id.toString(),
    type: 'farm',
    product: {
      nameOfProduct: item.product.nameOfProduct,
      productPrice: item.product.productPrice,
      currency: item.product.currency,
      availableQuantity: item.product.availableQuantity,
      unit: item.product.unit,
    },
    productImages: item.productImages.map(img => ({
      url: img.url,
    })),
    FarmProfile: {
      farmName: item.FarmProfile.farmName,
      farmLocation: item.FarmProfile.farmLocation,
    },
    postLocation: item.postLocation,
    delivery: item.delivery ? {
      deliveryAvailable: item.deliveryAvailable,
    } : undefined,
    category: {
      name: item.category.name,
    },
    subcategory: {
      name: item.subcategory.name,
    },
  };
};

export const getWishlistFromStorage = (): ISanitizedWishlistItem[] => {
  try {
    const wishlist = localStorage.getItem('wishlist');
    return wishlist ? JSON.parse(wishlist) : [];
  } catch (error) {
    console.error('Error reading wishlist from storage:', error);
    return [];
  }
};

export const addToWishlist = (item: IStorePostDocument | IFarmPostDocument): void => {
  try {
    const currentWishlist = getWishlistFromStorage();
    const sanitizedItem = 'storeImage' in item 
      ? sanitizeStoreWishlistItem(item as IStorePostDocument)
      : sanitizeFarmWishlistItem(item as IFarmPostDocument);
    
    // Check if item already exists
    if (!currentWishlist.some(wishlistItem => wishlistItem._id === sanitizedItem._id)) {
      const newWishlist = [...currentWishlist, sanitizedItem];
      localStorage.setItem('wishlist', JSON.stringify(newWishlist));
    }
  } catch (error) {
    console.error('Error adding item to wishlist:', error);
  }
};

export const removeFromWishlist = (itemId: string): ISanitizedWishlistItem[] => {
  try {
    const currentWishlist = getWishlistFromStorage();
    const newWishlist = currentWishlist.filter(item => item._id !== itemId);
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
    return newWishlist;
  } catch (error) {
    console.error('Error removing item from wishlist:', error);
    return getWishlistFromStorage();
  }
};

export const clearWishlist = (): void => {
  try {
    localStorage.removeItem('wishlist');
  } catch (error) {
    console.error('Error clearing wishlist:', error);
  }
};

export const isInWishlist = (itemId: string): boolean => {
  try {
    const currentWishlist = getWishlistFromStorage();
    return currentWishlist.some(item => item._id === itemId);
  } catch (error) {
    console.error('Error checking wishlist:', error);
    return false;
  }
};
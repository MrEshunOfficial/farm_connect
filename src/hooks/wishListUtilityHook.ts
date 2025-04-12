import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';
import { IWishlistItem, WishlistItemType, AddToWishlistRequest } from '@/models/profileI-interfaces';
import { AppDispatch, RootState } from '@/store';
import { fetchWishlist, initGuestWishlist, addToWishlist, clearGuestWishlist, addToGuestWishlist, removeFromWishlist, removeFromGuestWishlist, clearWishlist, updateWishlistItem, updateGuestWishlistItem, mergeGuestWishlistToUser } from '@/store/wishList.Slice';

export const useWishlist = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: session } = useSession();
  const isAuthenticated = !!session?.user;
  
  const { wishlistItems, loading, error, summary } = useSelector((state: RootState) => state.wishlist);
  
  // Initialize wishlist based on auth status
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    } else {
      dispatch(initGuestWishlist());
    }
  }, [dispatch, isAuthenticated]);
  
  // Handle migration of guest wishlist to user wishlist after login
  useEffect(() => {
    const migrateGuestWishlistToUser = async () => {
      if (isAuthenticated) {
        const guestWishlist = localStorage.getItem('guestWishlist');
        
        if (guestWishlist) {
          const items: IWishlistItem[] = JSON.parse(guestWishlist);
          
          // Add each guest item to the user's wishlist
          for (const item of items) {
            const wishlistItem: AddToWishlistRequest = {
              userId: session?.user?.id || '',
              itemId: item.itemId.toString(),
              itemType: item.itemType as typeof WishlistItemType[keyof typeof WishlistItemType],
              notes: item.notes || ''
            };
            
            try {
              // Type assertion to allow the additional properties
              const requestWithExtras = {
                ...wishlistItem,
                productName: item.productName,
                productImage: item.productImage,
                price: item.price,
                currency: item.currency
              } as AddToWishlistRequest;
              
              await dispatch(addToWishlist(requestWithExtras)).unwrap();
            } catch (error) {
              console.error('Failed to migrate item to user wishlist', error);
            }
          }
          
          // Clear guest wishlist after migration
          localStorage.removeItem('guestWishlist');
          dispatch(clearGuestWishlist());
        }
      }
    };
    
    migrateGuestWishlistToUser();
  }, [dispatch, isAuthenticated, session?.user?.id]);
  
  // Add item to wishlist
  const addItem = (item: AddToWishlistRequest & Partial<IWishlistItem>) => {
    if (isAuthenticated) {
      return dispatch(addToWishlist(item));
    } else {
      return dispatch(addToGuestWishlist(item as IWishlistItem));
    }
  };
  
  // Remove item from wishlist
  const removeItem = (itemId: string) => {
    if (isAuthenticated) {
      return dispatch(removeFromWishlist(itemId));
    } else {
      return dispatch(removeFromGuestWishlist(itemId));
    }
  };
  
  // Clear all items from wishlist
  const clearItems = () => {
    if (isAuthenticated) {
      return dispatch(clearWishlist());
    } else {
      return dispatch(clearGuestWishlist());
    }
  };
  
  // Update wishlist item
  const updateItem = (itemId: string, updates: Partial<IWishlistItem>) => {
    if (isAuthenticated) {
      return dispatch(updateWishlistItem({ itemId, updates }));
    } else {
      return dispatch(updateGuestWishlistItem({ itemId, updates }));
    }
  };

  // Check if an item exists in the wishlist
  const isItemInWishlist = (itemId: string, itemType: typeof WishlistItemType[keyof typeof WishlistItemType]): boolean => {
    return wishlistItems.some(
      item => item.itemId.toString() === itemId.toString() && item.itemType === itemType
    );
  };

  // Get a specific wishlist item
  const getWishlistItem = (itemId: string, itemType: typeof WishlistItemType[keyof typeof WishlistItemType]): IWishlistItem | undefined => {
    return wishlistItems.find(
      item => item.itemId.toString() === itemId.toString() && item.itemType === itemType
    );
  };

  // Force refresh the wishlist data
  const refreshWishlist = () => {
    if (isAuthenticated) {
      return dispatch(fetchWishlist());
    } else {
      return dispatch(initGuestWishlist());
    }
  };

  // Manually trigger the merge of guest wishlist to user wishlist
  const mergeGuestToUser = async () => {
    if (isAuthenticated) {
      dispatch(mergeGuestWishlistToUser());
      await migrateGuestWishlistToUser();
    }
  };

  // Helper function to migrate guest wishlist to user wishlist
  const migrateGuestWishlistToUser = async () => {
    if (isAuthenticated) {
      const guestWishlist = localStorage.getItem('guestWishlist');
      
      if (guestWishlist) {
        const items: IWishlistItem[] = JSON.parse(guestWishlist);
        
        // Add each guest item to the user's wishlist
        for (const item of items) {
          const wishlistItem: AddToWishlistRequest = {
            userId: session?.user?.id || '',
            itemId: item.itemId.toString(),
            itemType: item.itemType as typeof WishlistItemType[keyof typeof WishlistItemType],
            notes: item.notes || ''
          };
          
          try {
            // Type assertion to allow the additional properties
            const requestWithExtras = {
              ...wishlistItem,
              productName: item.productName,
              productImage: item.productImage,
              price: item.price,
              currency: item.currency
            } as AddToWishlistRequest;
            
            await dispatch(addToWishlist(requestWithExtras)).unwrap();
          } catch (error) {
            console.error('Failed to migrate item to user wishlist', error);
          }
        }
        
        // Clear guest wishlist after migration
        localStorage.removeItem('guestWishlist');
        dispatch(clearGuestWishlist());
      }
    }
  };
  
  return {
    wishlistItems,
    loading,
    error,
    summary,
    isAuthenticated,
    addItem,
    removeItem,
    clearItems,
    updateItem,
    isItemInWishlist,
    getWishlistItem,
    refreshWishlist,
    mergeGuestToUser
  };
};

export default useWishlist;
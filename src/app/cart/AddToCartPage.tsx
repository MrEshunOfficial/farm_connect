import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  Loader2,
  ShoppingCart,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import {
  selectPostsLoading,
  selectPostsError,
  fetchStorePostsParam,
} from "@/store/post.slice";
import { AppDispatch, RootState } from "@/store";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  IFarmPostDocument,
  IStorePostDocument,
} from "@/models/profileI-interfaces";
import { useRouter } from "next/navigation";
import CartProductDetails from "./CartProductDetails";
import { useCart } from "@/hooks/useCartHook";

// Create a new selector to get post by ID and type
const selectPostById = (state: RootState, id?: string, type?: string) => {
  if (!id || !type) return null;

  if (type === "farm") {
    return (
      state.posts.farmPosts.find((post) => post._id.toString() === id) ||
      state.posts.currentFarmPost
    );
  } else if (type === "store") {
    return (
      state.posts.storePosts.find((post) => post._id.toString() === id) ||
      state.posts.currentStorePost
    );
  }

  return null;
};

const AddToCartPage = ({ id, type }: { id: string; type: string }) => {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);

  // Use the cart hook
  const {
    addItem,
    isInCart,
    getItemQuantity,
    isLoading: cartLoading,
  } = useCart();

  const post = useSelector((state: RootState) =>
    selectPostById(
      state,
      typeof id === "string" ? id : undefined,
      typeof type === "string" ? type : undefined
    )
  );
  const loading = useSelector(selectPostsLoading);
  const error = useSelector(selectPostsError);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (id && typeof id === "string" && type) {
      if (type === "farm") {
        const fetchFarmPosts = async () => {
          try {
            const response = await fetch(`/api/postapi/me/farm-post/${id}`);
            if (!response.ok) throw new Error("Failed to fetch post");
            const data = await response.json();
            if (data.success) {
              dispatch({
                type: "posts/setCurrentFarmPost",
                payload: data.data,
              });
            }
          } catch (err) {
            console.error("Error fetching store post:", err);
          }
        };

        fetchFarmPosts();

        return () => {
          dispatch({ type: "posts/setCurrentFarmPost", payload: null });
        };
      } else if (type === "store") {
        dispatch(fetchStorePostsParam({ id }));
      }
    }
  }, [dispatch, id, type]);

  // Set initial quantity if item is already in cart
  useEffect(() => {
    if (post && isInCart(post._id.toString())) {
      const cartQuantity = getItemQuantity(post._id.toString());
      if (cartQuantity > 0) {
        setQuantity(cartQuantity);
      }
    }
  }, [post, isInCart, getItemQuantity]);

  if (!id || !type) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Card className="border-destructive/50 bg-destructive/10 p-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-destructive" />
            <p className="text-destructive font-medium">
              Invalid product ID or type specified
            </p>
          </div>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.push("/")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Home
          </Button>
        </Card>
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (!post) return;

    setIsAdding(true);

    try {
      const isFarm = type === "farm";
      const postTyped = post as IFarmPostDocument | IStorePostDocument;

      // Prepare cart item based on post type
      const cartItem = {
        id: postTyped._id.toString(),
        type: isFarm ? "FarmPost" : "StorePost",
        quantity,
        price: isFarm
          ? parseFloat(
              (postTyped as IFarmPostDocument).product
                .pricePerUnit as unknown as string
            ) || 0
          : parseFloat(
              (postTyped as IStorePostDocument).storeImage.itemPrice
            ) || 0,
        currency: isFarm
          ? (postTyped as IFarmPostDocument).product.currency || "USD"
          : "USD",
        title: isFarm
          ? (postTyped as IFarmPostDocument).product.nameOfProduct
          : (postTyped as IStorePostDocument).storeImage.itemName,
        imageUrl: isFarm
          ? (postTyped as IFarmPostDocument).productImages[0]?.url || ""
          : (postTyped as IStorePostDocument).storeImage.url,
        unit: isFarm
          ? (postTyped as IFarmPostDocument).product.unit
          : undefined,
      };

      await addItem(cartItem);

      setAddSuccess(true);
      setTimeout(() => {
        router.push("/cart");
      }, 1500);
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  if (loading || cartLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Card className="border-destructive/50 bg-destructive/10 p-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-destructive" />
            <p className="text-destructive font-medium">Error: {error}</p>
          </div>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.push("/")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Home
          </Button>
        </Card>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Card className="border-destructive/50 bg-destructive/10 p-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-destructive" />
            <p className="text-destructive font-medium">Product not found</p>
          </div>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.push("/")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Home
          </Button>
        </Card>
      </div>
    );
  }

  const isItemInCart = isInCart(post._id.toString());
  const buttonText = isItemInCart ? "Update Cart" : "Add to Cart";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/50">
          <CardTitle className="text-xl">
            {isItemInCart ? "Update Cart" : "Add to Cart"}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          {addSuccess ? (
            <div className="flex flex-col items-center justify-center py-8">
              <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
              <h2 className="text-xl font-bold mb-2">
                {isItemInCart ? "Cart Updated!" : "Added to Cart!"}
              </h2>
              <p className="text-muted-foreground mb-4">
                Redirecting to your cart...
              </p>
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          ) : (
            <CartProductDetails
              post={post}
              type={type}
              quantity={quantity}
              onQuantityChange={setQuantity}
            />
          )}
        </CardContent>

        {!addSuccess && (
          <CardFooter className="flex justify-between bg-muted/30 px-6 py-4">
            <Button
              variant="outline"
              onClick={() => router.push(`/products/${type}s/${post._id}`)}
            >
              View Details
            </Button>

            <Button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="bg-primary hover:bg-primary/90"
            >
              {isAdding ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isItemInCart ? "Updating..." : "Adding..."}
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {buttonText}
                </>
              )}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default AddToCartPage;

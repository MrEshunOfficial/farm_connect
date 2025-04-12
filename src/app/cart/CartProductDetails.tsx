import React from "react";
import Image from "next/image";
import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  IFarmPostDocument,
  IStorePostDocument,
} from "@/models/profileI-interfaces";
import { useCart } from "@/hooks/useCartHook";

// Extracted product details interface
interface ProductDetailsProps {
  post: IFarmPostDocument | IStorePostDocument;
  type: string;
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
}

const CartProductDetails: React.FC<ProductDetailsProps> = ({
  post,
  type,
  quantity,
  onQuantityChange,
}) => {
  const { isInCart, findCartItemId, updateQuantity } = useCart();

  const isFarm = type === "farm";
  const farmPost = post as IFarmPostDocument;
  const storePost = post as IStorePostDocument;

  const imageUrl = isFarm
    ? farmPost.productImages[0]?.url
    : storePost.storeImage.url;

  const title = isFarm
    ? farmPost.product.nameOfProduct
    : storePost.storeImage.itemName;

  const price = isFarm
    ? `${farmPost.product.currency} ${farmPost.product.pricePerUnit}/${farmPost.product.unit}`
    : `${storePost.storeImage.currency || ""} ${
        storePost.storeImage.itemPrice
      }`;

  const description = isFarm
    ? farmPost.product.description
    : storePost.description;

  const numericPrice = isFarm
    ? parseFloat(farmPost.product.pricePerUnit as unknown as string)
    : parseFloat(storePost.storeImage.itemPrice);

  const totalPrice = numericPrice * quantity;

  const currency = isFarm
    ? farmPost.product.currency
    : storePost.storeImage.currency || "";

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      onQuantityChange(value);

      // If item already in cart, update quantity in the cart state
      if (isInCart(post._id.toString())) {
        const cartItemId = findCartItemId(post._id.toString());
        if (cartItemId) {
          updateQuantity(cartItemId, value);
        }
      }
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      onQuantityChange(newQuantity);

      // If item already in cart, update quantity in the cart state
      if (isInCart(post._id.toString())) {
        const cartItemId = findCartItemId(post._id.toString());
        if (cartItemId) {
          updateQuantity(cartItemId, newQuantity);
        }
      }
    }
  };

  const incrementQuantity = () => {
    const newQuantity = quantity + 1;
    onQuantityChange(newQuantity);

    // If item already in cart, update quantity in the cart state
    if (isInCart(post._id.toString())) {
      const cartItemId = findCartItemId(post._id.toString());
      if (cartItemId) {
        updateQuantity(cartItemId, newQuantity);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="aspect-square relative overflow-hidden rounded-md">
        <Image
          src={imageUrl || "/default-image.jpg"}
          alt={title}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-500 hover:scale-105"
        />
        <Badge
          className={`absolute top-3 left-3 font-medium ${
            isFarm
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isFarm ? "Farm Product" : "Store Product"}
        </Badge>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold capitalize">{title}</h2>

        <p className="text-primary text-xl font-semibold">{price}</p>

        <p className="text-muted-foreground">{description}</p>

        <Separator className="my-4" />

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Quantity</h3>
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
                className="w-16 mx-2 text-center"
              />
              <Button variant="outline" size="icon" onClick={incrementQuantity}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex justify-between mb-2">
              <span>Price per item:</span>
              <span>
                {currency} {numericPrice.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>
                {currency} {totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartProductDetails;

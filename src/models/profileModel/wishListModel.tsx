import mongoose, { Schema, model, models } from "mongoose";
import {
  IWishlistItem,
  WishlistItemType,
  IWishlist,
} from "../profileI-interfaces";

// WishlistItem Schema
const WishlistItemSchema = new Schema<IWishlistItem>({
  userId: { type: String, required: true },
  itemId: { type: Schema.Types.ObjectId, required: true },
  itemType: {
    type: String,
    required: true,
    enum: Object.values(WishlistItemType),
  },
  productName: { type: String, required: true },
  productImage: { type: String },
  price: { type: Number },
  currency: { type: String },
  addedAt: { type: Date, default: Date.now },
  inStock: { type: Boolean, default: true },
  availability: {
    status: { type: Boolean },
    availableQuantity: { type: String },
    unit: { type: String },
  },
  notes: { type: String },
});

// Wishlist Schema
const WishlistSchema = new Schema<IWishlist>(
  {
    userId: { type: String, required: true, unique: true },
    userProfile: {
      type: Schema.Types.ObjectId,
      ref: "UserProfile",
      required: true,
    },
    items: [
      {
        type: Schema.Types.ObjectId,
        ref: "WishlistItem",
      },
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Define methods specified in the interface
WishlistSchema.methods.addItem = async function (
  item: IWishlistItem
): Promise<IWishlist> {
  const WishlistItemModel =
    mongoose.models.WishlistItem ||
    mongoose.model<IWishlistItem>("WishlistItem", WishlistItemSchema);

  // Create the wishlist item
  const newItem = new WishlistItemModel(item);
  await newItem.save();

  // Add to wishlist items array
  this.items.push(newItem._id);
  this.updatedAt = new Date();
  await this.save();

  return this as IWishlist;
};

WishlistSchema.methods.removeItem = async function (
  itemId: mongoose.Types.ObjectId
): Promise<IWishlist> {
  const WishlistItemModel =
    mongoose.models.WishlistItem ||
    mongoose.model<IWishlistItem>("WishlistItem", WishlistItemSchema);

  // Remove the item
  await WishlistItemModel.findByIdAndDelete(itemId);

  // Remove from wishlist items array
  this.items = this.items.filter(
    (item: mongoose.Types.ObjectId) => !item.equals(itemId)
  );
  this.updatedAt = new Date();
  await this.save();

  return this as IWishlist;
};

WishlistSchema.methods.clearWishlist = async function (): Promise<IWishlist> {
  const WishlistItemModel =
    mongoose.models.WishlistItem ||
    mongoose.model<IWishlistItem>("WishlistItem", WishlistItemSchema);

  // Delete all items associated with this wishlist
  await WishlistItemModel.deleteMany({
    _id: { $in: this.items },
  });

  // Clear the items array
  this.items = [];
  this.updatedAt = new Date();
  await this.save();

  return this as IWishlist;
};

WishlistSchema.methods.getWishlistSummary = function () {
  return {
    totalItems: this.items.length,
    farmProducts: this.populated("items")
      ? this.items.filter(
          (item: IWishlistItem) =>
            item.itemType === WishlistItemType.FarmProduct
        ).length
      : 0,
    storeProducts: this.populated("items")
      ? this.items.filter(
          (item: IWishlistItem) =>
            item.itemType === WishlistItemType.StoreProduct
        ).length
      : 0,
  };
};

// Create models with checks to prevent recompilation
export const WishlistItemModel =
  mongoose.models.WishlistItem ||
  model<IWishlistItem>("WishlistItem", WishlistItemSchema);

export const WishlistModel =
  mongoose.models.Wishlist || model<IWishlist>("Wishlist", WishlistSchema);

export default WishlistModel;

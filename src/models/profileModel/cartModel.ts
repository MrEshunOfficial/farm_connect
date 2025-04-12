import mongoose, { Schema, model, Model } from 'mongoose';
import { ICartItem } from '../profileI-interfaces';

// Create the schema
const CartItemSchema = new Schema<ICartItem>(
  {
    userId: {
      type: String,
      required: true,
      trim: true
    },
    id: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      required: true,
      trim: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    title: {
      type: String,
      required: false,
      trim: true
    },
    imageUrl: {
      type: String,
      required: false
    },
    currency: {
      type: String,
      required: false,
      default: 'GHS'
    },
    unit: {
      type: String,
      required: false
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function(doc, ret) {
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Add methods
CartItemSchema.methods.calculateTotal = function() {
  return this.price * this.quantity;
};

// Add indexes for better performance
CartItemSchema.index({ userId: 1 });
CartItemSchema.index({ type: 1 });
CartItemSchema.index({ id: 1, userId: 1 }, { unique: true });

// Create the model
const CartItem = mongoose.models.CartItem || model<ICartItem>('CartItem', CartItemSchema);

export { CartItem };
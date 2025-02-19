import mongoose, { Document, Schema, Types } from 'mongoose';
import validator from 'validator';
import { IStoreProfile, ProductionScale } from '../profileI-interfaces';

// Enhanced Validation Utilities
const validatePhoneNumber = (phoneNumber: string): boolean => {
  const phoneRegex = /^(\+\d{1,3}[- ]?)?\d{10,15}$/;
  return phoneRegex.test(phoneNumber);
};

// StoreProfile Schema
const StoreProfileSchema = new Schema<IStoreProfile>(
  {
    userId: {
      type: String,
      required: true,
      trim: true
    },
    userProfile: {
      type: Schema.Types.ObjectId,
      ref: 'UserProfile',
      required: true,
      index: true
    },
    storeName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500
    },
    branches: [{
      branchName: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100
      },
      branchLocation: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 200
      },
      gpsAddress: {
        type: String,
        trim: true,
        maxlength: 200
      },
      branchPhone: {
        type: String,
        required: true,
        trim: true,
        validate: {
          validator: validatePhoneNumber,
          message: 'Invalid phone number format'
        }
      },
      branchEmail: {
        type: String,
        trim: true,
        validate: {
          validator: (v: string) => !v || validator.isEmail(v),
          message: 'Invalid email address'
        }
      }
    }],
  
    productionScale: {
      type: String,
      required: true,
      enum: Object.values(ProductionScale)
    },
    StoreOwnerShip: {
      type: String,
    },
    storeImages: [{
      url: {
        type: String,
        validate: {
          validator: function(v: string) {
            return validator.isURL(v) || 
                   /^data:image\/(png|jpeg|jpg|gif|webp);base64,/.test(v);
          },
          message: 'Invalid image URL or base64 image'
        }
      },
      itemName: {
        type: String,
        required: [true, 'Item name is required'],
        minlength: 1,
        maxlength: 100
      },
      itemPrice: {
        type: String,
        required: [true, 'Item price is required'],
        minlength: 1,
        maxlength: 100
      },
      available: {
        type: Boolean,
        default: true
      },
      currency: {
        type: String,
        trim: true,
      },
    }],
    productSold: [{
      type: String,
      trim: true,
      maxlength: 100
    }],
    belongsToGroup: {
      type: Boolean,
      required: true
    },
   
    groupName: {
      type: String,
      trim: true,
      maxlength: 100
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

// Add methods to StoreProfile Schema
StoreProfileSchema.methods.getFullStoreDetails = function() {
  return `${this.storeName} - ${this.productSold?.[0] || 'No main product'}`;
};

StoreProfileSchema.methods.calculateStoreProductivity = function(this: IStoreProfile) {
  const scaleFactor: Record<typeof ProductionScale[keyof typeof ProductionScale], number> = {
    'Small': 1,
    'Medium': 1.5,
    'Commercial': 2
  };
  
  const baseProductivity = scaleFactor[this.productionScale] || 1;
  const productCount = this.productSold ? this.productSold.length + 1 : 1;
  
  return Number((baseProductivity * productCount).toFixed(2));
};

// Indexes for performance and query optimization
StoreProfileSchema.index({ userProfile: 1 });
StoreProfileSchema.index({ storeName: 1, productionScale: 1 });

export { StoreProfileSchema };
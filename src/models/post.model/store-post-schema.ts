import mongoose, { Schema, model } from 'mongoose';
import { IStorePostDocument } from '../profileI-interfaces';

// Store Post Schema
const StorePostSchema = new Schema({
  userId: {
    type: String,
    required: true,
    trim: true
  },
  
  userProfile: {
    type: Schema.Types.ObjectId,
    ref: 'UserProfile',
    required: true
  },

  storeProfile: {
    type: Schema.Types.ObjectId,
    ref: 'StoreProfile',
    required: true,
    index: true
  },
 
  storeLocation: {
    region: {
      type: String,
      required: true
    },
    district: {
      type: String,
      required: true
    }
  },
  product: {
    rentOptions: {
      type: Boolean,
      required: true
    },
    rentPricing: {
      type: Number,
      required: false
    },
    rentUnit: {
      type: String,
      required: false
    },
    negotiable: {
      type: Boolean,
      required: true
    },
    discount: {
      type: Boolean,
      required: true
    },
    bulk_discount: {
      type: String,
      required: false
    },
    rentInfo: {
      type: String,
      required: false
    }
  },
  storeImage: {
    _id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    available: {
      type: Boolean,
      required: true
    },
    itemName: {
      type: String,
      required: true
    },
    itemPrice: {
      type: String,
      required: true
    },
    currency: {
      type: String,
      required: false
    }
  },
  delivery: {
    deliveryAvailable: {
      type: Boolean,
      required: false
    },
    deliveryRequirement: {
      type: String,
      required: false
    },
    delivery_cost: {
      type: String,
      required: false
    }
  },
  category: {
    name: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    }
  },
  subcategory: {
    name: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    }
  },
  
  description: {
    type: String,
    required: true
  },
  GPSLocation: {
    type: String,
    required: false
  },
  condition: {
    type: String,
    required: false,
  },
  tags: [
    {
    label: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    }
   }
  ],
  ProductSubImages: [{
    url: {
      type: String,
      required: true
    },
    fileName: {
      type: String,
      required: false
    },
    file: {
      type: Schema.Types.Mixed,
      required: false
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

// Add indexes
StorePostSchema.index({ 'userProfile': 1 });
StorePostSchema.index({ 'storeProfile': 1 });

// Check if model exists before creating it
export const StorePost = mongoose.models.StorePost || model<IStorePostDocument>('StorePost', StorePostSchema);
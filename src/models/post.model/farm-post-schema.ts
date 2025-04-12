import mongoose, { Schema, model } from 'mongoose';
import { IFarmPostDocument } from '../profileI-interfaces';

// Farm Post Schema
const FarmPostSchema = new Schema({
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
  FarmProfile: {
    farmName: {
      type: String,
      required: true,
      trim: true
    },
    farmLocation: {
      region: {
        type: String,
        required: true
      },
      district: {
        type: String,
        required: true
      },
    },
    farmSize: {
      type: String,
      required: true
    },
    gpsAddress: {
      type: String,
      required: true
    },
    productionScale: {
      type: String,
      required: true,
      enum: ['Small', 'Medium', 'Commercial']
    }
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
  product: {
    nameOfProduct: {
      type: String,
      required: true
    },
    pricingMethod: {
      type: String,
      required: true
    },
    productPrice: {
      type: Number,
      required: false,
    },
    requestPricingDetails: {
      type: Boolean,
      required: true
    },
    baseStartingPrice: {
      type: Boolean,
      required: true
    },
    currency: {
      type: String,
      required: true
    },
    pricePerUnit: {
      type: Number,
      required: false
    },
    availableQuantity: {
      type: String,
      required: false
    },
    unit: {
      type: String,
      required: false
    },
    availabilityStatus: {
      type: Boolean,
      required: true
    },
    awaitingHarvest: {
      type: Boolean,
      required: true
    },
    dateHarvested: Date,
    quality_grade: String,
    negotiablePrice: {
      type: Boolean,
      required: true
    },
    bulk_discount: String,
    discount: {
      type: Boolean,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  },
  postLocation: {
    region: {
      type: String,
      required: false
    },
    district: {
      type: String,
      required: false
    },
  },
  productImages: [{
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
  }],
  useFarmLocation: {
    type: Boolean,
    required: true
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
  deliveryAvailable: {
    type: Boolean,
    required: true
  },
  delivery: {
    deliveryRequirement: {
      type: String,
      required: false
    },
    delivery_cost: {
      type: String,
      required: false
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

// Add index
FarmPostSchema.index({ 'userProfile': 1 });

// Check if model exists before creating it
export const FarmPost = mongoose.models.FarmPost || model<IFarmPostDocument>('FarmPost', FarmPostSchema);
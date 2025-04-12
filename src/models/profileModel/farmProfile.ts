import { Schema } from 'mongoose';
import validator from 'validator';
import { FarmType, IFarmProfile, OwnershipStatus, ProductionScale } from '../profileI-interfaces';

// Enhanced Validation Utilities
const validatePhoneNumber = (phoneNumber: string): boolean => {
  const phoneRegex = /^(\+\d{1,3}[- ]?)?\d{10,15}$/;
  return phoneRegex.test(phoneNumber);
};

// Farm Profile Schema
const FarmProfileSchema = new Schema<IFarmProfile>(
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
    farmName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100
    },
    farmLocation: {
      region: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 200
      },
      district: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 200
      }
    },
    nearbyLandmarks: [{
      type: String,
      trim: true,
      maxlength: 100
    }],
    gpsAddress: {
      type: String,
      trim: true,
      maxlength: 200
    },
    farmSize: {
      type: Number,
      required: true,
      min: [0, 'Farm size cannot be negative'],
      max: [10000, 'Farm size seems unrealistically large']
    },
    productionScale: {
      type: String,
      required: true,
      enum: Object.values(ProductionScale)
    },
    farmImages: [{
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
      fileName: {
        type: String,
        required: [true, 'File name is required'],
        minlength: 1,
        maxlength: 255
      }
    }],
    ownershipStatus: {
      type: String,
      required: true,
      enum: Object.values(OwnershipStatus)
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50
    },
    contactPhone: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: validatePhoneNumber,
        message: 'Invalid contact phone number'
      }
    },
    contactEmail: {
      type: String,
      trim: true,
      validate: {
        validator: (v: string) => !v || validator.isEmail(v),
        message: 'Invalid email address'
      }
    },
    farmType: {
      type: String,
      required: true,
      enum: Object.values(FarmType)
    },
    cropsGrown: [{
      type: String,
      trim: true,
      maxlength: 100
    }],
    livestockProduced: [{
      type: String,
      trim: true,
      maxlength: 100
    }],
    mixedCropsGrown: [{
      type: String,
      trim: true,
      maxlength: 100
    }],
    aquacultureType: [{
      type: String,
      trim: true,
      maxlength: 100
    }],
    nurseryType: [{
      type: String,
      trim: true,
      maxlength: 100
    }],
    poultryType: [{
      type: String,
      trim: true,
      maxlength: 100
    }],
    othersType: [{
      type: String,
      trim: true,
      maxlength: 100
    }],
    belongsToCooperative: {
      type: Boolean,
      required: true
    },
    cooperativeName: {
      type: String,
      trim: true,
      maxlength: 100
    },
    additionalNotes: {
      type: String,
      trim: true,
      maxlength: 500
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

// Add methods to FarmProfile Schema
FarmProfileSchema.methods.getFullFarmDetails = function() {
  return `${this.farmName} - ${this.farmType} (${this.farmSize} acres)`;
};

FarmProfileSchema.methods.calculateFarmProductivity = function() {
  const baseProductivity = this.farmSize * (this.productionScale === 'Commercial' ? 1.5 : 1);
  return Number(baseProductivity.toFixed(2));
};

// Indexes for performance and query optimization
FarmProfileSchema.index({ farmType: 1, productionScale: 1 });
FarmProfileSchema.index({ userProfile: 1 });

export { FarmProfileSchema };
import { Schema } from 'mongoose';
import validator from 'validator';
import { Gender, IUserProfile, UserRole } from '../profileI-interfaces';

// Enhanced Validation Utilities
const validatePhoneNumber = (phoneNumber: string): boolean => {
  const phoneRegex = /^(\+\d{1,3}[- ]?)?\d{10,15}$/;
  return phoneRegex.test(phoneNumber);
};

const validateSocialMediaLink = (link: string | null): boolean => {
  if (!link) return true;
  return validator.isURL(link, {
    protocols: ['http', 'https'],
    require_protocol: true
  });
};

// User Profile Schema
const UserProfileSchema = new Schema<IUserProfile>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (v: string) => validator.isEmail(v),
        message: 'Invalid email address'
      }
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30
    },
    profilePicture: {
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
    },
    bio: {
      type: String,
      maxlength: 500,
      trim: true
    },
    gender: {
      type: String,
      enum: Object.values(Gender),
      required: true
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: validatePhoneNumber,
        message: 'Invalid phone number format'
      }
    },
    country: {
      type: String,
      required: true,
      trim: true
    },
    socialMediaLinks: {
      twitter: { 
        type: String, 
        trim: true, 
        validate: {
          validator: validateSocialMediaLink,
          message: 'Invalid Twitter URL'
        },
        default: null 
      },
      facebook: { 
        type: String, 
        trim: true, 
        validate: {
          validator: validateSocialMediaLink,
          message: 'Invalid Facebook URL'
        },
        default: null 
      },
      instagram: { 
        type: String, 
        trim: true, 
        validate: {
          validator: validateSocialMediaLink,
          message: 'Invalid Instagram URL'
        },
        default: null 
      },
      linkedIn: { 
        type: String, 
        trim: true, 
        validate: {
          validator: validateSocialMediaLink,
          message: 'Invalid LinkedIn URL'
        },
        default: null 
      }
    },
    identityCardType: {
      type: String,
      enum: ['Passport', 'Driver License', 'National ID', 'Other'],
      trim: true
    },
    identityCardNumber: {
      type: String,
      trim: true,
      validate: {
        validator: function(v: string) {
          return !v || (v.length >= 6 && v.length <= 20);
        },
        message: 'Invalid identity card number'
      }
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: true
    },
    verified: {
      type: Boolean,
      default: false
    },
   
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

// Add methods to UserProfile Schema
UserProfileSchema.methods.calculateAverageRating = function() {
  if (!this.ratings || this.ratings.length === 0) return 0;
  
  const totalRating = this.ratings.reduce((sum: any, rating: { farmer_rating: any; }) => sum + rating.farmer_rating, 0);
  return Number((totalRating / this.ratings.length).toFixed(2));
};

UserProfileSchema.methods.getProfileSummary = function() {
  return `${this.fullName} (${this.role}) - ${this.country}`;
};

// Middleware to handle social media links
UserProfileSchema.pre('save', function(next) {
  const profile = this;
  if (profile.socialMediaLinks) {
    const links = profile.socialMediaLinks;
    Object.keys(links).forEach(key => {
      if (links[key as keyof typeof links] === '') {
        links[key as keyof typeof links] = null;
      }
    });
  }
  next();
});

// Indexes for performance and query optimization
UserProfileSchema.index({ email: 1, verified: 1 });
UserProfileSchema.index({ role: 1, country: 1 });

export { UserProfileSchema };
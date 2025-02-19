import mongoose, { Schema, Document } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

export interface UserDocument extends Document {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  providerId?: string;
  provider?: string;
  isOAuthUser: () => boolean;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
  logState: () => void;
}

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Invalid email address'],
  },
  password: {
    type: String,
    required: function(this: UserDocument) {
      // Password is required only for non-OAuth users
      const isOAuth = !!this.providerId && !!this.provider;
      console.log('Password required check:', { isOAuth, providerId: this.providerId, provider: this.provider });
      return !isOAuth;
    },
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false, // Don't include password by default
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  providerId: {
    type: String,
    default: null,
  },
  provider: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save middleware
userSchema.pre('save', async function(next) {
  try {
    // Only hash password if it's been modified (or is new) and exists
    if (this.isModified('password') && this.password) {
      const salt = await bcrypt.genSalt(12);
      this.password = await bcrypt.hash(this.password, salt);
    }

    // Update the updatedAt timestamp
    this.updatedAt = new Date();
    
    next();
  } catch (error: unknown) {
    if (error instanceof Error) {
      next(error);
    } else {
      next(new Error('Unknown error occurred'));
    }
  }
  
});

// Method to check if user is OAuth authenticated
userSchema.methods.isOAuthUser = function() {
  const isOAuth = Boolean(this.providerId && this.provider);
  return isOAuth;
};

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword: string) {
  try {
    // Get the password field directly (because of select: false)
    const userPassword = this.get('password', null, { getters: false });
    
    if (!userPassword) {
      return false;
    }
    
    const isMatch = await bcrypt.compare(candidatePassword, userPassword);
    
    return isMatch;
  } catch (error) {
    return false;
  }
};

// Middleware to handle password field selection
userSchema.pre('findOne', function() {
  // Only include password field if explicitly asked for
  if (this.getOptions().passwordRequired) {
    this.select('+password');
  }
});

// Create or get the User model
export const User = mongoose.models.User || mongoose.model<UserDocument>('User', userSchema);

// Add type safety for model options
declare module 'mongoose' {
  interface QueryOptions {
    passwordRequired?: boolean;
  }
}
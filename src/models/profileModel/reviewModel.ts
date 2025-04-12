import mongoose, { Schema, model, Model } from 'mongoose';
import { IReview } from '../profileI-interfaces';

// Create the schema
const UserReviewSchema = new Schema<IReview>(
  {
    userId: {
      type: String,
      required: true,
      trim: true
    },
    recipientId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'UserProfile'
    },
    authorName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    reviewerAvatar: {
      type: String,
      required: false
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },
    helpful: {
      type: Number,
      required: true,
      default: 0
    },
    role: {
      type: String,
      required: true,
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

UserReviewSchema.methods.calculateAverageRating = function() {
  if (!this.rating) return 0;
  return this.rating;
};

UserReviewSchema.index({ userId: 1 });
UserReviewSchema.index({ recipientId: 1 });
UserReviewSchema.index({ rating: -1 });

const UserReview = mongoose.models.UserReview || model<IReview>('UserReview', UserReviewSchema);

export { UserReview };
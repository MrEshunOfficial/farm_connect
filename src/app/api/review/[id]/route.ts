//api/review/[id]/route.ts
import { auth } from '@/auth';
import { connect } from '@/hooks/dbconfigue/dbConfigue';
import { NextRequest, NextResponse } from 'next/server';
import { UserProfile } from '@/models/profileModel/userProfileModel';
import { Types } from 'mongoose';
import { UserReview } from '@/models/profileModel/reviewModel';

// Connect to the database
connect();

// Helper function to validate authenticated user
async function validateAuthenticatedUser() {
  const session = await auth();
  if (!session?.user?.email || !session?.user?.id) {
    throw new Error('Not authenticated');
  }
  return session.user;
}

// Helper to validate ObjectId
function isValidObjectId(id: string): boolean {
  return Types.ObjectId.isValid(id);
}

// GET /api/review/[id] - Get a specific review
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid review ID format' },
        { status: 400 }
      );
    }

    const review = await UserReview.findById(id)
      .populate({
        path: 'recipientId',
        model: UserProfile,
        select: '_id fullName profilePicture verified'
      });

    if (!review) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: review }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching review:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PATCH /api/review/[id] - Update a review (only by its author)
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await validateAuthenticatedUser();
    const { id } = await context.params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid review ID format' },
        { status: 400 }
      );
    }

    const review = await UserReview.findById(id);
    if (!review) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      );
    }

    // Verify the user is the author of the review
    if (review.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Not authorized to update this review' },
        { status: 403 }
      );
    }

    const data = await request.json();
    const { rating, content } = data;

    // Validate the update data
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    if (content !== undefined && content.length > 500) {
      return NextResponse.json(
        { success: false, error: 'Content cannot exceed 500 characters' },
        { status: 400 }
      );
    }

    // Update the review
    const updatedReview = await UserReview.findByIdAndUpdate(
      id,
      { $set: { rating, content } },
      { new: true }
    ).populate({
      path: 'recipientId',
      model: UserProfile,
      select: '_id fullName profilePicture verified'
    });

    return NextResponse.json(
      { success: true, data: updatedReview },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message === 'Not authenticated' ? 401 : 500 }
    );
  }
}

// DELETE /api/review/[id] - Delete a review (only by its author)
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await validateAuthenticatedUser();
    const { id } = await context.params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid review ID format' },
        { status: 400 }
      );
    }

    const review = await UserReview.findById(id);
    if (!review) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      );
    }

    // Verify the user is the author of the review
    if (review.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Not authorized to delete this review' },
        { status: 403 }
      );
    }

    // Delete the review
    await UserReview.findByIdAndDelete(id);

    return NextResponse.json(
      { success: true, message: 'Review deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message === 'Not authenticated' ? 401 : 500 }
    );
  }
}
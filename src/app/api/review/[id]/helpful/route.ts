// api/review/[id]/helpful/route.ts
import { auth } from '@/auth';
import { connect } from '@/hooks/dbconfigue/dbConfigue';
import { NextRequest, NextResponse } from 'next/server';
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

// PATCH /api/review/[id]/helpful - Mark a review as helpful
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await validateAuthenticatedUser();
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

    // Increment the helpful count
    const updatedReview = await UserReview.findByIdAndUpdate(
      id,
      { $inc: { helpful: 1 } },
      { new: true }
    );

    return NextResponse.json(
      { success: true, data: updatedReview },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error marking review as helpful:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message === 'Not authenticated' ? 401 : 500 }
    );
  }
}
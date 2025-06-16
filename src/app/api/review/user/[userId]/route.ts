// api/review/user/[userId]/route.ts
import { connect } from '@/hooks/dbconfigue/dbConfigue';
import { NextRequest, NextResponse } from 'next/server';
import { UserProfile } from '@/models/profileModel/userProfileModel';
import { Types } from 'mongoose';
import { UserReview } from '@/models/profileModel/reviewModel';

// Connect to the database
connect();

// Helper to validate ObjectId
function isValidObjectId(id: string): boolean {
  return Types.ObjectId.isValid(id);
}

// GET /api/review/user/[userId] - Get all reviews for a specific user
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await context.params;
   
    if (!isValidObjectId(userId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid user ID format' },
        { status: 400 }
      );
    }
   
    // Get pagination parameters from URL
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // First find the user profile to confirm it exists
    const userProfile = await UserProfile.findById(userId);
   
    if (!userProfile) {
      return NextResponse.json(
        { success: false, error: 'User profile not found' },
        { status: 404 }
      );
    }

    // Query with pagination and population - Find reviews where this user is the recipient
    const userReviews = await UserReview.find({ recipientId: userId })
      .populate({
        path: 'userId',
        model: UserProfile,
        select: '_id fullName profilePicture verified'
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const totalDocs = await UserReview.countDocuments({ recipientId: userId });
    const totalPages = Math.ceil(totalDocs / limit);
    const pagination = {
      page,
      limit,
      totalDocs,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    };

    return NextResponse.json({
      success: true,
      data: userReviews,
      pagination
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching reviews for user:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
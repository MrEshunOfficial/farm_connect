import { auth } from '@/auth';
import { connect } from '@/hooks/dbconfigue/dbConfigue';
import { NextRequest, NextResponse } from 'next/server';
import { UserProfile } from '@/models/profileModel/userProfileModel';
import { UserReview } from '@/models/profileModel/reviewModel'; // Updated import

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

// GET /api/review/me - Get all reviews ABOUT the current user
export async function GET(request: NextRequest) {
  try {
    const user = await validateAuthenticatedUser();
    
    // Get pagination parameters from URL
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // First, find user's profile
    const userProfile = await UserProfile.findOne({ userId: user.id });
    
    if (!userProfile) {
      return NextResponse.json(
        { success: false, error: 'User profile not found' },
        { status: 404 }
      );
    }

    const userReviews = await UserReview.find({ recipientId: userProfile._id })
      .populate({
        path: 'userId',
        model: UserProfile,
        select: '_id fullName profilePicture role verified'
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const totalDocs = await UserReview.countDocuments({ recipientId: userProfile._id });
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
    console.error('Error fetching reviews about user:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message === 'Not authenticated' ? 401 : 500 }
    );
  }
}

// POST /api/review/me - Create a new review
export async function POST(request: NextRequest) {
  try {
    const user = await validateAuthenticatedUser();
    
    // First, find the user's profile
    const userProfileDoc = await UserProfile.findOne({ userId: user.id });

    if (!userProfileDoc) {
      return NextResponse.json(
        { success: false, error: 'User profile not found' },
        { status: 404 }
      );
    }

    const data = await request.json();
    const { recipientId, rating, content, role } = data;

    // Validate required fields
    if (!recipientId || !rating || !content || !role) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Validate content length
    if (content.length > 500) {
      return NextResponse.json(
        { success: false, error: 'Content cannot exceed 500 characters' },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ['Farmer', 'Seller', 'Buyer', 'Both'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { success: false, error: 'Invalid role' },
        { status: 400 }
      );
    }

    // Check if recipient exists
    const recipientProfile = await UserProfile.findById(recipientId);
    if (!recipientProfile) {
      return NextResponse.json(
        { success: false, error: 'Recipient profile not found' },
        { status: 404 }
      );
    }

    // Prevent reviewing yourself
    if (recipientProfile.userId === user.id) {
      return NextResponse.json(
        { success: false, error: 'Cannot review yourself' },
        { status: 400 }
      );
    }

    // Create new review
    const newReview = new UserReview({
      userId: user.id,
      recipientId: recipientId,
      authorName: userProfileDoc.fullName,
      reviewerAvatar: userProfileDoc.profilePicture?.url || '',
      rating,
      content,
      helpful: 0,
      role
    });

    // Save the review
    await newReview.save();

    // Return populated review
    const populatedReview = await UserReview.findById(newReview._id)
      .populate({
        path: 'recipientId',
        model: UserProfile,
        select: '_id fullName profilePicture verified'
      });

    return NextResponse.json(
      { success: true, data: populatedReview },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message === 'Not authenticated' ? 401 : 500 }
    );
  }
}

// GET /api/review/posted - Get all reviews posted BY the current user
// export async function GET(request: NextRequest) {
//   try {
//     const user = await validateAuthenticatedUser();
    
//     // Get pagination parameters from URL
//     const searchParams = request.nextUrl.searchParams;
//     const page = parseInt(searchParams.get('page') || '1');
//     const limit = parseInt(searchParams.get('limit') || '10');
//     const skip = (page - 1) * limit;

//     // Query with pagination and population
//     const userReviews = await UserReview.find({ userId: user.id })
//       .populate({
//         path: 'recipientId',
//         model: UserProfile,
//         select: '_id fullName profilePicture verified'
//       })
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit);

//     // Get total count for pagination
//     const totalDocs = await UserReview.countDocuments({ userId: user.id });
//     const totalPages = Math.ceil(totalDocs / limit);

//     const pagination = {
//       page,
//       limit,
//       totalDocs,
//       totalPages,
//       hasNextPage: page < totalPages,
//       hasPrevPage: page > 1
//     };

//     return NextResponse.json({
//       success: true,
//       data: userReviews,
//       pagination
//     }, { status: 200 });

//   } catch (error: any) {
//     console.error('Error fetching reviews posted by user:', error);
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: error.message === 'Not authenticated' ? 401 : 500 }
//     );
//   }
// }
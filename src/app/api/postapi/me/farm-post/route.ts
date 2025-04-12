import { auth } from '@/auth';
import { connect } from '@/hooks/dbconfigue/dbConfigue';
import { FarmPost } from '@/models/post.model/farm-post-schema';
import { IFarmPostDocument } from '@/models/profileI-interfaces';
import { UserProfile } from '@/models/profileModel/userProfileModel';
import { NextRequest, NextResponse } from 'next/server';

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

// POST method to create a new farm post
export async function POST(req: NextRequest) {
  try {
    // Validate user authentication
    const user = await validateAuthenticatedUser();

    // Parse request body
    const postData: Partial<IFarmPostDocument> = await req.json();

    // Find user profile
    const userProfile = await UserProfile.findOne({ userId: user.id });
    if (!userProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    // Create new farm post
    const newFarmPost = new FarmPost({
      ...postData,
      userId: user.id,
      userProfile: userProfile._id,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Save the post
    await newFarmPost.save();

    return NextResponse.json(newFarmPost, { status: 201 });
  } catch (error) {
    console.error('Error creating farm post:', error);
    
    if (error instanceof Error && error.message === 'Not authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to create farm post' 
    }, { status: 500 });
  }
}

// GET method to retrieve farm posts
export async function GET(req: NextRequest) {
  try {
    // Validate user authentication
    const user = await validateAuthenticatedUser();

    // Parse query parameters
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Fetch farm posts for the authenticated user
    const farmPosts = await FarmPost.find({ userId: user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userProfile', 'fullName username');

    // Count total posts
    const totalPosts = await FarmPost.countDocuments({ userId: user.id });

    return NextResponse.json({
      posts: farmPosts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts
    });
  } catch (error) {
    console.error('Error fetching farm posts:', error);
    
    if (error instanceof Error && error.message === 'Not authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch farm posts' 
    }, { status: 500 });
  }
}
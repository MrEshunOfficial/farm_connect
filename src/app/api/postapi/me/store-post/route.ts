import { auth } from '@/auth';
import { connect } from '@/hooks/dbconfigue/dbConfigue';
import { NextRequest, NextResponse } from 'next/server';
import { StoreProfile, UserProfile } from '@/models/profileModel/userProfileModel';
import { StorePost } from '@/models/post.model/store-post-schema';

// Helper function to validate authenticated user
async function validateAuthenticatedUser() {
  const session = await auth();
  if (!session?.user?.email || !session?.user?.id) {
    throw new Error('Not authenticated');
  }
  return session.user;
}

// Connect to the database
connect();

// POST /api/postapi/me/store-post
export async function POST(request: NextRequest) {
  try {
    const user = await validateAuthenticatedUser();
    
    // First, find the user's profiles
    const userProfileDoc = await UserProfile.findOne({ userId: user.id });
    const storeProfileDoc = await StoreProfile.findOne({ userId: user.id });

    if (!userProfileDoc || !storeProfileDoc) {
      return NextResponse.json(
        { 
          success: false, 
          error: !userProfileDoc 
            ? 'User profile not found' 
            : 'Store profile not found' 
        },
        { status: 404 }
      );
    }

    const formData = await request.formData();
    const postDataStr = formData.get('postData');
    if (!postDataStr || typeof postDataStr !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Missing or invalid post data' },
        { status: 400 }
      );
    }

    const postData = JSON.parse(postDataStr);

    // Handle image processing
    const images = formData.getAll('images');
    const imageDataArray = [];

    for (let i = 0; i < images.length; i++) {
      const imageDataStr = formData.get(`imageData${i}`);
      
      if (!imageDataStr || typeof imageDataStr !== 'string') {
        continue;
      }

      const imageData = JSON.parse(imageDataStr);
      if (!imageData.url) {
        continue;
      }

      imageDataArray.push({
        url: imageData.url,
        fileName: imageData.fileName,
        file: images[i]
      });
    }

    // Create new store post with proper population structure
    const newStorePost = new StorePost({
      userId: user.id,
      userProfile: userProfileDoc._id,
      storeProfile: storeProfileDoc._id,
      ...postData,
      ProductSubImages: imageDataArray
    });

    // Save the post
    await newStorePost.save();

    // Rest of your code remains the same...
    const populatedPost = await StorePost.findById(newStorePost._id)
      .populate({
        path: 'userProfile',
        model: UserProfile,
        select: '_id email fullName phoneNumber profilePicture country verified'
      })
      .populate({
        path: 'storeProfile',
        model: StoreProfile,
        select: 'storeName description branches'
      });

    if (!populatedPost) {
      throw new Error('Failed to populate store post');
    }

    return NextResponse.json({ success: true, data: populatedPost }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating store post:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message === 'Not authenticated' ? 401 : 500 }
    );
  }
}

// GET /api/postapi/me/store-post
export async function GET(request: NextRequest) {
  try {
    const user = await validateAuthenticatedUser();
    
    // Get pagination parameters from URL
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Query with pagination and population
    const storePosts = await StorePost.find({ userId: user.id })
      .populate({
        path: 'userProfile',
        select: 'email fullName phoneNumber profilePicture country verified'
      })
      .populate({
        path: 'storeProfile',
        select: 'storeName description branches'
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const totalDocs = await StorePost.countDocuments({ userId: user.id });
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
      data: storePosts,
      pagination
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching store posts:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.message === 'Not authenticated' ? 401 : 500 }
    );
  }
}

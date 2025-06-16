// src/app/api/store-profile/[userId]/route.ts
import { connect } from '@/hooks/dbconfigue/dbConfigue';
import { NextRequest, NextResponse } from 'next/server';
import { StoreProfile, UserProfile } from '@/models/profileModel/userProfileModel';
import { isValidObjectId } from 'mongoose';

interface StoreRouteParams {
  params: Promise<{ userId: string }>;
}

interface PopulatedStoreProfile {
  userProfile: {
    userId: string;
    fullName: string;
    email: string;
    username?: string;
    phoneNumber?: string;
    country?: string;
    role: string;
    verified: boolean;
    profilePicture?: string;
  };
  [key: string]: any;
}

async function connectToDatabase(): Promise<NextResponse | null> {
  try {
    await connect();
    return null;
  } catch (error) {
    console.error('Database connection failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Database connection failed'
      },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  context: StoreRouteParams
): Promise<NextResponse> {
  const connectionError = await connectToDatabase();
  if (connectionError) return connectionError;

  try {
    const { userId } = await context.params;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'User ID is required'
        },
        { status: 400 }
      );
    }

    // Validate userId format if it's expected to be an ObjectId
    if (!isValidObjectId(userId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid user ID format'
        },
        { status: 400 }
      );
    }

    // Find store profile by userId instead of _id
    const storeProfile = await StoreProfile.findOne({ userId })
      .populate({
        path: 'userProfile',
        model: UserProfile,
        select: 'userId fullName email username phoneNumber country role verified profilePicture'
      })
      .lean<PopulatedStoreProfile>();

    if (!storeProfile) {
      return NextResponse.json(
        {
          success: false,
          error: 'Store profile not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: storeProfile
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Store profile fetch error:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch store profile';
    
    return NextResponse.json(
      {
        success: false,
        error: message
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: StoreRouteParams
): Promise<NextResponse> {
  const connectionError = await connectToDatabase();
  if (connectionError) return connectionError;

  try {
    const { userId } = await context.params;

    if (!userId || !isValidObjectId(userId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Valid user ID is required'
        },
        { status: 400 }
      );
    }

    const updateData = await req.json();

    const updatedStoreProfile = await StoreProfile.findOneAndUpdate(
      { userId },
      updateData,
      { new: true, runValidators: true }
    )
    .populate({
      path: 'userProfile',
      model: UserProfile,
      select: 'userId fullName email username phoneNumber country role verified profilePicture'
    })
    .lean<PopulatedStoreProfile>();

    if (!updatedStoreProfile) {
      return NextResponse.json(
        {
          success: false,
          error: 'Store profile not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: updatedStoreProfile
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Store profile update error:', error);
    const message = error instanceof Error ? error.message : 'Failed to update store profile';
    
    return NextResponse.json(
      {
        success: false,
        error: message
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: StoreRouteParams
): Promise<NextResponse> {
  const connectionError = await connectToDatabase();
  if (connectionError) return connectionError;

  try {
    const { userId } = await context.params;

    if (!userId || !isValidObjectId(userId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Valid user ID is required'
        },
        { status: 400 }
      );
    }

    const deletedStoreProfile = await StoreProfile.findOneAndDelete({ userId });

    if (!deletedStoreProfile) {
      return NextResponse.json(
        {
          success: false,
          error: 'Store profile not found'
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Store profile deleted successfully'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Store profile delete error:', error);
    const message = error instanceof Error ? error.message : 'Failed to delete store profile';
    
    return NextResponse.json(
      {
        success: false,
        error: message
      },
      { status: 500 }
    );
  }
}
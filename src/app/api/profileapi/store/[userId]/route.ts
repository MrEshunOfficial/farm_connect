import { connect } from '@/hooks/dbconfigue/dbConfigue';
import { NextRequest, NextResponse } from 'next/server';
import { StoreProfile, UserProfile } from '@/models/profileModel/userProfileModel';

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
): Promise<NextResponse> {
  try {
    await connect();
    const { userId } = params;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'User ID is required'
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
      });

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

  } catch (error: any) {
    console.error('Store profile fetch error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch store profile'
      },
      { status: 500 }
    );
  }
}
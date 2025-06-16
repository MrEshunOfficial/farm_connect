// src/app/api/profile/[id]/route.ts
import { connect } from '@/hooks/dbconfigue/dbConfigue';
import { UserProfile } from '@/models/profileModel/userProfileModel';
import { NextRequest, NextResponse } from 'next/server';
import { isValidObjectId } from 'mongoose';

interface RouteParams {
  params: Promise<{ id: string }>;
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
  context: RouteParams
): Promise<NextResponse> {
  const connectionError = await connectToDatabase();
  if (connectionError) return connectionError;

  try {
    const { id } = await context.params;

    // Validate ObjectId format
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid profile ID format' 
        },
        { status: 400 }
      );
    }

    const profile = await UserProfile.findById(id).lean();

    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: profile
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

// Additional methods can be added here (PUT, DELETE, etc.)
export async function PUT(
  req: NextRequest,
  context: RouteParams
): Promise<NextResponse> {
  const connectionError = await connectToDatabase();
  if (connectionError) return connectionError;

  try {
    const { id } = await context.params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid profile ID format' 
        },
        { status: 400 }
      );
    }

    const updateData = await req.json();
    
    const updatedProfile = await UserProfile.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    ).lean();

    if (!updatedProfile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedProfile
    }, { status: 200 });

  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: RouteParams
): Promise<NextResponse> {
  const connectionError = await connectToDatabase();
  if (connectionError) return connectionError;

  try {
    const { id } = await context.params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid profile ID format' 
        },
        { status: 400 }
      );
    }

    const deletedProfile = await UserProfile.findByIdAndDelete(id);

    if (!deletedProfile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Profile deleted successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Error deleting profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete profile' },
      { status: 500 }
    );
  }
}
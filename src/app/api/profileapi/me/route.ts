import { connect } from '@/hooks/dbconfigue/dbConfigue';
import { UserProfile } from '@/models/profileModel/userProfileModel';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import mongoose from 'mongoose';

// Helper function to validate authenticated user
async function validateAuthenticatedUser() {
  const session = await auth();
  if (!session?.user?.email || !session?.user?.id) {
    throw new Error('Not authenticated');
  }
  return session.user;
}

// Helper function to get user profile
async function getUserProfile(email: string) {
  const profile = await UserProfile.findOne({ email });
  if (!profile) {
    throw new Error('Profile not found');
  }
  return profile;
}

export async function GET(req: NextRequest) {
  try {
    await connect();
    const user = await validateAuthenticatedUser();
    if (!user.email) {
      throw new Error('User email is undefined');
    }
    const profile = await getUserProfile(user.email);

    return NextResponse.json({
      success: true,
      data: profile
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error in GET /api/profile/me:', error);
    if (error instanceof Error) {
      if (error.message === 'Not authenticated') {
        return NextResponse.json({ success: false, error: error.message }, { status: 401 });
      }
      if (error.message === 'Profile not found') {
        return NextResponse.json({ success: false, error: error.message }, { status: 404 });
      }
    }
    return NextResponse.json(
      { success: false, error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connect();
    const user = await validateAuthenticatedUser();
    if (!user.email) {
      throw new Error('User email is undefined');
    }
    const profile = await getUserProfile(user.email);
    
    const body = await req.json();

    // Validate the request body
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Invalid request body' },
        { status: 400 }
      );
    }

    // Remove protected fields
    delete body._id;
    delete body.email;
    delete body.userId;
    delete body.createdAt;
    delete body.updatedAt;

    // Update the profile with validation
    const updatedProfile = await UserProfile.findByIdAndUpdate(
      profile._id,
      { $set: body },
      { 
        new: true, 
        runValidators: true,
        context: 'query'
      }
    );

    if (!updatedProfile) {
      return NextResponse.json(
        { success: false, error: 'Failed to update profile' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedProfile
    }, { status: 200 });

  } catch (error) {
    console.error('Error in PUT /api/profile/me:', error);
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    if (error instanceof Error) {
      if (error.message === 'Not authenticated') {
        return NextResponse.json({ success: false, error: error.message }, { status: 401 });
      }
      if (error.message === 'Profile not found') {
        return NextResponse.json({ success: false, error: error.message }, { status: 404 });
      }
    }
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connect();
    const user = await validateAuthenticatedUser();
    if (!user.email) {
      throw new Error('User email is undefined');
    }
    const profile = await getUserProfile(user.email);
    
    const body = await req.json();

    // Validate the request body
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Invalid request body' },
        { status: 400 }
      );
    }

    // Remove protected fields
    delete body._id;
    delete body.email;
    delete body.userId;
    delete body.createdAt;
    delete body.updatedAt;

    // Update only the provided fields
    const updatedProfile = await UserProfile.findByIdAndUpdate(
      profile._id,
      { $set: body },
      { 
        new: true, 
        runValidators: true,
        context: 'query' 
      }
    );

    if (!updatedProfile) {
      return NextResponse.json(
        { success: false, error: 'Failed to update profile' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedProfile
    }, { status: 200 });

  } catch (error) {
    console.error('Error in PATCH /api/profile/me:', error);
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    if (error instanceof Error) {
      if (error.message === 'Not authenticated') {
        return NextResponse.json({ success: false, error: error.message }, { status: 401 });
      }
      if (error.message === 'Profile not found') {
        return NextResponse.json({ success: false, error: error.message }, { status: 404 });
      }
    }
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connect();
    const user = await validateAuthenticatedUser();
    if (!user.email) {
      throw new Error('User email is undefined');
    }
    const profile = await getUserProfile(user.email);

    // Delete the profile
    const deletedProfile = await UserProfile.findByIdAndDelete(profile._id);

    if (!deletedProfile) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete profile' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Profile deleted successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Error in DELETE /api/profile/me:', error);
    if (error instanceof Error) {
      if (error.message === 'Not authenticated') {
        return NextResponse.json({ success: false, error: error.message }, { status: 401 });
      }
      if (error.message === 'Profile not found') {
        return NextResponse.json({ success: false, error: error.message }, { status: 404 });
      }
    }
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
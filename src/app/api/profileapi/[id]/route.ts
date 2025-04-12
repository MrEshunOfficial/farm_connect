// src/app/api/profile/[id]/route.ts
import { connect } from '@/hooks/dbconfigue/dbConfigue';
import { UserProfile } from '@/models/profileModel/userProfileModel';
import { NextRequest, NextResponse } from 'next/server';

async function connectToDatabase() {
  try {
    await connect();
  } catch (error) {
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
  { params }: { params: { id: string } }
) {
  const connectionError = await connectToDatabase();
  if (connectionError) return connectionError;

  try {
    const profile = await UserProfile.findById(params.id).lean();
    
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
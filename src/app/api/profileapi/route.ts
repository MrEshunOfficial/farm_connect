// src/app/api/profile/route.ts
import { connect } from '@/hooks/dbconfigue/dbConfigue';
import { UserRole } from '@/models/profileModel/profileModel';
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

export async function GET(req: NextRequest) {
  const connectionError = await connectToDatabase();
  if (connectionError) return connectionError;

  try {
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    
    // Single user profile fetch
    if (userId) {
      const user = await UserProfile.findById(userId).lean();
      
      if (!user) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Profile not found' 
          }, 
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: user
      }, { status: 200 });
    }

    // For listing profiles with filters
    const role = searchParams.get('role') as typeof UserRole | null;
    const country = searchParams.get('country');
    const verified = searchParams.get('verified');

    const query: Record<string, any> = {};
    if (role) query.role = role;
    if (country) query.country = country;
    if (verified !== null) query.verified = verified === 'true';

    const [users] = await Promise.all([
      UserProfile
        .find(query)
        .lean(),
      UserProfile.countDocuments(query)
    ]);

    return NextResponse.json({
      success: true,
      data: users,
    
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch profiles' 
      }, 
      { status: 500 }
    );
  }
}


// POST: Create a new user profile
export async function POST(req: NextRequest) {
  // Connect to database
  const connectionError = await connectToDatabase();
  if (connectionError) return connectionError;

  try {
    // Parse request body
    const body = await req.json();
    // Create new user profile
    const newUser = new UserProfile(body);
    await newUser.save();
    
    // Return response
    return NextResponse.json({
      success: true,
      data: newUser.toObject()
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating user profile:', error);
    
    // Handle validation errors
    if (error instanceof Error && 'errors' in error) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation failed',
          details: (error as any).errors
        }, 
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create user profile' 
      }, 
      { status: 500 }
    );
  }
}

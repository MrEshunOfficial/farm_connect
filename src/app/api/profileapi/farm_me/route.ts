// app/api/farm/route.ts
import { connect } from '@/hooks/dbconfigue/dbConfigue';
import { FarmProfile } from '@/models/profileModel/userProfileModel';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import validator from 'validator';
import { IFarmProfile } from '@/models/profileI-interfaces';

// Type for request body validation
type FarmProfileUpdateData = Partial<Omit<IFarmProfile, 
  '_id' | 'userId' | 'userProfile' | 'createdAt' | 'updatedAt' | 'getFullFarmDetails' | 'calculateFarmProductivity'
>>;

// Helper function to validate authenticated user
async function validateAuthenticatedUser() {
  const session = await auth();
  if (!session?.user?.email || !session?.user?.id) {
    throw new Error('Not authenticated');
  }
  return session.user;
}

// Validate farm profile data
function validateFarmProfileData(data: FarmProfileUpdateData) {
  const errors: string[] = [];

  if (data.farmName && (data.farmName.length < 2 || data.farmName.length > 100)) {
    errors.push('Farm name must be between 2 and 100 characters');
  }

  if (data.farmSize !== undefined && (data.farmSize < 0 || data.farmSize > 10000)) {
    errors.push('Farm size must be between 0 and 10000');
  }

  if (data.contactEmail && !validator.isEmail(data.contactEmail)) {
    errors.push('Invalid contact email format');
  }

  if (data.contactPhone && !/^(\+\d{1,3}[- ]?)?\d{10,15}$/.test(data.contactPhone)) {
    errors.push('Invalid contact phone format');
  }

  return errors;
}

// Main /api/farm endpoint handlers
export async function GET(req: NextRequest) {
  try {
    await connect();
    
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const farmType = searchParams.get('farmType');
    const productionScale = searchParams.get('productionScale');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');

    // Build query object
    const query: any = {};
    if (userId) query.userId = userId;
    if (farmType) query.farmType = farmType;
    if (productionScale) query.productionScale = productionScale;

    // If no userId is provided, ensure user is authenticated to view all farms
    if (!userId) {
      const user = await validateAuthenticatedUser();
      if (!user) {
        return NextResponse.json({
          success: false,
          error: 'Authentication required to view all farms'
        }, { status: 401 });
      }
    }

    const skip = (page - 1) * limit;
    const farmProfiles = await FarmProfile.find(query)
      .populate({
        path: 'userProfile',
        select: [
          'fullName',
          'email',
          'profilePicture',
          'phoneNumber',
          'country',
        ]
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await FarmProfile.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: farmProfiles,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Error in GET /api/farm:', error);
    const message = error instanceof Error ? error.message : 'An error occurred';
    
    return NextResponse.json({
      success: false,
      error: message
    }, { 
      status: message === 'Not authenticated' ? 401 : 500 
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connect();
    const user = await validateAuthenticatedUser();
    
    const data = await req.json();
    const errors = validateFarmProfileData(data);
    
    if (errors.length > 0) {
      return NextResponse.json({
        success: false,
        errors
      }, { status: 400 });
    }

    const farmProfile = new FarmProfile({
      ...data,
      userId: user.id,
      userProfile: user.id
    });

    await farmProfile.save();

    return NextResponse.json({
      success: true,
      data: farmProfile
    }, { status: 201 });

  } catch (error) {
    console.error('Error in POST /api/farm:', error);
    const message = error instanceof Error ? error.message : 'An error occurred';
    
    return NextResponse.json({
      success: false,
      error: message
    }, { 
      status: message === 'Not authenticated' ? 401 : 500 
    });
  }
}

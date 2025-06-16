import { connect } from '@/hooks/dbconfigue/dbConfigue';
import { FarmProfile } from '@/models/profileModel/userProfileModel';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { isValidObjectId } from 'mongoose';
import { FarmType, IFarmProfile } from '@/models/profileI-interfaces';

interface RouteParams {
  params: Promise<{ id: string }>;
}

interface ArrayUpdate {
  field: string;
  operation: 'add' | 'remove' | 'update';
  value?: any;
  index?: number;
}

interface UpdatePayload {
  basicInfo?: Partial<IFarmProfile>;
  arrayUpdates?: ArrayUpdate[];
}

async function validateAuthenticatedUser() {
  const session = await auth();
  if (!session?.user?.email || !session?.user?.id) {
    throw new Error('Not authenticated');
  }
  return session.user;
}

// Helper function to get the relevant field for a farm type
function getFarmTypeField(farmType: string): keyof IFarmProfile | null {
  const fieldMap = {
    [FarmType.CropFarming]: 'cropsGrown',
    [FarmType.LivestockFarming]: 'livestockProduced',
    [FarmType.Mixed]: 'mixedCropsGrown',
    [FarmType.Aquaculture]: 'aquacultureType',
    [FarmType.Nursery]: 'nurseryType',
    [FarmType.Poultry]: 'poultryType',
    [FarmType.Others]: 'othersType'
  } as const;

  return fieldMap[farmType as keyof typeof fieldMap] || null;
}

// Helper function to clear all production-related fields
function clearAllProductionFields(farmProfile: IFarmProfile, keepField?: keyof IFarmProfile): void {
  const fieldsToClean = [
    'cropsGrown',
    'livestockProduced',
    'mixedCropsGrown',
    'aquacultureType',
    'nurseryType',
    'poultryType',
    'othersType'
  ] as const;

  fieldsToClean.forEach(field => {
    if (field !== keepField) {
      (farmProfile[field] as any[]) = [];
    }
  });
}

// Helper function to process array updates
function processArrayUpdate(farmProfile: IFarmProfile, update: ArrayUpdate): void {
  const field = update.field as keyof IFarmProfile;
  
  switch (update.operation) {
    case 'add': {
      if (!farmProfile[field]) {
        (farmProfile[field] as any[]) = [];
      }
      (farmProfile[field] as any[]).push(update.value);
      break;
    }
    case 'remove': {
      const array = farmProfile[field] as any[];
      if (Array.isArray(array) && typeof update.index === 'number' && update.index < array.length) {
        array.splice(update.index, 1);
      }
      break;
    }
    case 'update': {
      const array = farmProfile[field] as any[];
      if (Array.isArray(array) && typeof update.index === 'number' && update.index < array.length) {
        array[update.index] = update.value;
      }
      break;
    }
  }
}

export async function PUT(
  req: NextRequest,
  context: RouteParams
): Promise<NextResponse> {
  try {
    await connect();
    const user = await validateAuthenticatedUser();
    const { id } = await context.params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid farm profile ID'
      }, { status: 400 });
    }

    const payload: UpdatePayload = await req.json();
    const { basicInfo, arrayUpdates } = payload;

    let farmProfile = await FarmProfile.findOne({ _id: id, userId: user.id });

    if (!farmProfile) {
      return NextResponse.json({
        success: false,
        error: 'Farm profile not found or unauthorized'
      }, { status: 404 });
    }

    // Store the original farm type for comparison
    const originalFarmType = farmProfile.farmType;

    // Handle basic info updates first
    if (basicInfo) {
      Object.assign(farmProfile, basicInfo);
    }

    // Handle farm type change and array updates
    if (basicInfo?.farmType && basicInfo.farmType !== originalFarmType) {
      // Clear all production-related fields when farm type changes
      clearAllProductionFields(farmProfile);
      
      // If there are array updates, only process the ones that match the new farm type
      if (arrayUpdates && arrayUpdates.length > 0) {
        const validField = getFarmTypeField(basicInfo.farmType);
        const validUpdates = arrayUpdates.filter(update => update.field === validField);

        if (validUpdates.length !== arrayUpdates.length) {
          return NextResponse.json({
            success: false,
            error: `Can only update ${validField} for farm type ${basicInfo.farmType}`
          }, { status: 400 });
        }

        // Process valid updates
        validUpdates.forEach(update => processArrayUpdate(farmProfile, update));
      }
    } else if (arrayUpdates && arrayUpdates.length > 0) {
      // If farm type hasn't changed, validate updates against current farm type
      const validField = getFarmTypeField(farmProfile.farmType);
      
      for (const update of arrayUpdates) {
        if (update.field !== validField) {
          return NextResponse.json({
            success: false,
            error: `Cannot update ${update.field} for farm type ${farmProfile.farmType}`
          }, { status: 400 });
        }

        processArrayUpdate(farmProfile, update);
      }
    }

    await farmProfile.save();
    const populatedProfile = await farmProfile.populate('userProfile', 'fullName email');

    return NextResponse.json({
      success: true,
      data: populatedProfile
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error in PUT /api/farm/[id]:', error);
    const message = error instanceof Error ? error.message : 'An error occurred';
    
    return NextResponse.json({
      success: false,
      error: message
    }, {
      status: message === 'Not authenticated' ? 401 : 500
    });
  }
}

export async function GET(
  req: NextRequest,
  context: RouteParams
): Promise<NextResponse> {
  try {
    await connect();
    const user = await validateAuthenticatedUser();
    const { id } = await context.params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid farm profile ID'
      }, { status: 400 });
    }

    const farmProfile = await FarmProfile.findOne({ _id: id, userId: user.id });
    
    if (!farmProfile) {
      return NextResponse.json({
        success: false,
        error: 'Farm profile not found or unauthorized'
      }, { status: 404 });
    }

    const populatedFarmProfile = await farmProfile.populate('userProfile', 'fullName email');

    return NextResponse.json({
      success: true,
      data: populatedFarmProfile
    }, { status: 200 });

  } catch (error) {
    console.error('Error in GET /api/farm/[id]:', error);
    const message = error instanceof Error ? error.message : 'An error occurred';
    
    return NextResponse.json({
      success: false,
      error: message
    }, { 
      status: message === 'Not authenticated' ? 401 : 500 
    });
  }
}

export async function DELETE(
  req: NextRequest,
  context: RouteParams
): Promise<NextResponse> {
  try {
    await connect();
    const user = await validateAuthenticatedUser();
    const { id } = await context.params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid farm profile ID'
      }, { status: 400 });
    }

    const farmProfile = await FarmProfile.findOneAndDelete({
      _id: id,
      userId: user.id
    });

    if (!farmProfile) {
      return NextResponse.json({
        success: false,
        error: 'Farm profile not found or unauthorized'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Farm profile deleted successfully'
    }, { status: 200 });

  } catch (error) {
    console.error('Error in DELETE /api/farm/[id]:', error);
    const message = error instanceof Error ? error.message : 'An error occurred';
    
    return NextResponse.json({
      success: false,
      error: message
    }, { 
      status: message === 'Not authenticated' ? 401 : 500 
    });
  }
}
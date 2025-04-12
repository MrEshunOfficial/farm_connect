import { connect } from '@/hooks/dbconfigue/dbConfigue';
import { FarmProfile} from '@/models/profileModel/userProfileModel';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { isValidObjectId } from 'mongoose';
import { FarmType, IFarmProfile } from '@/models/profileI-interfaces';

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
function clearAllProductionFields(farmProfile: IFarmProfile, keepField?: keyof IFarmProfile) {
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
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connect();
    const user = await validateAuthenticatedUser();
    const { id } = params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid farm profile ID'
      }, { status: 400 });
    }

    const { basicInfo, arrayUpdates } = await req.json();
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
        const validUpdates = arrayUpdates.filter((update: { field: string | null; }) => update.field === validField);

        if (validUpdates.length !== arrayUpdates.length) {
          return NextResponse.json({
            success: false,
            error: `Can only update ${validField} for farm type ${basicInfo.farmType}`
          }, { status: 400 });
        }

        // Process valid updates
        for (const update of validUpdates) {
          switch (update.operation) {
            case 'add': {
              if (!farmProfile[update.field as keyof IFarmProfile]) {
                (farmProfile[update.field as keyof IFarmProfile] as any[]) = [];
              }
              (farmProfile[update.field as keyof IFarmProfile] as any[]).push(update.value);
              break;
            }
            case 'remove': {
              const array = farmProfile[update.field as keyof IFarmProfile] as any[];
              if (Array.isArray(array) && update.index! < array.length) {
                array.splice(update.index!, 1);
              }
              break;
            }
            case 'update': {
              if (Array.isArray(farmProfile[update.field as keyof IFarmProfile]) && 
                  update.index! < (farmProfile[update.field as keyof IFarmProfile] as any[]).length) {
                (farmProfile[update.field as keyof IFarmProfile] as any[])[update.index!] = update.value;
              }
              break;
            }
          }
        }
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

        switch (update.operation) {
          case 'remove': {
            const array = farmProfile[update.field as keyof IFarmProfile] as any[];
            if (Array.isArray(array) && update.index! < array.length) {
              array.splice(update.index!, 1);
            }
            break;
          }
          case 'add': {
            if (!farmProfile[update.field as keyof IFarmProfile]) {
              (farmProfile[update.field as keyof IFarmProfile] as any[]) = [];
            }
            (farmProfile[update.field as keyof IFarmProfile] as any[]).push(update.value);
            break;
          }
          case 'update': {
            if (Array.isArray(farmProfile[update.field as keyof IFarmProfile]) && 
                update.index! < (farmProfile[update.field as keyof IFarmProfile] as any[]).length) {
              (farmProfile[update.field as keyof IFarmProfile] as any[])[update.index!] = update.value;
            }
            break;
          }
        }
      }
    }

    await farmProfile.save();
    farmProfile = await farmProfile.populate('userProfile', 'fullName email');

    return NextResponse.json({
      success: true,
      data: farmProfile
    }, { status: 200 });
    
  } catch (error) {
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
  { params }: { params: { id: string } }
) {
  try {
    await connect();
    await validateAuthenticatedUser();

    const { id } = params;
    if (!isValidObjectId(id)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid farm profile ID'
      }, { status: 400 });
    }

    const farmProfile = await FarmProfile.findById(id);
    
    if (!farmProfile) {
      return NextResponse.json({
        success: false,
        error: 'Farm profile not found'
      }, { status: 404 });
    }

    const populatedFarmProfile = await farmProfile.populate('userProfile', 'fullName email');

    return NextResponse.json({
      success: true,
      data: populatedFarmProfile
    }, { status: 200 });

  } catch (error) {
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
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connect();
    const user = await validateAuthenticatedUser();

    const { id } = params;
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
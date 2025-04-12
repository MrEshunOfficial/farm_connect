import { auth } from '@/auth';
import { connect } from '@/hooks/dbconfigue/dbConfigue';
import { NextRequest, NextResponse } from 'next/server';
import { StoreProfile, UserProfile } from '@/models/profileModel/userProfileModel';

// Helper function to validate authenticated user
async function validateAuthenticatedUser() {
  const session = await auth();
  if (!session?.user?.email || !session?.user?.id) {
    throw new Error('Not authenticated');
  }
  return session.user;
}

export async function GET(): Promise<NextResponse> {
  try {
    // Validate authentication
    const user = await validateAuthenticatedUser();

    // Connect to database
    await connect();

    // Find the user's store profile
    const storeProfile = await StoreProfile.findOne({ userId: user.id })
      .populate({
        path: 'userProfile',
        model: UserProfile,
        select: '_id fullName email username profilePicture phoneNumber role verified'
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
    if (error.message === 'Not authenticated') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Authentication required' 
        }, 
        { status: 401 }
      );
    }

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

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Validate authentication
    const user = await validateAuthenticatedUser();

    // Parse request body
    const body = await req.json();

    // Connect to database
    await connect();

    // First, find the user's profile
    const userProfile = await UserProfile.findOne({ userId: user.id });
    
    if (!userProfile) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'User profile not found' 
        }, 
        { status: 404 }
      );
    }

    // Create a new store profile with the userProfile reference
    const newStoreProfile = new StoreProfile({
      userId: user.id,
      userProfile: userProfile._id,
      ...body
    });

    // Save the new store profile
    await newStoreProfile.save();

    // Optionally, update the user profile to reference the store
    await UserProfile.findByIdAndUpdate(userProfile._id, {
      storeProfile: newStoreProfile._id
    });

    return NextResponse.json(
      {
        success: true,
        data: newStoreProfile
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.message === 'Not authenticated') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Authentication required' 
        }, 
        { status: 401 }
      );
    }

    console.error('Store profile creation error:', error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: Object.values(error.errors).map((err: any) => err.message)
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create store profile'
      },
      { status: 500 }
    );
  }
}

// Define operation types for better type safety
type UpdateOperation = 
  | 'addBranch' 
  | 'updateBranch' 
  | 'deleteBranch'
  | 'addImage' 
  | 'updateImage' 
  | 'deleteImage'
  | 'updateStoreInfo'
  | 'updateImageAvailability';

interface UpdateRequest {
  operation: UpdateOperation;
  branchId?: string;
  imageId?: string;
  branches?: {
    branchName: string;
    branchLocation: string;
    gpsAddress?: string;
    branchPhone: string;
    branchEmail?: string;
  };
  storeImages?: {
    _id?: string;
    url: string;
    itemName: string;
    itemPrice: string;
    available?: boolean;
  };
  storeInfo?: {
    storeName?: string;
    description?: string;
    StoreOwnerShip?: string;
    productionScale?: string;
    productSold?: string[];
    belongsToGroup?: boolean;
    groupName?: string;
  };
}

interface UpdateOptions {
  new: boolean;
  runValidators: boolean;
  arrayFilters?: Array<Record<string, any>>;
}

export async function PUT(req: NextRequest): Promise<NextResponse> {
  try {
    // Validate authentication
    const session = await auth();
    if (!session?.user?.email || !session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse request body
    const body: UpdateRequest = await req.json();

    // Connect to database
    await connect();

    // Find the store profile first
    const storeProfile = await StoreProfile.findOne({ userId: session.user.id });
    if (!storeProfile) {
      return NextResponse.json(
        { success: false, error: 'Store profile not found' },
        { status: 404 }
      );
    }

    let updateOperation: Record<string, any>;
    const updateOptions: UpdateOptions = {
      new: true,
      runValidators: true
    };

    switch (body.operation) {
      case 'addBranch':
        if (!body.branches) {
          return NextResponse.json(
            { success: false, error: 'Branch data is required' },
            { status: 400 }
          );
        }
        // Remove _id if it exists and is empty
        const branchData = { ...body.branches };
        if ('_id' in branchData && !branchData._id) {
          delete branchData._id;
        }
        updateOperation = {
          $push: { branches: branchData }
        };
        break;

      case 'updateBranch':
        if (!body.branchId || !body.branches) {
          return NextResponse.json(
            { success: false, error: 'Branch ID and updated data are required' },
            { status: 400 }
          );
        }
        updateOperation = {
          $set: {
            'branches.$[branch]': body.branches
          }
        };
        updateOptions.arrayFilters = [{ 'branch._id': body.branchId }];
        break;

      case 'deleteBranch':
        if (!body.branchId) {
          return NextResponse.json(
            { success: false, error: 'Branch ID is required' },
            { status: 400 }
          );
        }
        updateOperation = {
          $pull: { branches: { _id: body.branchId } }
        };
        break;

        case 'addImage':
          if (!body.storeImages) {
            return NextResponse.json(
              { success: false, error: 'Image data is required' },
              { status: 400 }
            );
          }
          // Remove _id if it exists and is empty
          const imageData = { ...body.storeImages };
          if ('_id' in imageData && !imageData._id) {
            delete imageData._id;
          }
          updateOperation = {
            $push: { storeImages: imageData }
          };
          break;

      case 'updateImage':
        if (!body.imageId || !body.storeImages) {
          return NextResponse.json(
            { success: false, error: 'Image ID and updated data are required' },
            { status: 400 }
          );
        }
        updateOperation = {
          $set: {
            'storeImages.$[image]': body.storeImages
          }
        };
        updateOptions.arrayFilters = [{ 'image._id': body.imageId }];
        break;

      case 'deleteImage':
        if (!body.imageId) {
          return NextResponse.json(
            { success: false, error: 'Image ID is required' },
            { status: 400 }
          );
        }
        updateOperation = {
          $pull: { storeImages: { _id: body.imageId } }
        };
        break;

      case 'updateStoreInfo':
        if (!body.storeInfo) {
          return NextResponse.json(
            { success: false, error: 'Store information is required' },
            { status: 400 }
          );
        }
        updateOperation = {
          $set: body.storeInfo
        };
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid operation type' },
          { status: 400 }
        );
    }

    const updatedStoreProfile = await StoreProfile.findOneAndUpdate(
      { userId: session.user.id },
      updateOperation,
      updateOptions
    ).populate({
      path: 'userProfile',
      model: UserProfile,
      select: 'fullName email username profilePicture'
    });

    return NextResponse.json(
      {
        success: true,
        data: updatedStoreProfile
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Store profile update error:', error);
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: Object.values(error.errors).map((err: any) => err.message)
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update store profile'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(): Promise<NextResponse> {
  try {
    // Validate authentication
    const user = await validateAuthenticatedUser();

    // Connect to database
    await connect();

    // Find and delete the store profile
    const deletedStoreProfile = await StoreProfile.findOneAndDelete({ userId: user.id });

    if (!deletedStoreProfile) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Store profile not found' 
        }, 
        { status: 404 }
      );
    }

    // Also update the user profile to remove the store profile reference
    await UserProfile.findOneAndUpdate(
      { userId: user.id },
      { $unset: { storeProfile: "" } }
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Store profile deleted successfully'
      },
      { status: 200 }
    );

  } catch (error: any) {
    if (error.message === 'Not authenticated') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Authentication required' 
        }, 
        { status: 401 }
      );
    }

    console.error('Store profile deletion error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete store profile'
      },
      { status: 500 }
    );
  }
}
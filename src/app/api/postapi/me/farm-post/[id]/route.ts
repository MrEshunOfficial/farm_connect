import { auth } from '@/auth';
import { connect } from '@/hooks/dbconfigue/dbConfigue';
import { FarmPost } from '@/models/post.model/farm-post-schema';
import { NextRequest, NextResponse } from 'next/server';

// Types for better TypeScript support
interface RouteParams {
  params: Promise<{ id: string }>;
}

interface FarmPostUpdateData {
  title?: string;
  description?: string;
  price?: number;
  location?: string;
  category?: string;
  images?: string[];
  [key: string]: any;
}

// Connect to the database
connect();

// Helper function to handle errors
function handleError(error: any, context: string = 'operation'): NextResponse {
  console.error(`Farm post ${context} error:`, error);
  return NextResponse.json(
    { 
      success: false, 
      error: error.message || `An error occurred during the ${context}`
    },
    { status: error.status || 500 }
  );
}

// Helper function to validate authenticated user
async function validateAuthenticatedUser() {
  const session = await auth();
  if (!session?.user?.email || !session?.user?.id) {
    const error = new Error('Not authenticated');
    Object.defineProperty(error, 'status', { value: 401 });
    throw error;
  }
  return session.user;
}

// Helper function to validate post ownership
async function validatePostOwnership(postId: string, userId: string) {
  const farmPost = await FarmPost.findById(postId);
  if (!farmPost) {
    const error = new Error('Farm post not found');
    Object.defineProperty(error, 'status', { value: 404 });
    throw error;
  }

  if (farmPost.userId.toString() !== userId) {
    const error = new Error('Unauthorized - You can only modify your own posts');
    Object.defineProperty(error, 'status', { value: 403 });
    throw error;
  }

  return farmPost;
}

// GET /api/farm-posts/[id] - Fetch a single farm post by ID or posts by userId
export async function GET(
  request: NextRequest,
  context: RouteParams
): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const { id } = await context.params;
    
    let query;
    if (userId) {
      // If userId is provided, fetch all posts by that user
      query = FarmPost.find({ userProfile: userId });
    } else {
      // Otherwise, fetch specific post by ID
      query = FarmPost.findById(id);
    }

    // Apply population to either query type
    const farmPost = await query.populate('userProfile');

    if (!farmPost || (Array.isArray(farmPost) && farmPost.length === 0)) {
      return NextResponse.json(
        { success: false, error: 'Farm post(s) not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: farmPost },
      { status: 200 }
    );

  } catch (error: any) {
    return handleError(error, 'fetch');
  }
}

// PUT /api/farm-posts/[id] - Update a farm post by ID (full replacement)
export async function PUT(
  request: NextRequest, 
  context: RouteParams
): Promise<NextResponse> {
  try {
    const user = await validateAuthenticatedUser();
    const { id } = await context.params;
    const body: FarmPostUpdateData = await request.json();

    // Validate ownership
    if (!user.id) {
  throw new Error("User ID is missing");
}
await validatePostOwnership(id, user.id);
    

    // Update the farm post (full replacement)
    const updatedFarmPost = await FarmPost.findByIdAndUpdate(
      id, 
      body, 
      { new: true, runValidators: true }
    ).populate('userProfile');

    if (!updatedFarmPost) {
      return NextResponse.json(
        { success: false, error: 'Failed to update farm post' }, 
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Farm post updated successfully',
        data: updatedFarmPost 
      }, 
      { status: 200 }
    );
  } catch (error: any) {
    return handleError(error, 'update');
  }
}

// PATCH /api/farm-posts/[id] - Partially update a farm post by ID
export async function PATCH(
  request: NextRequest, 
  context: RouteParams
): Promise<NextResponse> {
  try {
    const user = await validateAuthenticatedUser();
    const { id } = await context.params;
    const body: Partial<FarmPostUpdateData> = await request.json();

    // Validate that body is not empty
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No update data provided' },
        { status: 400 }
      );
    }

    // Validate ownership
    if (!user.id) {
  throw new Error("User ID is missing");
}
await validatePostOwnership(id, user.id);

    // Partially update the farm post
    const updatedFarmPost = await FarmPost.findByIdAndUpdate(
      id, 
      { $set: body }, 
      { new: true, runValidators: true }
    ).populate('userProfile');

    if (!updatedFarmPost) {
      return NextResponse.json(
        { success: false, error: 'Failed to update farm post' }, 
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Farm post updated successfully',
        data: updatedFarmPost 
      }, 
      { status: 200 }
    );
  } catch (error: any) {
    return handleError(error, 'partial update');
  }
}

// DELETE /api/farm-posts/[id] - Delete a farm post by ID
export async function DELETE(
  request: NextRequest, 
  context: RouteParams
): Promise<NextResponse> {
  try {
    const user = await validateAuthenticatedUser();
    const { id } = await context.params;

    // Validate ownership
    if (!user.id) {
  throw new Error("User ID is missing");
}
await validatePostOwnership(id, user.id);

    // Delete the farm post
    const deletedPost = await FarmPost.findByIdAndDelete(id);

    if (!deletedPost) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete farm post' }, 
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Farm post deleted successfully' 
      }, 
      { status: 200 }
    );
  } catch (error: any) {
    return handleError(error, 'delete');
  }
}
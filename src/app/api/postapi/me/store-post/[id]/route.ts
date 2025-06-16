import { auth } from '@/auth';
import { connect } from '@/hooks/dbconfigue/dbConfigue';
import { StorePost } from '@/models/post.model/store-post-schema';
import { NextRequest, NextResponse } from 'next/server';

// Types for better TypeScript support
interface RouteParams {
  params: Promise<{ id: string }>;
}

interface StorePostUpdateData {
  title?: string;
  description?: string;
  price?: number;
  location?: string;
  category?: string;
  images?: string[];
  storeProfile?: string;
  inventory?: number;
  [key: string]: any; // Allow for additional fields
}

// Connect to the database
connect();

// Helper function to handle errors
function handleError(error: any, context: string = 'operation'): NextResponse {
  console.error(`Store post ${context} error:`, error);
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
  const storePost = await StorePost.findById(postId);
  if (!storePost) {
    const error = new Error('Store post not found');
    Object.defineProperty(error, 'status', { value: 404 });
    throw error;
  }

  if (storePost.userId.toString() !== userId) {
    const error = new Error('Unauthorized - You can only modify your own posts');
    Object.defineProperty(error, 'status', { value: 403 });
    throw error;
  }

  return storePost;
}

// GET /api/store-posts/[id] - Fetch a single store post by ID or posts by userId
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
      query = StorePost.find({ userProfile: userId });
    } else {
      // Otherwise, fetch specific post by ID
      query = StorePost.findById(id);
    }

    // Apply population to either query type
    const storePost = await query
      .populate('userProfile')
      .populate('storeProfile');

    if (!storePost || (Array.isArray(storePost) && storePost.length === 0)) {
      return NextResponse.json(
        { success: false, error: 'Store post(s) not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: storePost },
      { status: 200 }
    );

  } catch (error: any) {
    return handleError(error, 'fetch');
  }
}

// PUT /api/store-posts/[id] - Update a store post by ID (full replacement)
export async function PUT(
  request: NextRequest, 
  context: RouteParams
): Promise<NextResponse> {
  try {
    const user = await validateAuthenticatedUser();
    const { id } = await context.params;
    const body: StorePostUpdateData = await request.json();

    // Validate ownership
    if (!user.id) {
  throw new Error("User ID is missing");
}
await validatePostOwnership(id, user.id);

    // Update the store post (full replacement)
    const updatedStorePost = await StorePost.findByIdAndUpdate(
      id, 
      body, 
      { new: true, runValidators: true }
    )
      .populate('userProfile')
      .populate('storeProfile');

    if (!updatedStorePost) {
      return NextResponse.json(
        { success: false, error: 'Failed to update store post' }, 
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Store post updated successfully',
        data: updatedStorePost 
      }, 
      { status: 200 }
    );
  } catch (error: any) {
    return handleError(error, 'update');
  }
}

// PATCH /api/store-posts/[id] - Partially update a store post by ID
export async function PATCH(
  request: NextRequest, 
  context: RouteParams
): Promise<NextResponse> {
  try {
    const user = await validateAuthenticatedUser();
    const { id } = await context.params;
    const body: Partial<StorePostUpdateData> = await request.json();

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

    // Partially update the store post
    const updatedStorePost = await StorePost.findByIdAndUpdate(
      id, 
      { $set: body }, 
      { new: true, runValidators: true }
    )
      .populate('userProfile')
      .populate('storeProfile');

    if (!updatedStorePost) {
      return NextResponse.json(
        { success: false, error: 'Failed to update store post' }, 
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Store post updated successfully',
        data: updatedStorePost 
      }, 
      { status: 200 }
    );
  } catch (error: any) {
    return handleError(error, 'partial update');
  }
}

// DELETE /api/store-posts/[id] - Delete a store post by ID
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

    // Delete the store post
    const deletedPost = await StorePost.findByIdAndDelete(id);

    if (!deletedPost) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete store post' }, 
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Store post deleted successfully' 
      }, 
      { status: 200 }
    );
  } catch (error: any) {
    return handleError(error, 'delete');
  }
}
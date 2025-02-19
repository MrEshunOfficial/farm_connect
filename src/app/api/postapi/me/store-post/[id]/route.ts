import { auth } from '@/auth';
import { connect } from '@/hooks/dbconfigue/dbConfigue';
import { StorePost } from '@/models/post.model/store-post-schema';
import { NextRequest, NextResponse } from 'next/server';

// Connect to the database
connect();

// Helper function to validate authenticated user
async function validateAuthenticatedUser() {
  const session = await auth();
  if (!session?.user?.email || !session?.user?.id) {
    throw new Error('Not authenticated');
  }
  return session.user;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    let query;
    if (userId) {
      query = StorePost.find({ userProfile: userId });
    } else {
      query = StorePost.findById(params.id);
    }

    // Apply population to either query type
    const storePost = await query
      .populate('userProfile')
      .populate('storeProfile');

    if (!storePost) {
      return NextResponse.json(
        { success: false, error: 'Store post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: storePost },
      { status: 200 }
    );

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/store-posts/[id] - Update a store post by ID
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await validateAuthenticatedUser();
    const body = await request.json();

    const storePost = await StorePost.findById(params.id);
    if (!storePost) {
      return NextResponse.json({ success: false, error: 'Store post not found' }, { status: 404 });
    }

    // Check if the authenticated user owns the post
    if (storePost.userId.toString() !== user.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    // Update the store post
    const updatedStorePost = await StorePost.findByIdAndUpdate(params.id, body, { new: true });
    return NextResponse.json({ success: true, data: updatedStorePost }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PATCH /api/store-posts/[id] - Partially update a store post by ID
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await validateAuthenticatedUser();
    const body = await request.json();

    const storePost = await StorePost.findById(params.id);
    if (!storePost) {
      return NextResponse.json({ success: false, error: 'Store post not found' }, { status: 404 });
    }

    // Check if the authenticated user owns the post
    if (storePost.userId.toString() !== user.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    // Partially update the store post
    const updatedStorePost = await StorePost.findByIdAndUpdate(params.id, { $set: body }, { new: true });
    return NextResponse.json({ success: true, data: updatedStorePost }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE /api/store-posts/[id] - Delete a store post by ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await validateAuthenticatedUser();

    const storePost = await StorePost.findById(params.id);
    if (!storePost) {
      return NextResponse.json({ success: false, error: 'Store post not found' }, { status: 404 });
    }

    // Check if the authenticated user owns the post
    if (storePost.userId.toString() !== user.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    // Delete the store post
    await StorePost.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true, message: 'Store post deleted' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
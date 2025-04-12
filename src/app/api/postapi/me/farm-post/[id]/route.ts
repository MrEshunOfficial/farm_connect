import { auth } from '@/auth';
import { connect } from '@/hooks/dbconfigue/dbConfigue';
import { FarmPost } from '@/models/post.model/farm-post-schema';
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

// GET /api/farm-posts/[id] - Fetch a single farm post by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    let query;
    if (userId) {
      query = FarmPost.find({ userProfile: userId });
    } else {
      query = FarmPost.findById(params.id);
    }

    // Apply population to either query type
    const farmPost = await query
      .populate('userProfile')

    if (!farmPost) {
      return NextResponse.json(
        { success: false, error: 'Farm post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: farmPost },
      { status: 200 }
    );

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/farm-posts/[id] - Update a farm post by ID
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await validateAuthenticatedUser();
    const body = await request.json();

    const farmPost = await FarmPost.findById(params.id);
    if (!farmPost) {
      return NextResponse.json({ success: false, error: 'Farm post not found' }, { status: 404 });
    }

    // Check if the authenticated user owns the post
    if (farmPost.userId.toString() !== user.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    // Update the farm post
    const updatedFarmPost = await FarmPost.findByIdAndUpdate(params.id, body, { new: true });
    return NextResponse.json({ success: true, data: updatedFarmPost }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PATCH /api/farm-posts/[id] - Partially update a farm post by ID
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await validateAuthenticatedUser();
    const body = await request.json();

    const farmPost = await FarmPost.findById(params.id);
    if (!farmPost) {
      return NextResponse.json({ success: false, error: 'Farm post not found' }, { status: 404 });
    }

    // Check if the authenticated user owns the post
    if (farmPost.userId.toString() !== user.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    // Partially update the farm post
    const updatedFarmPost = await FarmPost.findByIdAndUpdate(params.id, { $set: body }, { new: true });
    return NextResponse.json({ success: true, data: updatedFarmPost }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE /api/farm-posts/[id] - Delete a farm post by ID
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await validateAuthenticatedUser();

    const farmPost = await FarmPost.findById(params.id);
    if (!farmPost) {
      return NextResponse.json({ success: false, error: 'Farm post not found' }, { status: 404 });
    }

    // Check if the authenticated user owns the post
    if (farmPost.userId.toString() !== user.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    // Delete the farm post
    await FarmPost.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true, message: 'Farm post deleted' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

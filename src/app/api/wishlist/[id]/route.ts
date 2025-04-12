// File: app/api/wishlist/[id]/route.ts
import { connect } from '@/hooks/dbconfigue/dbConfigue';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import mongoose from 'mongoose';
import WishlistModel, { WishlistItemModel } from '@/models/profileModel/wishListModel';

// Helper function to handle errors
function handleError(error: any) {
  console.error('Wishlist item operation error:', error);
  return NextResponse.json(
    { 
      success: false, 
      message: error.message || 'An error occurred during the wishlist item operation'
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

// GET specific wishlist item
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connect();
    const user = await validateAuthenticatedUser();
    
    const wishlistItem = await WishlistItemModel.findOne({ 
      _id: params.id,
      userId: user.id 
    });
    
    if (!wishlistItem) {
      return NextResponse.json(
        { success: false, message: 'Wishlist item not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      data: wishlistItem 
    });
  } catch (error: any) {
    return handleError(error);
  }
}

// PUT update wishlist item
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connect();
    const user = await validateAuthenticatedUser();
    
    const body = await req.json();
    
    // Find the wishlist item
    const wishlistItem = await WishlistItemModel.findOne({ 
      _id: params.id,
      userId: user.id 
    });
    
    if (!wishlistItem) {
      return NextResponse.json(
        { success: false, message: 'Wishlist item not found' },
        { status: 404 }
      );
    }
    
    // Update fields (only allow updating certain fields)
    if (body.notes !== undefined) {
      wishlistItem.notes = body.notes;
    }
    
    if (body.inStock !== undefined) {
      wishlistItem.inStock = body.inStock;
    }
    
    if (body.availability !== undefined) {
      wishlistItem.availability = {
        ...wishlistItem.availability,
        ...body.availability
      };
    }
    
    await wishlistItem.save();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Wishlist item updated',
      data: wishlistItem 
    });
  } catch (error: any) {
    return handleError(error);
  }
}

// DELETE remove item from wishlist
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connect();
    const user = await validateAuthenticatedUser();
    
    // Find the wishlist
    const wishlist = await WishlistModel.findOne({ userId: user.id });
    
    if (!wishlist) {
      return NextResponse.json(
        { success: false, message: 'Wishlist not found' },
        { status: 404 }
      );
    }
    
    // Convert string to ObjectId
    const itemId = new mongoose.Types.ObjectId(params.id);
    
    // Check if item exists
    const wishlistItem = await WishlistItemModel.findOne({
      _id: itemId,
      userId: user.id
    });
    
    if (!wishlistItem) {
      return NextResponse.json(
        { success: false, message: 'Wishlist item not found' },
        { status: 404 }
      );
    }
    
    // Remove the item using the model method
    await wishlist.removeItem(itemId);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Item removed from wishlist'
    });
  } catch (error: any) {
    return handleError(error);
  }
}
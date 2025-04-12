// File: app/api/wishlist/route.ts
import mongoose from 'mongoose';
import { connect } from '@/hooks/dbconfigue/dbConfigue';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { UserProfile } from '@/models/profileModel/userProfileModel';
import { WishlistItemType } from '@/models/profileI-interfaces';
import WishlistModel, { WishlistItemModel } from '@/models/profileModel/wishListModel';

// Helper function to handle errors
function handleError(error: any) {
  console.error('Wishlist operation error:', error);
  return NextResponse.json(
    { 
      success: false, 
      message: error.message || 'An error occurred during the wishlist operation'
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

// GET user's wishlist
export async function GET(req: NextRequest) {
  try {
    await connect();
    const user = await validateAuthenticatedUser();
    
    // Find or create wishlist for the user
    let wishlist = await WishlistModel.findOne({ userId: user.id })
      .populate('items')
      .populate('userProfile');
    
    if (!wishlist) {
      // Get user profile first
      const userProfile = await UserProfile.findOne({ userId: user.id });
      
      if (!userProfile) {
        return NextResponse.json(
          { success: false, message: 'User profile not found' },
          { status: 404 }
        );
      }
      
      // Create new wishlist
      wishlist = new WishlistModel({
        userId: user.id,
        userProfile: userProfile._id,
        items: []
      });
      await wishlist.save();
    }
    
    return NextResponse.json({ 
      success: true, 
      data: wishlist,
      summary: wishlist.getWishlistSummary()
    });
  } catch (error: any) {
    return handleError(error);
  }
}

// POST add item to wishlist
export async function POST(req: NextRequest) {
  try {
    await connect();
    const user = await validateAuthenticatedUser();
    const body = await req.json();
    
    // Validate required fields
    if (!body.itemId || !body.itemType || !body.productName) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if itemType is valid
    if (!Object.values(WishlistItemType).includes(body.itemType)) {
      return NextResponse.json(
        { success: false, message: 'Invalid item type' },
        { status: 400 }
      );
    }
    
    // Find or create wishlist for the user
    let wishlist = await WishlistModel.findOne({ userId: user.id });
    
    if (!wishlist) {
      // Get user profile first
      const userProfile = await UserProfile.findOne({ userId: user.id });
      
      if (!userProfile) {
        return NextResponse.json(
          { success: false, message: 'User profile not found' },
          { status: 404 }
        );
      }
      
      // Create new wishlist
      wishlist = new WishlistModel({
        userId: user.id,
        userProfile: userProfile._id,
        items: []
      });
      await wishlist.save();
    }
    
    // Check if item already exists in wishlist
    const existingItem = await WishlistItemModel.findOne({
      userId: user.id,
      itemId: body.itemId,
      itemType: body.itemType
    });
    
    if (existingItem) {
      return NextResponse.json(
        { success: false, message: 'Item already in wishlist' },
        { status: 400 }
      );
    }
    
    // Create new wishlist item
    const newItem = new WishlistItemModel({
      userId: user.id,
      itemId: new mongoose.Types.ObjectId(body.itemId),
      itemType: body.itemType,
      productName: body.productName,
      productImage: body.productImage || undefined,
      price: body.price || undefined,
      currency: body.currency || undefined,
      inStock: body.inStock !== undefined ? body.inStock : true,
      availability: body.availability || undefined,
      notes: body.notes || undefined
    });
    
    // Add item to wishlist
    await wishlist.addItem(newItem);
    
    // Refresh the wishlist data
    wishlist = await WishlistModel.findById(wishlist._id).populate('items');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Item added to wishlist',
      data: wishlist,
      summary: wishlist?.getWishlistSummary()
    });
  } catch (error: any) {
    return handleError(error);
  }
}

// DELETE clear all items from wishlist
export async function DELETE(req: NextRequest) {
  try {
    await connect();
    const user = await validateAuthenticatedUser();
    
    // Find wishlist for the user
    const wishlist = await WishlistModel.findOne({ userId: user.id });
    
    if (!wishlist) {
      return NextResponse.json(
        { success: false, message: 'Wishlist not found' },
        { status: 404 }
      );
    }
    
    // Clear all items
    await wishlist.clearWishlist();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Wishlist cleared',
      data: wishlist
    });
  } catch (error: any) {
    return handleError(error);
  }
}
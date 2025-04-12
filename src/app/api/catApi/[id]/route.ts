import { connect } from '@/hooks/dbconfigue/dbConfigue';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { CartItem } from '@/models/profileModel/cartModel';

// Helper function to handle errors
function handleError(error: any) {
  console.error('Cart operation error:', error);
  return NextResponse.json(
    { 
      success: false, 
      message: error.message || 'An error occurred during the cart operation'
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

// GET specific cart item
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connect();
    const user = await validateAuthenticatedUser();
    
    const cartItem = await CartItem.findOne({ 
      _id: params.id,
      userId: user.id 
    });
    
    if (!cartItem) {
      return NextResponse.json(
        { success: false, message: 'Cart item not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      data: cartItem 
    });
  } catch (error: any) {
    return handleError(error);
  }
}

// PUT update cart item
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connect();
    const user = await validateAuthenticatedUser();
    
    const body = await req.json();
    
    // Find the cart item
    const cartItem = await CartItem.findOne({ 
      _id: params.id,
      userId: user.id 
    });
    
    if (!cartItem) {
      return NextResponse.json(
        { success: false, message: 'Cart item not found' },
        { status: 404 }
      );
    }
    
    // Update fields
    if (body.quantity !== undefined) {
      if (body.quantity < 1) {
        return NextResponse.json(
          { success: false, message: 'Quantity must be at least 1' },
          { status: 400 }
        );
      }
      cartItem.quantity = body.quantity;
    }
    
    // Add other updatable fields as needed
    if (body.price !== undefined) {
      cartItem.price = body.price;
    }
    
    if (body.title !== undefined) {
      cartItem.title = body.title;
    }
    
    if (body.imageUrl !== undefined) {
      cartItem.imageUrl = body.imageUrl;
    }
    
    if (body.currency !== undefined) {
      cartItem.currency = body.currency;
    }
    
    if (body.unit !== undefined) {
      cartItem.unit = body.unit;
    }
    
    await cartItem.save();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Cart item updated',
      data: cartItem 
    });
  } catch (error: any) {
    return handleError(error);
  }
}

// DELETE remove item from cart
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connect();
    const user = await validateAuthenticatedUser();
    
    // Find and delete the cart item
    const result = await CartItem.findOneAndDelete({ 
      _id: params.id,
      userId: user.id 
    });
    
    if (!result) {
      return NextResponse.json(
        { success: false, message: 'Cart item not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Item removed from cart'
    });
  } catch (error: any) {
    return handleError(error);
  }
}
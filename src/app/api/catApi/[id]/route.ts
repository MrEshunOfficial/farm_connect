import { connect } from '@/hooks/dbconfigue/dbConfigue';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { CartItem } from '@/models/profileModel/cartModel';

// Types for better TypeScript support
interface RouteParams {
  params: Promise<{ id: string }>;
}

interface CartItemUpdateData {
  quantity?: number;
  price?: number;
  title?: string;
  imageUrl?: string;
  currency?: string;
  unit?: string;
}

// Helper function to handle errors
function handleError(error: any): NextResponse {
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
  context: RouteParams
): Promise<NextResponse> {
  try {
    await connect();
    const user = await validateAuthenticatedUser();
    
    // Await the params as they're now asynchronous
    const { id } = await context.params;
    
    const cartItem = await CartItem.findOne({ 
      _id: id,
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
  context: RouteParams
): Promise<NextResponse> {
  try {
    await connect();
    const user = await validateAuthenticatedUser();
    
    // Await the params as they're now asynchronous
    const { id } = await context.params;
    const body: CartItemUpdateData = await req.json();
    
    // Find the cart item
    const cartItem = await CartItem.findOne({ 
      _id: id,
      userId: user.id 
    });
    
    if (!cartItem) {
      return NextResponse.json(
        { success: false, message: 'Cart item not found' },
        { status: 404 }
      );
    }
    
    // Validate quantity if provided
    if (body.quantity !== undefined) {
      if (body.quantity < 1) {
        return NextResponse.json(
          { success: false, message: 'Quantity must be at least 1' },
          { status: 400 }
        );
      }
      cartItem.quantity = body.quantity;
    }
    
    // Update other fields if provided
    const updateableFields: (keyof CartItemUpdateData)[] = [
      'price', 'title', 'imageUrl', 'currency', 'unit'
    ];
    
    updateableFields.forEach(field => {
      if (body[field] !== undefined) {
        cartItem[field] = body[field];
      }
    });
    
    await cartItem.save();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Cart item updated successfully',
      data: cartItem 
    });
  } catch (error: any) {
    return handleError(error);
  }
}

// DELETE remove item from cart
export async function DELETE(
  req: NextRequest,
  context: RouteParams
): Promise<NextResponse> {
  try {
    await connect();
    const user = await validateAuthenticatedUser();
    
    // Await the params as they're now asynchronous
    const { id } = await context.params;
    
    // Find and delete the cart item
    const result = await CartItem.findOneAndDelete({ 
      _id: id,
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
      message: 'Item removed from cart successfully'
    });
  } catch (error: any) {
    return handleError(error);
  }
}
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

// GET all cart items for the authenticated user
export async function GET(req: NextRequest) {
  try {
    await connect();
    const user = await validateAuthenticatedUser();
    
    const cartItems = await CartItem.find({ userId: user.id });
    
    return NextResponse.json({ 
      success: true, 
      data: cartItems 
    });
  } catch (error: any) {
    return handleError(error);
  }
}

// POST add item to cart
export async function POST(req: NextRequest) {
  try {
    await connect();
    const user = await validateAuthenticatedUser();
    
    const body = await req.json();
    
    // Validate required fields
    const requiredFields = ['id', 'type', 'quantity', 'price'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, message: `${field} is required` },
          { status: 400 }
        );
      }
    }
    
    // Set the userId from the authenticated user
    body.userId = user.id;
    
    // Check if item already exists in cart
    const existingItem = await CartItem.findOne({ 
      userId: user.id, 
      id: body.id 
    });
    
    if (existingItem) {
      // Update quantity if item already exists
      existingItem.quantity += body.quantity;
      await existingItem.save();
      
      return NextResponse.json({ 
        success: true, 
        message: 'Item quantity updated in cart',
        data: existingItem 
      });
    }
    
    // Create new cart item
    const newCartItem = new CartItem(body);
    const savedItem = await newCartItem.save();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Item added to cart',
      data: savedItem 
    }, { status: 201 });
  } catch (error: any) {
    return handleError(error);
  }
}


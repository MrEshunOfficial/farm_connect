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

// DELETE all items from cart (clear cart)
export async function DELETE(req: NextRequest) {
  try {
    await connect();
    const user = await validateAuthenticatedUser();
    
    // Delete all cart items for this user
    const result = await CartItem.deleteMany({ userId: user.id });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Cart cleared',
      count: result.deletedCount 
    });
  } catch (error: any) {
    return handleError(error);
  }
}
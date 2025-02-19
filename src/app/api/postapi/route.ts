import { connect } from '@/hooks/dbconfigue/dbConfigue';
import { FarmPost } from '@/models/post.model/farm-post-schema';
import { StorePost } from '@/models/post.model/store-post-schema';
import { NextRequest, NextResponse } from 'next/server';

interface PaginationParams {
  page: number;
  limit: number;
  totalDocs: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalPages: number;
}

interface QueryFilters {
  [key: string]: any;
  'category.id'?: string;
  'subcategory.id'?: string;
  userProfile?: string;
  $or?: Array<{
    'FarmProfile.farmLocation.region'?: string;
    'storeLocation.region'?: string;
  }>;
}

export async function GET(
  request: NextRequest
): Promise<NextResponse> {
  try {
    await connect();

    // Get URL params using searchParams
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const region = searchParams.get('region');
    const userId = searchParams.get('userId');

    // Build filter object with proper typing
    const filter: QueryFilters = {};
    
    if (category) filter['category.id'] = category;
    if (subcategory) filter['subcategory.id'] = subcategory;
    if (userId) filter.userProfile = userId;
    if (region) {
      filter.$or = [
        { 'FarmProfile.farmLocation.region': region },
        { 'storeLocation.region': region }
      ];
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Execute queries in parallel
    const [farmPosts, storePosts, totalFarmDocs, totalStoreDocs] = await Promise.all([
      FarmPost.find(filter)
        .skip(skip)
        .limit(limit)
        .populate('userProfile', 'firstName lastName profilePicture')
        .sort({ createdAt: -1 })
        .lean(),

      StorePost.find(filter)
        .skip(skip)
        .limit(limit)
        .populate('userProfile', 'firstName lastName profilePicture')
        .populate('storeProfile', 'storeName storeImage')
        .sort({ createdAt: -1 })
        .lean(),

      FarmPost.countDocuments(filter),
      StorePost.countDocuments(filter)
    ]);

    // Calculate pagination params
    const totalDocs = totalFarmDocs + totalStoreDocs;
    const totalPages = Math.ceil(totalDocs / limit);

    const paginationData: PaginationParams = {
      page,
      limit,
      totalDocs,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      totalPages
    };

    return NextResponse.json({
      success: true,
      data: {
        farmPosts,
        storePosts,
        pagination: paginationData
      }
    });
  } catch (error: any) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: `Failed to fetch posts: ${error.message}`
      },
      { status: 500 }
    );
  }
}
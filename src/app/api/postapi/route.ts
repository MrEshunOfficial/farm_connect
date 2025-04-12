import { connect } from '@/hooks/dbconfigue/dbConfigue';
import { FarmPost } from '@/models/post.model/farm-post-schema';
import { StorePost } from '@/models/post.model/store-post-schema';
import { IFarmPostDocument, IStorePostDocument, IUserProfile } from '@/models/profileI-interfaces';
import { NextRequest, NextResponse } from 'next/server';

interface PaginationParams {
  page: number;
  limit: number;
  totalDocs: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalPages: number;
}

interface LocationFilter {
  region?: string;
  district?: string;
}

interface QueryFilters {
  'category.id'?: string;
  'subcategory.id'?: string;
  userProfile?: string;
  $or?: Array<{
    'FarmProfile.farmLocation'?: LocationFilter;
    'storeLocation'?: LocationFilter;
  } | {
    [key: string]: { $regex: RegExp } | { $regex: string; $options: string };
  }>;
  [key: string]: any;
}

interface PostResponse {
  success: boolean;
  data?: {
    farmPosts: Array<IFarmPostDocument>;
    storePosts: Array<IStorePostDocument>;
    pagination: PaginationParams;
  };
  error?: string;
}

export async function GET(
  request: NextRequest
): Promise<NextResponse<PostResponse>> {
  try {
    await connect();
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const region = searchParams.get('region');
    const district = searchParams.get('district');
    const userId = searchParams.get('userId');
    const searchText = searchParams.get('search');

    // Build location filter
    const locationFilter: LocationFilter = {};
    if (region) locationFilter.region = region;
    if (district) locationFilter.district = district;

    // Build main filter object
    const filter: QueryFilters = {};
    
    if (category) filter['category.id'] = category;
    if (subcategory) filter['subcategory.id'] = subcategory;
    if (userId) filter.userProfile = userId;
    
    // Add location filter if either region or district is specified
    if (Object.keys(locationFilter).length > 0) {
      filter.$or = [
        { 'FarmProfile.farmLocation': locationFilter },
        { 'storeLocation': locationFilter }
      ];
    }

    // Add text search functionality
    if (searchText && searchText.trim() !== '') {
      const searchTerm = searchText.trim();
      
      // FIX: Don't create RegExp object if using $options
      // We'll use the string with $options approach instead
      
      if (filter.$or) {
        // If location filters exist, we need to combine them with the text search
        const locationFilters = filter.$or;
        
        // Create search filters based on the schema definitions
        filter.$or = [
          ...locationFilters,
          // Common fields in both document types
          { 'category.name': { $regex: searchTerm, $options: 'i' } },
          { 'subcategory.name': { $regex: searchTerm, $options: 'i' } },
          { 'tags.label': { $regex: searchTerm, $options: 'i' } },
          { 'tags.value': { $regex: searchTerm, $options: 'i' } },
          
          // Farm post specific fields
          { 'FarmProfile.farmName': { $regex: searchTerm, $options: 'i' } },
          { 'product.nameOfProduct': { $regex: searchTerm, $options: 'i' } },
          { 'product.description': { $regex: searchTerm, $options: 'i' } },
          { 'product.quality_grade': { $regex: searchTerm, $options: 'i' } },
          
          // Store post specific fields
          { 'storeProfile.storeName': { $regex: searchTerm, $options: 'i' } },
          { 'storeProfile.description': { $regex: searchTerm, $options: 'i' } },
          { 'storeImage.itemName': { $regex: searchTerm, $options: 'i' } },
          { 'description': { $regex: searchTerm, $options: 'i' } },
          { 'condition': { $regex: searchTerm, $options: 'i' } },
        ];
      } else {
        // If no location filters, just create text search filters
        filter.$or = [
          // Common fields in both document types
          { 'category.name': { $regex: searchTerm, $options: 'i' } },
          { 'subcategory.name': { $regex: searchTerm, $options: 'i' } },
          { 'tags.label': { $regex: searchTerm, $options: 'i' } },
          { 'tags.value': { $regex: searchTerm, $options: 'i' } },
          
          // Farm post specific fields
          { 'FarmProfile.farmName': { $regex: searchTerm, $options: 'i' } },
          { 'product.nameOfProduct': { $regex: searchTerm, $options: 'i' } },
          { 'product.description': { $regex: searchTerm, $options: 'i' } },
          { 'product.quality_grade': { $regex: searchTerm, $options: 'i' } },
          
          // Store post specific fields
          { 'storeProfile.storeName': { $regex: searchTerm, $options: 'i' } },
          { 'storeProfile.description': { $regex: searchTerm, $options: 'i' } },
          { 'storeImage.itemName': { $regex: searchTerm, $options: 'i' } },
          { 'description': { $regex: searchTerm, $options: 'i' } },
          { 'condition': { $regex: searchTerm, $options: 'i' } },
        ];
      }
    }

    const skip = (page - 1) * limit;

    // Define population options
    const userProfileFields: (keyof IUserProfile)[] = ['fullName', 'profilePicture'];

    // Execute queries with proper type assertions
    const [farmPosts, storePosts, totalFarmDocs, totalStoreDocs] = await Promise.all([
      FarmPost.find(filter)
        .skip(skip)
        .limit(limit)
        .populate('userProfile', userProfileFields.join(' '))
        .sort({ createdAt: -1 })
        .lean<IFarmPostDocument[]>(),
      
      StorePost.find(filter)
        .skip(skip)
        .limit(limit)
        .populate('userProfile', userProfileFields.join(' '))
        .populate('storeProfile', 'storeName storeImages')
        .sort({ createdAt: -1 })
        .lean<IStorePostDocument[]>(),
      
      FarmPost.countDocuments(filter),
      StorePost.countDocuments(filter)
    ]);

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
    
  } catch (error) {
    console.error('Error fetching posts:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch posts'
    }, {
      status: 500
    });
  }
}
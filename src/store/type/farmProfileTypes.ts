import { z } from 'zod';

// Farm Profile Form Interface
export interface IFarmProfileForm {
  farmName: string;
  farmLocation: {
    region: string;
    district: string;
  };
  nearbyLandmarks?: string[];
  gpsAddress?: string;
  farmSize: number;
  productionScale: 'Small' | 'Medium' | 'Commercial';
  farmImages?: Array<{
    url: string;
    fileName: string;
  }>;
  ownershipStatus: 'Owned' | 'Leased' | 'Rented' | 'Communal';
  fullName: string;
  contactPhone: string;
  contactEmail?: string;
  farmType: 'Crop Farming' | 'Livestock Farming' | 'Mixed' | 'Aquaculture' | 'Nursery' | 'Poultry' | 'Others';
  cropsGrown?: string[];
  livestockProduced?: string[];
  mixedCropsGrown?: string[];
  aquacultureType?: string[];
  nurseryType?: string[];
  poultryType?: string[];
  othersType?: string[];
  belongsToCooperative: boolean;
  additionalNotes: string;
  cooperativeName?: string;
}
const farmLocationSchema = z.object({
  region: z.string().min(1, "Region is required"),
  district: z.string().min(1, "District is required"),
});
// Form Validation Schema
export const farmProfileFormSchema = z.object({
  farmName: z.string()
    .min(2, 'Farm name must be at least 2 characters')
    .max(100, 'Farm name must not exceed 100 characters'),
  
    farmLocation: farmLocationSchema,

  nearbyLandmarks: z.array(z.string().max(100)).optional(),
  
  gpsAddress: z.string().max(200).optional(),
  
  farmSize: z.number()
    .min(0, 'Farm size cannot be negative')
    .max(10000, 'Farm size seems unrealistically large'),
  
  productionScale: z.enum(['Small', 'Medium', 'Commercial']),
  
  farmImages: z.array(z.object({
    url: z.string().url('Invalid image URL'),
    fileName: z.string().min(1).max(255)
  })).optional(),
  
  ownershipStatus: z.enum(['Owned', 'Leased', 'Rented', 'Communal']),
  
  fullName: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(50, 'Full name must not exceed 50 characters'),
  
  contactPhone: z.string()
    .regex(/^(\+\d{1,3}[- ]?)?\d{10,15}$/, 'Invalid phone number format'),
  
  contactEmail: z.string().email('Invalid email address').optional(),
  
  farmType: z.enum([
    'Crop Farming',
    'Livestock Farming',
    'Mixed',
    'Aquaculture',
    'Nursery',
    'Poultry',
    'Others'
  ]),
  
  cropsGrown: z.array(z.string().max(100)).optional(),
  livestockProduced: z.array(z.string().max(100)).optional(),
  mixedCropsGrown: z.array(z.string().max(100)).optional(),
  aquacultureType: z.array(z.string().max(100)).optional(),
  nurseryType: z.array(z.string().max(100)).optional(),
  poultryType: z.array(z.string().max(100)).optional(),
  othersType: z.array(z.string().max(100)).optional(),
  belongsToCooperative: z.boolean(),
  cooperativeName: z.string().max(100).optional(),
  additionalNotes: z.string().max(500).optional(),
}).refine((data) => {
  if (data.belongsToCooperative && !data.cooperativeName) {
    return false;
  }
  return true;
}, {
  message: "Cooperative name is required when belongs to cooperative is true",
  path: ["cooperativeName"],
});

// Default values for the form
export const defaultFarmProfileFormValues: IFarmProfileForm = {
  farmName: '',
  farmLocation: {
    region: '',
    district: '',
  },
  nearbyLandmarks: [],
  gpsAddress: '',
  farmSize: 0,
  productionScale: 'Small',
  farmImages: [],
  ownershipStatus: 'Owned',
  fullName: '',
  contactPhone: '',
  contactEmail: '',
  farmType: 'Crop Farming',
  cropsGrown: [],
  livestockProduced: [],
  mixedCropsGrown: [],
  aquacultureType: [],
  nurseryType: [],
  poultryType: [],
  othersType: [],
  belongsToCooperative: false,
  cooperativeName: '',
  additionalNotes: ''
};
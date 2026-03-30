import { Brand } from "./brandTypes";
import { UnitType } from "./orderTypes";

export interface Product {
  id: number;
  name: string;
  slug: string;
  brandId: number | null;
  brandName?: string | null;
  stock: number;
  requiresRx: boolean;
  isActive: boolean;
  shortDesc: string | null;
  image: string[];
  createdAt: string;
  updatedAt: string;
  units?: ProductUnit[];
}

export interface ProductDetail extends Product {
  productId: number;
  description: string | null;
  ingredients: string | null;
  usage: string | null;
  storageCondition: string | null;
  warnings: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  registrationNumber: string | null;
  manufacturer: string | null;
  origin: string | null;
  dosageForm: string | null;
  packaging: string | null;
  activeIngredients: string | null;
  composition: {
    active: string[];
    inactive: string;
  } | null;
  indications: string | null;
  contraindications: string | null;
  sideEffects: string | null;
  interactions: string | null;
  overdose: string | null;
  pharmacology: string | null;
  pregnancyLactation: string | null;
  brand: Brand | null;
  units: ProductUnit[];
}

export interface ProductUnit {
  id: number;
  unitType: UnitType;
  price: string;
  conversionFactor: string;
  isDefault: boolean;
}

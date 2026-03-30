export interface ProductDetailType {
  id: number;
  name: string;
  slug: string;
  brandId: number;
  stock: number;
  requiresRx: boolean;
  isActive: boolean;
  shortDesc: string;
  image: string[];
  createdAt: string;
  updatedAt: string;
  description?: null;
  logoUrl?: null;
  productId: number;
  ingredients: string;
  usage: string;
  storageCondition: string;
  warnings: string;
  seoTitle?: null;
  seoDescription?: null;
  registrationNumber: string;
  manufacturer: string;
  origin: string;
  dosageForm: string;
  packaging: string;
  activeIngredients: string;
  composition: Composition;
  indications: string;
  contraindications?: null;
  sideEffects?: null;
  interactions?: null;
  overdose?: null;
  pharmacology?: null;
  pregnancyLactation?: null;
}

export interface Composition {
  active: string[];
  inactive: string;
}

export type ProductColorImage = {
  colorName: string; // e.g. "Gold", "Black"
  colorHex?: string; // optional hex for quick preview
  imageUrl: string; // Supabase Storage public URL
};

export type Product = {
  id: string;
  name: string;
  description: string;
  amountCents: number; // store smallest unit
  sizes: string[]; // e.g. ["S","M","L"]
  colors: ProductColorImage[];
  createdAt: string;
  updatedAt: string;
};

export type NewProductInput = {
  name: string;
  description: string;
  amountCents: number;
  sizes: string[];
  colors: ProductColorImage[];
};

export interface MerchItem {
  id: string;
  title: string;
  description?: string;
  category?: string;
  priceCents: number;
  currency?: string;
  stock?: number;
  sku?: string;
  active?: boolean;
  artistId?: number | string | null; // backend puede enviar UUID string
  labelId?: number | null;
  coverId?: string | null;
  createdAt: string;
  updatedAt: string;
  artist?: any;
  label?: any;
  cover?: { url: string } | null;
}
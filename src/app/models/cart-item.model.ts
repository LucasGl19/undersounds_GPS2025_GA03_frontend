export type CartItemType = 'album' | 'merch';

export interface CartItem {
  id: string | number;
  itemType: CartItemType;
  name: string;
  price: number; // Precio en la misma unidad que Album.price (EUR)
  image: string;
  quantity: number;
}

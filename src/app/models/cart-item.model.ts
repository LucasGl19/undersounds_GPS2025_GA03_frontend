export type CartItemType = 'album' | 'merch';

export interface CartItem {
  id: string | number;
  itemType: CartItemType;
  name: string;
  price: number; 
  image: string;
  quantity: number;
}

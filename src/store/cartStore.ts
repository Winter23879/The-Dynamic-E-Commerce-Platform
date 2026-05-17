import { create } from "zustand";
import { addToCartAction, removeFromCartAction, updateCartItemAction } from "@/actions/cart";

export interface CartItemType {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  product: {
    id: string;
    title: string;
    price: number;
    image: string;
    stock: number;
    category: string;
  };
}

interface CartStore {
  items: CartItemType[];
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
  setCart: (items: CartItemType[]) => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (product: any, quantity?: number) => Promise<{ success?: boolean; error?: string }>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,
  isLoading: false,
  error: null,

  setCart: (items) => set({ items, isLoading: false, error: null }),
  openDrawer: () => set({ isOpen: true }),
  closeDrawer: () => set({ isOpen: false }),

  addItem: async (product, quantity = 1) => {
    // Optimistic addition
    const currentItems = get().items;
    const existingIndex = currentItems.findIndex((i) => i.productId === product.id);
    let tempItems = [...currentItems];

    if (existingIndex > -1) {
      tempItems[existingIndex] = {
        ...tempItems[existingIndex],
        quantity: tempItems[existingIndex].quantity + quantity,
      };
    } else {
      tempItems.push({
        id: `temp-${Date.now()}`,
        cartId: "temp",
        productId: product.id,
        quantity,
        product,
      });
    }

    set({ items: tempItems, isOpen: true });

    // Server action
    const res = await addToCartAction(product.id, quantity);
    if (res?.error) {
      // Revert optimistic update
      set({ items: currentItems, error: res.error });
      return { error: res.error };
    }
    return { success: true };
  },

  updateQuantity: async (itemId, quantity) => {
    const currentItems = get().items;
    if (quantity <= 0) {
      set({ items: currentItems.filter((i) => i.id !== itemId) });
      const res = await removeFromCartAction(itemId);
      if (res?.error) set({ items: currentItems, error: res.error });
    } else {
      set({
        items: currentItems.map((i) => (i.id === itemId ? { ...i, quantity } : i)),
      });
      const res = await updateCartItemAction(itemId, quantity);
      if (res?.error) set({ items: currentItems, error: res.error });
    }
  },

  removeItem: async (itemId) => {
    const currentItems = get().items;
    set({ items: currentItems.filter((i) => i.id !== itemId) });
    const res = await removeFromCartAction(itemId);
    if (res?.error) set({ items: currentItems, error: res.error });
  },

  clearCart: () => set({ items: [] }),
}));

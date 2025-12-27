import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl: string;
  author: string;
  slugText: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (newItem: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  // Bilgi alma yardımcıları
  getTotalPrice: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      // Ürün ekle veya varsa sayısını artır
      addItem: (newItem) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(
          (item) => item.id === newItem.id
        );

        if (existingItem) {
          const updatedItems = currentItems.map((item) =>
            item.id === newItem.id
              ? { ...item, quantity: item.quantity + newItem.quantity }
              : item
          );
          set({ items: updatedItems });
        } else {
          set({ items: [...currentItems, newItem] });
        }
      },

      // Ürünü tamamen sil
      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },

      // Adet güncelle
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        });
      },

      // Sepeti boşalt
      clearCart: () => set({ items: [] }),

      // Toplam fiyat hesapla
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      // Toplam ürün adedi (Badge için)
      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: "3d-store-storage", // LocalStorage'daki anahtar ismi
      storage: createJSONStorage(() => localStorage), // Veriyi nereye kaydedeceği
    }
  )
);

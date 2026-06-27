"use client";

import { CartStoreActionsType, CartStoreStateType } from "@repo/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useCartStore = create<CartStoreStateType & CartStoreActionsType>()(
  persist(
    (set) => ({
      cart: [],
      hasHydrated: false,

      addToCart: (product) =>
        set((state) => {
          const existingIndex = state.cart.findIndex(
            (p) =>
              p.id === product.id && p.selectedSize === product.selectedSize,
          );

          if (existingIndex !== -1) {
            const updatedCart = [...state.cart];

            const existingProduct = updatedCart[existingIndex];

            if (existingProduct) {
              existingProduct.quantity += product.quantity || 1;
            }
            return {
              cart: updatedCart,
            };
          }

          return {
            cart: [...state.cart, product],
          };
        }),

      removeFromCart: (product) =>
        set((state) => ({
          cart: state.cart.filter(
            (p) =>
              !(p.id === product.id && p.selectedSize === product.selectedSize),
          ),
        })),

      clearCart: () =>
        set({
          cart: [],
        }),
    }),
    {
      name: "cart",

      storage: createJSONStorage(() => localStorage),

      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hasHydrated = true;
        }
      },
    },
  ),
);

export default useCartStore;

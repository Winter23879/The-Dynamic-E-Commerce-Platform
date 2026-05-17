"use client";

import { useEffect, useRef } from "react";
import { useCartStore } from "@/store/cartStore";
import { getCartAction } from "@/actions/cart";

export function CartInitializer({ initialItems }: { initialItems?: any[] }) {
  const setCart = useCartStore((state) => state.setCart);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (initialItems && !isInitialized.current) {
      setCart(initialItems);
      isInitialized.current = true;
    } else if (!isInitialized.current) {
      getCartAction().then((res) => {
        if (res.success && res.cart) {
          setCart(res.cart.items);
          isInitialized.current = true;
        }
      });
    }
  }, [initialItems, setCart]);

  return null;
}

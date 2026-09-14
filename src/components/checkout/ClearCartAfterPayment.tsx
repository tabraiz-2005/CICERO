"use client";

import { useEffect, useRef } from "react";
import { useCart } from 
"@/context/CartContext";

export function ClearCartAfterPayment() {
  const { clearCart } = useCart();
  const hasCleared = useRef(false);

  useEffect(() => {
    if (!hasCleared.current) {
      hasCleared.current = true;
      clearCart();
    }
  }, [clearCart]);

  return null;
}


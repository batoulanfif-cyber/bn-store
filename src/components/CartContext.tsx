'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { CartItem } from '@/lib/db-types';

interface CartContextType {
  items: CartItem[];
  addItem: (productId: number, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: (products: Record<number, { price: number }>) => number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('bn_store_cart');
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch {
        setItems([]);
      }
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('bn_store_cart', JSON.stringify(items));
    }
  }, [items, mounted]);

  const addItem = useCallback((productId: number, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(item => item.product_id === productId);
      if (existing) {
        return prev.map(item => 
          item.product_id === productId 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product_id: productId, quantity }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((productId: number) => {
    setItems(prev => prev.filter(item => item.product_id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems(prev => prev.map(item => 
      item.product_id === productId ? { ...item, quantity } : item
    ));
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getTotalItems = useCallback(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const getSubtotal = useCallback((products: Record<number, { price: number }>) => {
    return items.reduce((sum, item) => {
      const product = products[item.product_id];
      return sum + (product?.price || 0) * item.quantity;
    }, 0);
  }, [items]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen(prev => !prev), []);

  if (!mounted) {
    return (
      <CartContext.Provider value={{
        items: [],
        addItem: () => {},
        removeItem: () => {},
        updateQuantity: () => {},
        clearCart: () => {},
        getTotalItems: () => 0,
        getSubtotal: () => 0,
        isOpen: false,
        openCart: () => {},
        closeCart: () => {},
        toggleCart: () => {},
      }}>
        {children}
      </CartContext.Provider>
    );
  }

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      getTotalItems,
      getSubtotal,
      isOpen,
      openCart,
      closeCart,
      toggleCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
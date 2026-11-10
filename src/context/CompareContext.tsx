import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

import type { Product } from "../types/product";

type CompareContextType = {
  compareProducts: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: number) => void;
  clearCompare: () => void;
  isCompared: (productId: number) => boolean;
};

const CompareContext = createContext<CompareContextType | undefined>(undefined);

const STORAGE_KEY = "techzone-compare-products";

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareProducts, setCompareProducts] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as Product[]).slice(0, 3) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(compareProducts));
  }, [compareProducts]);

  function addToCompare(product: Product) {
    setCompareProducts((prev) => {
      if (prev.some((item) => item.id === product.id)) {
        return prev;
      }

      if (prev.length >= 3) {
        return prev;
      }

      return [...prev, product];
    });
  }

  function removeFromCompare(productId: number) {
    setCompareProducts((prev) =>
      prev.filter((product) => product.id !== productId),
    );
  }

  function clearCompare() {
    setCompareProducts([]);
  }

  function isCompared(productId: number) {
    return compareProducts.some((product) => product.id === productId);
  }

  return (
    <CompareContext.Provider
      value={{
        compareProducts,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isCompared,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);

  if (!context) {
    throw new Error("useCompare must be used inside CompareProvider");
  }

  return context;
}

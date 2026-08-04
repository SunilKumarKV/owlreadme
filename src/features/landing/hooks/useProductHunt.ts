import { useState, useEffect } from 'react';
import { ProductHuntData } from '../types/product-hunt';
import { fetchProductHuntData } from '../services/productHunt.service';

export function useProductHunt(): ProductHuntData {
  const [data, setData] = useState<ProductHuntData>({
    post: null,
    isAvailable: false,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      const result = await fetchProductHuntData();
      if (!isMounted) return;

      setData({
        post: result.post,
        isAvailable: result.isAvailable,
        loading: false,
        error: result.error || null,
      });
    }

    // Defer API call microtask tick
    Promise.resolve().then(() => {
      if (isMounted) {
        loadData();
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return data;
}

export default useProductHunt;

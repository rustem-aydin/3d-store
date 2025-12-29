// hooks/useProducts.ts
import { useQuery } from "@tanstack/react-query";
import { productService } from "../services/productService";

export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (limit: number) => [...productKeys.lists(), limit] as const,
  detail: (slug: string) => [...productKeys.all, "detail", slug] as const,
};

export function useProducts(limit = 20) {
  return useQuery({
    queryKey: productKeys.list(limit),
    queryFn: () => productService.getProducts(limit),
  });
}

export function useProductDetail(slug: string) {
  return useQuery({
    queryKey: productKeys.detail(slug),
    queryFn: () => productService.getProductBySlug(slug),
    enabled: !!slug,
  });
}

export function useProductFiles(slug: string) {
  return useQuery({
    queryKey: ["products", "files", slug],
    queryFn: () => productService.getProductFilesBySlug(slug),
    enabled: !!slug, // slug yoksa boşuna istek atma
    staleTime: 1000 * 60 * 60, // Dosya listesi nadir değiştiği için 1 saat cache'de tutulabilir
  });
}

// hooks/useProducts.ts
import { useQuery } from "@tanstack/react-query";
import { collectionService } from "../services/categoryService";

export const collectionKeys = {
  all: ["categories"] as const,
  lists: () => [...collectionKeys.all, "list"] as const,
  list: (limit: number) => [...collectionKeys.lists(), limit] as const,
  detail: (slug: string) => [...collectionKeys.all, "detail", slug] as const,
  slugwithproducst: (slug: string) =>
    [...collectionKeys.all, "products", slug] as const,
};

export function useCollections(limit = 20) {
  return useQuery({
    queryKey: collectionKeys.list(limit),
    queryFn: () => collectionService.getCollections(limit),
  });
}

export function useCollectionDetail(slug: string) {
  return useQuery({
    queryKey: collectionKeys.detail(slug),
    queryFn: () => collectionService.getCollectionBySlug(slug),
    enabled: !!slug,
  });
}
export function useCollectionProducts(slug: string) {
  return useQuery({
    queryKey: collectionKeys.slugwithproducst(slug),
    queryFn: () => collectionService.getProductsByCollectionSlug(slug),
    enabled: !!slug,
  });
}

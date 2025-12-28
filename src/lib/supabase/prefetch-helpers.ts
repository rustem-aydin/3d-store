import { QueryClient } from "@tanstack/react-query";
import { productKeys } from "./hooks/usePoducts";
import { productService } from "./services/productService";
import { collectionKeys } from "./hooks/useCollections";
import { collectionService } from "./services/categoryService";

export async function prefetchProducts(limit = 20) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: productKeys.list(limit),
    queryFn: () => productService.getProducts(limit),
  });

  return queryClient;
}

export async function prefetchProductsBySlug(slug: string) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: productKeys.detail(slug),
    queryFn: () => productService.getProductBySlug(slug),
  });

  return queryClient;
}

export async function prefetchCollections() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: collectionKeys.lists(),
    queryFn: () => collectionService.getAllCollections(),
  });

  return queryClient;
}

export async function prefetchCollectionBySlug(slug: string) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: collectionKeys.detail(slug),
    queryFn: () => collectionService.getCollectionBySlug(slug),
  });

  return queryClient;
}
export async function prefetchPoductByCategorySlug(slug: string) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: collectionKeys.slugwithproducst(slug),
    queryFn: () => collectionService.getCollectionBySlug(slug),
  });

  return queryClient;
}

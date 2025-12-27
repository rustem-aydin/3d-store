import { QueryClient } from "@tanstack/react-query";
import { productKeys } from "./hooks/usePoducts";
import { productService } from "./services/productService";

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

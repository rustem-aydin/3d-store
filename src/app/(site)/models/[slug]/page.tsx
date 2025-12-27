import ModelDetailsContainer from "@/app/components/models/models-details";
import { prefetchProductsBySlug } from "@/lib/supabase/prefetch-helpers";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function ModelDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  console.log("Gelen Slug:", slug); // Terminalde ne yazdığına bak

  const queryClient = await prefetchProductsBySlug(slug);

  // Cache içindeki veriyi kontrol et
  const prefetchedData = queryClient.getQueryData(["products", "detail", slug]);
  console.log("Prefetch Edilen Veri:", prefetchedData); // Eğer null ise DB'den gelmiyor demektir.

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ModelDetailsContainer slug={slug} />
    </HydrationBoundary>
  );
}

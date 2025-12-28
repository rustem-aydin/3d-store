import ModelDetailsContainer from "@/app/components/models/models-details";
import { prefetchProductsBySlug } from "@/lib/supabase/prefetch-helpers";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
export const runtime = "edge";
export default async function ModelDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const queryClient = await prefetchProductsBySlug(slug);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ModelDetailsContainer slug={slug} />
    </HydrationBoundary>
  );
}

import CollectionList from "@/app/components/collections/collection-list";
import { prefetchCollectionBySlug } from "@/lib/supabase/prefetch-helpers";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
export default async function CollectionDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const queryClient = await prefetchCollectionBySlug(slug);

  return (
    <section>
      <div className="container relative z-10">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <CollectionList slug={slug} />
        </HydrationBoundary>
      </div>
    </section>
  );
}

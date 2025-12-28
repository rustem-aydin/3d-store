import Innovation from "@/app/components/home/innovation";
import { prefetchCollections } from "@/lib/supabase/prefetch-helpers";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export default async function ModelsPage() {
  const queryClient = await prefetchCollections();

  return (
    <section>
      <div className="relative w-full pt-44 2xl:pb-20 pb-10 before:absolute before:w-full before:h-full before:bg-linear-to-r before:from-blue_gradient before:via-white before:to-yellow_gradient dark:before:from-dark_blue_gradient dark:before:via-black dark:before:to-dark_yellow_gradient dark:before:rounded-full dark:before:blur-3xl dark:before:-z-10 before:rounded-full before:top-24 before:blur-3xl  before:-z-10">
        <div className="container relative z-10">
          <HydrationBoundary state={dehydrate(queryClient)}>
            <Innovation limit={10} />
          </HydrationBoundary>
        </div>
      </div>
    </section>
  );
}

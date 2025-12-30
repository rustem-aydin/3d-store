"use client";
import { ModelCard } from "./models-card";
import { useProducts } from "@/lib/supabase/hooks/usePoducts";

export default function ModelList({ limit }: { limit: number }) {
  const { data: products } = useProducts(limit);

  return (
    <section>
      <div className="px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 mb-20">
          {products?.map((model: any) => {
            const orderedImage = model.product_images?.find(
              (img: any) => img.display_order === 1
            );

            const finalImageUrl =
              orderedImage?.image_url || "/images/logo/DarkModeLogo.svg";

            const categoryName =
              model.collection_products?.[0]?.collections?.name || "3D Model";

            return (
              <ModelCard
                key={model?.id}
                slug_text={model.slug_text}
                title={model.title}
                category={categoryName}
                price={model.price === 0 ? "Ücretsiz" : `${model.price}`}
                imageUrl={finalImageUrl}
                formats={model.material ? [model.material] : ["STL"]}
                isPremium={model.price > 0}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

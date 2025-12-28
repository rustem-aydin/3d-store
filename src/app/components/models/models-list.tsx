"use client";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { ModelCard } from "./models-card";
import { useProducts } from "@/lib/supabase/hooks/usePoducts";

export default function ModelList({ limit }: { limit: number }) {
  const { data: products, isLoading, error } = useProducts(limit);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const bottomAnimation = (index: number) => ({
    initial: { y: 30, opacity: 0 },
    animate: inView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 },
    transition: { duration: 0.5, delay: index * 0.1 },
  });
  console.log(products);
  if (isLoading)
    return (
      <div className="text-center py-20 text-white/20">
        Modeller yükleniyor...
      </div>
    );
  if (error)
    return (
      <div className="text-center py-20 text-red-500">
        Hata: {error.message}
      </div>
    );

  return (
    <section className="  ">
      <div ref={ref} className=" px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 mb-20">
          {products?.map((model: any, index: number) => {
            const dbImage = model.product_images?.[0]?.image_url;
            const fallbackImage = "/images/logo/DarkModeLogo.svg";
            const finalImageUrl = dbImage || fallbackImage;
            const categoryName =
              model.collection_products?.[0]?.collections?.name || "3D Model";

            return (
              <motion.div key={model.id} {...bottomAnimation(index)}>
                <ModelCard
                  slug_text={model?.slug_text}
                  title={model.title}
                  category={categoryName}
                  price={model.price === 0 ? "Ücretsiz" : `${model.price}`}
                  imageUrl={finalImageUrl} // <--- Boş kalması engellendi
                  formats={model.material ? [model.material] : ["STL"]}
                  isPremium={model.price > 0}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

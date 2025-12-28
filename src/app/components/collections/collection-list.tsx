"use client";
import { useCollectionProducts } from "@/lib/supabase/hooks/useCollections";
import { motion, useInView } from "motion/react";
import { ModelCard } from "../models/models-card";
import { useRef } from "react";

function CollectionList({ slug }: { slug: string }) {
  const { data: collection } = useCollectionProducts(slug);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const bottomAnimation = (index: number) => ({
    initial: { y: 30, opacity: 0 },
    animate: inView ? { y: 0, opacity: 1 } : { y: 30, opacity: 0 },
    transition: { duration: 0.5, delay: index * 0.1 },
  });
  return (
    <section id="services">
      <div className="2xl:pt-44  py-24">
        <div className="container ">
          <h5
            style={{
              backgroundColor: `${collection?.collectionInfo?.color}1A`,
              color: collection?.collectionInfo?.color,
            }}
            className={`inline-flex mb-8 text-2xl md:text-6xl  md:px-8 py-0 px-2 gap-2 rounded-full items-center`}
          >
            <span className="instrument-font italic font-normal">
              {collection?.collectionInfo?.name}
            </span>
          </h5>
          <h1
            className={`inline-flex text-6xl  px-2 md:px-4 gap-2 rounded-full items-center`}
          >
            <span className="instrument-font text-xl md:text-6xl font-normal">
              3D Modelleri
            </span>
          </h1>
        </div>
        <div ref={ref} className=" px-4 max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 mb-20">
            {collection?.products?.map((model: any, index: number) => {
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
      </div>
    </section>
  );
}

export default CollectionList;

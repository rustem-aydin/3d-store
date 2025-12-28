"use client";
import Slider from "react-infinite-logo-slider";
import { useCollections } from "@/lib/supabase/hooks/useCollections";
import Link from "next/link";

function Brand({ limit }: { limit: number }) {
  const { data: categories, isLoading, error } = useCollections(limit);
  return (
    <section>
      <div className=" ">
        <div className="container">
          <div className="gap-4">
            <div className="flex justify-center text-center py-4 relative">
              <p
                className="relative px-2 text-dark_black/60 dark:text-white/60
                    md:before:absolute md:before:right-[-150px] md:before:top-1/2 md:before:h-0.5 md:before:w-36 md:before:bg-linear-to-r md:before:from-gray-800 dark:md:before:from-gray-300 dark:md:before:opacity-100 md:before:opacity-10 md:before:to-transparent md:after:absolute md:after:left-[-150px] md:after:top-1/2 md:after:h-0.5 md:after:w-36 md:after:bg-linear-to-l md:after:from-gray-800 dark:md:after:from-gray-300 md:after:opacity-10 dark:md:after:opacity-100 md:after:to-transparent"
              >
                Popüler Kategoriler
              </p>
            </div>

            {categories && categories.length > 0 && (
              <div className="py-3 Xsm:py-7">
                <Slider
                  width="200px"
                  duration={20}
                  pauseOnHover={true}
                  blurBorders={false}
                >
                  {categories?.map((items: any, index: any) => (
                    <Link
                      href={`/collections/${items?.collection_slug}`}
                      key={index}
                      style={{
                        backgroundColor: `${items.color}1A`,
                        color: items.color,
                      }}
                      className={`inline-flex m-1 py-2 px-4 gap-2 rounded-full items-center`}
                    >
                      <span className="instrument-font italic font-normal text-xl md:text-xl">
                        {items.name}
                      </span>
                    </Link>
                  ))}
                </Slider>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Brand;

"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useRef } from "react"; // useState kullanılmıyorsa silebilirsiniz
import { motion, useInView } from "motion/react";
import { useCollections } from "@/lib/supabase/hooks/useCollections";
import { TextGenerateEffect } from "../../ui/text-generate-effect";

function Innovation({ limit }: { limit?: number }) {
  const { data: categories, isLoading, error } = useCollections(limit);
  const ref = useRef(null);
  // once: true eklendi, böylece her scroll'da tekrar animasyon yapıp performans yemesin
  const inView = useInView(ref, { once: true });

  return (
    // EKLENDİ: overflow-hidden taşmaları gizleyerek kaymayı engeller
    <section id="services" className="overflow-hidden">
      <div ref={ref} className="2xl:py-20 py-11">
        <div className="flex flex-col gap-10 md:gap-20">
          <div className="relative flex flex-col mb-8 16 text-center items-center">
            <h2>
              <TextGenerateEffect words="Popüler" duration={0.5} />
              <TextGenerateEffect
                words="Kategorileri Keşfet"
                delay={1.5}
                className="italic font-normal instrument-font"
              />
            </h2>
          </div>
        </div>
        <div className="container">
          <div className="flex flex-col gap-12">
            <div className="flex flex-col justify-center items-center gap-10 lg:gap-16">
              {/* DÜZELTME: Buradaki gereksiz 'ref={ref}' kaldırıldı */}
              <div className="w-full">
                <div className="grid auto-rows-max grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6 w-full">
                  {categories?.map((items: any, index: any) => {
                    return (
                      <motion.div
                        key={index}
                        style={{
                          backgroundColor: `${items.color}1A`,
                        }}
                        className={`${items.color} flex flex-col p-8 rounded-2xl gap-6 lg:gap-9`}
                        initial={{
                          // DÜZELTME: 1.2 yerine 0.9 yapıldı.
                          // Mobilde eleman ekran dışına taşmaz, içten dışa büyür.
                          scale: 0.9,
                          opacity: 0,
                          filter: "blur(8px)",
                        }}
                        animate={
                          inView
                            ? { scale: 1, opacity: 1, filter: "blur(0px)" }
                            : {}
                        }
                        transition={{
                          duration: 0.6,
                          delay: 0.1 + index * 0.1, // Delay biraz optimize edildi
                          ease: "easeInOut",
                        }}
                      >
                        <Link
                          style={{
                            color: items.color,
                          }}
                          href={`/collections/${items?.collection_slug}`}
                        >
                          <div>
                            <h3
                              style={{
                                color: items.color,
                              }}
                              className={`text-2xl  ${items.color}`}
                            >
                              {items?.name}
                            </h3>
                          </div>
                          <div>
                            <p
                              style={{
                                color: items.color,
                              }}
                              className={`text-md  ${items.color}`}
                            >
                              {items?.collection_products[0].count} Model
                            </p>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Alt Banner Kısmı */}
            <div className="flex flex-col gap-4 xl:flex xl:flex-row bg-dark_black items-center justify-between dark:bg-white/5 py-8 px-7 sm:px-12 rounded-3xl w-full">
              <h4 className="text-white text-center xl:text-left">
                Modellerimizi Keşfedin.
                <br /> Tasarımlarınıza Güç Katın!
              </h4>
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <Link
                  href="/contact"
                  className="group gap-2 text-dark_black font-medium bg-white rounded-full flex items-center lg:gap-4 py-2 pl-5 pr-2 border border-white dark:border-opacity-50 hover:bg-transparent hover:text-white transition-all duration-200 ease-in-out"
                >
                  <span className="group-hover:translate-x-9 transform transition-transform duration-200 ease-in-out">
                    Bize Ulaşın
                  </span>
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="group-hover:-translate-x-36 transition-all duration-200 ease-in-out"
                  >
                    <rect
                      width="32"
                      height="32"
                      rx="16"
                      fill="#1B1D1E"
                      className=" transition-colors duration-200 ease-in-out group-hover:fill-white"
                    />
                    <path
                      d="M11.832 11.3335H20.1654M20.1654 11.3335V19.6668M20.1654 11.3335L11.832 19.6668"
                      stroke="white"
                      strokeWidth="1.42857"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="group-hover:stroke-black"
                    />
                  </svg>
                </Link>
                <Link
                  href="/#models"
                  className="group border border-white dark:border-white/50 text-white font-medium bg-dark_black gap-2 rounded-full flex items-center justify-between lg:gap-4 py-2 pl-5 pr-2 hover:opacity-95 hover:bg-transparent hover:text-white transition-all duration-200 ease-in-out"
                >
                  <span className="group-hover:translate-x-9 transform transition-transform duration-200 ease-in-out">
                    Kataloğu Gör
                  </span>
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="group-hover:-translate-x-[125px] transition-all duration-200 ease-in-out "
                  >
                    <rect width="32" height="32" rx="16" fill="white" />
                    <path
                      d="M11.832 11.3334H20.1654M20.1654 11.3334V19.6668M20.1654 11.3334L11.832 19.6668"
                      stroke="#1B1D1E"
                      strokeWidth="1.42857"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Innovation;

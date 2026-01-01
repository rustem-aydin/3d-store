"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { TextGenerateEffect } from "@/app/components/ui/text-generate-effect";
import { Car, Castle, Cpu } from "lucide-react";
import { SplineScene } from "../../ui/splite";
import { cn } from "@/lib/utils";

function HeroSection() {
  const bottomAnimation = {
    initial: { y: "20%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 1, delay: 0.8 },
  };

  const categoryStyles = {
    red: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
    yellow: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
    purple: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20",
  };

  const categories = [
    {
      href: "/collections/araba-parcalari",
      icon: <Car size={20} />,
      label: "Araba Parçaları",
      color: "red",
    },
    {
      href: "/collections/tarihi-yerler",
      icon: <Castle size={20} />,
      label: "Tarihi Yerler",
      color: "yellow",
    },
    {
      href: "/collections/teknoloji",
      icon: <Cpu size={20} />,
      label: "Teknoloji",
      color: "purple",
    },
  ];

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* ARKA PLAN */}
      <div className="absolute inset-0 -z-10 before:absolute before:inset-0 before:bg-linear-to-r before:from-blue_gradient/10 before:via-white/5 before:to-yellow_gradient/10 before:blur-3xl dark:before:from-dark_blue_gradient/20 dark:before:via-black dark:before:to-dark_yellow_gradient/20" />

      {/* SPLINE */}
      <div className="absolute top-0 right-0 w-full lg:w-[65%] h-full z-10 pointer-events-auto transform lg:translate-x-[5%] xl:translate-x-[8%] transition-transform duration-700">
        <SplineScene
          scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
          className="w-full h-full"
        />
      </div>

      {/* İÇERİK */}
      <div className="container relative z-20 pt-44 pb-10 pointer-events-none select-none">
        <div className="flex flex-col lg:flex-row items-center">
          <div className="relative flex flex-col gap-4 lg:w-1/2 p-4 lg:p-0 rounded-3xl max-lg:bg-white/5 max-lg:dark:bg-black/10 max-lg:backdrop-blur-sm">
            <div className="pointer-events-auto select-text">
              <h1 className="leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_2px_10px_rgba(255,255,255,0.1)]">
                <TextGenerateEffect words="Projeleriniz için yüksek kaliteli" />
                <TextGenerateEffect
                  words="3D modeller"
                  delay={0.8}
                  className="italic instrument-font text-purple_blue"
                />
              </h1>

              <p className="max-w-xl mt-4 text-lg md:text-xl text-dark_black dark:text-white/90 leading-relaxed">
                3D Market ile oyun, mimari ve endüstriyel tasarımlarınız için
                optimize edilmiş, kullanıma hazır dijital varlıklara anında
                ulaşın.
              </p>

              {/* KATEGORİLER */}
              <div className="mt-8 flex flex-wrap gap-2">
                {categories.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={cn(
                      "inline-flex items-center gap-2 py-2 px-4 rounded-full transition-all duration-300 backdrop-blur-sm",
                      categoryStyles[item.color as keyof typeof categoryStyles]
                    )}
                  >
                    {item.icon}
                    <span className="instrument-font italic text-xl md:text-2xl">
                      {item.label}
                    </span>
                  </Link>
                ))}
              </div>

              {/* BUTON */}
              <motion.div
                {...bottomAnimation}
                className="mt-10 pointer-events-auto"
              >
                <Link
                  href="/models"
                  className="group bg-purple_blue text-white flex items-center justify-between py-3 px-5 rounded-full max-w-64 border border-purple_blue transition-all hover:bg-transparent hover:text-purple_blue shadow-xl"
                >
                  <span className="transition-transform ">
                    Modelleri Keşfet
                  </span>

                  <div className="bg-white rounded-full p-2  transition-colors group-hover:bg-purple_blue">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 40 40"
                      fill="none"
                      className="transition-transform group-hover:rotate-45"
                    >
                      <path
                        d="M15.832 15.3334H24.1654V23.6667"
                        className="stroke-[#1B1D1E] group-hover:stroke-white"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M15.832 23.6667L24.1654 15.3334"
                        className="stroke-[#1B1D1E] group-hover:stroke-white"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;

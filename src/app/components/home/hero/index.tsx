"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { TextGenerateEffect } from "@/app/components/ui/text-generate-effect";
import { Car, Castle, Cpu } from "lucide-react";

function HeroSection() {
  const bottomAnimation = {
    initial: { y: "20%", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 1, delay: 0.8 },
  };

  return (
    <section>
      <div className="relative w-full pt-44 2xl:pb-20 pb-10 before:absolute before:w-full before:h-full before:bg-linear-to-r before:from-blue_gradient before:via-white before:to-yellow_gradient before:rounded-full before:top-24 before:blur-3xl before:-z-10 dark:before:from-dark_blue_gradient dark:before:via-black dark:before:to-dark_yellow_gradient dark:before:rounded-full dark:before:blur-3xl dark:before:-z-10">
        <div className="container relative z-10">
          <div className="flex flex-col gap-8">
            {/* ---------------- heading text --------------- */}
            <div
              // {...bottomAnimation}
              className="relative flex flex-col text-center items-center gap-4"
            >
              <h1>
                <TextGenerateEffect words="Projeleriniz için yüksek kaliteli" />
                <TextGenerateEffect
                  words="3D modeller"
                  delay={0.8}
                  className="italic font-normal instrument-font"
                />
              </h1>
              <p className="max-w-38 text-dark_black/60 dark:text-white/60">
                3D Market ile oyun, mimari ve endüstriyel tasarımlarınız için
                özenle hazırlanmış, optimize edilmiş ve kullanıma hazır dijital
                varlıklara anında ulaşın.
              </p>
              <div className="mt-6">
                <Link
                  href={"/collections/araba-parcalari"}
                  className={`inline-flex m-2 py-2 px-6 gap-4 rounded-full bg-red-500/10 text-red-500 items-center`}
                >
                  <Car></Car>

                  <span className="instrument-font italic font-normal text-xl md:text-2xl">
                    {"Araba Parçaları"}
                  </span>
                </Link>
                <Link
                  href={"/collections/tarihi-yerler"}
                  className={`inline-flex m-2 py-2 px-6 gap-4 rounded-full bg-yellow-500/10 text-yellow-500 items-center`}
                >
                  <Castle></Castle>

                  <span className="instrument-font italic font-normal text-xl md:text-2xl">
                    {"Tarihi Yerler"}
                  </span>
                </Link>
                <Link
                  href={"/collections/teknoloji"}
                  className={`inline-flex m-2 py-2 px-6 gap-4 rounded-full bg-purple-500/10 text-purple-500 items-center`}
                >
                  <Cpu></Cpu>

                  <span className="instrument-font italic font-normal text-xl md:text-2xl">
                    {"Teknoloji"}
                  </span>
                </Link>
              </div>
            </div>

            <motion.div
              {...bottomAnimation}
              className="flex flex-col items-center justify-center gap-4"
            >
              <div className="flex flex-col items-center justify-center gap-8 w-full sm:flex-row">
                {/* ----------- Get started Link -------------- */}
                <Link
                  href="/models"
                  className="group bg-purple_blue text-white font-medium flex flex-row justify-between items-center py-2 px-5 rounded-full max-w-64 w-full md:py-3 border border-purple_blue transition-all duration-200 ease-in-out hover:bg-transparent hover:text-purple_blue"
                >
                  <span className="flex text-start transform transition-transform duration-200 ease-in-out group-hover:translate-x-28">
                    Modelleri Keşfet
                  </span>
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="transform transition-transform duration-200 ease-in-out group-hover:-translate-x-44 group-hover:rotate-45"
                  >
                    <rect
                      width="40"
                      height="40"
                      rx="20"
                      className="fill-white transition-colors duration-200 ease-in-out group-hover:fill-purple_blue"
                    />
                    <path
                      d="M15.832 15.3334H24.1654V23.6667"
                      className="stroke-[#1B1D1E] transition-colors duration-200 ease-in-out group-hover:stroke-white"
                      strokeWidth="1.66667"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M15.832 23.6667L24.1654 15.3334"
                      className="stroke-[#1B1D1E] transition-colors duration-500 ease-in-out group-hover:stroke-white"
                      strokeWidth="1.66667"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;

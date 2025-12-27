"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { InteractiveProductCardProps } from "@/types/model-types";

export function ModelCard({
  className,
  slug_text,
  imageUrl,
  title,
  category,
  price,
  formats,
  isPremium,
  ...props
}: InteractiveProductCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [style, setStyle] = React.useState<React.CSSProperties>({});

  const handleMouseLeave = () => {
    setStyle({
      transform:
        "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
      transition: "transform 0.5s ease-in-out",
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseLeave={handleMouseLeave}
      style={style}
      className={cn(
        "group relative w-full aspect-[4/5] rounded-lg overflow-hidden bg-neutral-900 shadow-2xl cursor-pointer",
        className
      )}
      {...props}
    >
      <Link href={`models/${slug_text}`}>
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 z-0">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
          </div>
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw" // Performans için gerekli
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
        </div>

        <div
          className="absolute top-4 left-4 right-4 flex justify-between items-start z-10"
          style={{ transform: "translateZ(30px)" }}
        >
          <span className="px-1  md:px-3 py-0.5 md:py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[8px] md:text-[10px] font-bold tracking-widest uppercase text-white">
            {category}
          </span>
          {isPremium && (
            <div className="bg-yellow-500 text-black p-1.5 rounded-lg shadow-lg">
              <svg
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
          )}
        </div>

        <div
          className="absolute bottom-0 left-0 right-0 p-2 z-10 space-y-3"
          style={{ transform: "translateZ(50px)" }}
        >
          <div>
            <h3 className="text-[10px] md:text-xl font-bold text-white leading-tight">
              {title}
            </h3>
            <div className="flex gap-1.5 mt-1 md:mt-2">
              {formats.map((f) => (
                <span
                  key={f}
                  className="text-[7px] md:text-[9px] px-0.5 md:px-1.5 py-0.5 mb-0.5 md:mb-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <div className="flex flex-col">
              <span className="text-[8px] md:text-[10px]  text-white/50 uppercase">
                Fiyat
              </span>
              <span className="text-sm md:text-lg font-bold text-white">
                {price}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

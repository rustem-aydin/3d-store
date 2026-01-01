"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { BlurImage } from "../images/blur-image";

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
}: any) {
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
        "group relative w-full aspect-5/4 rounded-lg overflow-hidden bg-neutral-900 shadow-2xl cursor-pointer",
        className
      )}
      {...props}
    >
      <Link href={`/models/${slug_text}`}>
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
          </div>
          <BlurImage
            imageClassName="object-cover object-center"
            src={imageUrl}
            alt={title}
            fill
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
        </div>

        <div
          className="absolute top-1 left-1 md:top-2 md:left-2 xl:top-4 xl:left-4 md:right-4 flex justify-between items-start z-10"
          style={{ transform: "translateZ(30px)" }}
        >
          <span className="px-1  md:px-3 py-0.5 md:py-1 bg-purple-500/30 backdrop-blur-md border border-white/20 rounded-full text-[7px] md:text-[10px] font-bold tracking-widest uppercase text-white">
            {category}
          </span>
        </div>

        <div
          className="absolute backdrop-blur-xs bottom-0  left-0 right-0 p-[6px] md:p-2 z-10 "
          style={{ transform: "translateZ(50px)" }}
        >
          <div>
            <h3 className="text-[10px] md:text-xl font-bold text-white leading-tight">
              {title}
            </h3>
          </div>

          <div className="flex items-center justify-between pt-1 md:pt-2 border-t border-white/10">
            <div className="flex flex-col">
              <span className="text-[7px] md:text-[10px]  text-white/50 uppercase">
                Fiyat
              </span>
              <span className="text-[10px] md:text-lg font-bold text-white">
                {price}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

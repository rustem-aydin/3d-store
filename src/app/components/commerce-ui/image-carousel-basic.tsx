"use client";

import { Button } from "@/app/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { type EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import {
  ArrowLeft,
  ArrowRight,
  MinusCircle,
  PlusCircle,
  X,
  Play,
  Box,
} from "lucide-react";
import React, { useCallback, useEffect, useState, useMemo } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { BlurImage } from "../images/blur-image";
import Image from "next/image";
import STLViewer from "../viewer-3d"; // STLViewer bileşeninin yolu

// --------------------------------------------------------
// TYPES
// --------------------------------------------------------

export type CarouselImage = {
  title?: string;
  url: string;
  display_order?: number;
  type?: "image" | "video" | "model";
  thumbnailUrl?: string;
};

interface ImageCarousel_BasicProps
  extends React.HTMLAttributes<HTMLDivElement> {
  images: CarouselImage[]; // Normal görseller
  product_files?: CarouselImage[]; // STL Dosyaları (Saf liste olarak gelir)
  opts?: EmblaOptionsType;
  showCarouselControls?: boolean;
  showImageControls?: boolean;
  imageFit?: "cover" | "contain" | "fill";
  aspectRatio?: "square" | "video" | "wide" | "auto";
  thumbPosition?: "bottom" | "top" | "left" | "right";
  showThumbs?: boolean;
  selectedIndex?: number;
  onSlideChange?: (index: number) => void;
  classNameImage?: string;
  classNameThumbnail?: string;
}

// --------------------------------------------------------
// UTILS
// --------------------------------------------------------

const getMediaType = (
  url: string,
  explicitType?: "image" | "video" | "model"
): "image" | "video" | "model" => {
  if (explicitType) return explicitType;
  if (!url) return "image";
  const cleanUrl = url.split("?")[0].toLowerCase();

  const videoExtensions = [
    ".mp4",
    ".webm",
    ".ogg",
    ".mov",
    ".avi",
    ".mkv",
    ".m4v",
  ];
  if (videoExtensions.some((ext) => cleanUrl.endsWith(ext))) return "video";

  const modelExtensions = [".stl", ".obj", ".glb", ".gltf"];
  if (modelExtensions.some((ext) => cleanUrl.endsWith(ext))) return "model";

  return "image";
};

const getAspectRatioClass = (ratio?: string) => {
  switch (ratio) {
    case "square":
      return "aspect-square";
    case "video":
      return "aspect-video";
    case "wide":
      return "aspect-4/3";
    case "auto":
      return "aspect-auto";
    default:
      return "aspect-4/3";
  }
};

// --------------------------------------------------------
// MAIN COMPONENT
// --------------------------------------------------------

const ImageCarousel_Basic: React.FC<ImageCarousel_BasicProps> = ({
  aspectRatio = "wide",
  className,
  classNameImage,
  classNameThumbnail,
  imageFit = "contain",
  images = [],
  product_files = [],
  onSlideChange,
  opts,
  selectedIndex: controlledIndex,
  showCarouselControls = true,
  showImageControls = true,
  showThumbs = true,
  thumbPosition = "bottom",
  ...props
}) => {
  const isControlled = controlledIndex !== undefined;

  // 1. HARMANLAMA VE SIRALAMA
  // images ve product_files listelerini birleştirip display_order'a göre diziyoruz
  const sortedMedia = useMemo(() => {
    const combined = [
      ...images,
      ...(product_files || []).map((f) => ({ ...f, type: "model" as const })),
    ];
    return combined.sort(
      (a, b) => (a.display_order ?? 99) - (b.display_order ?? 99)
    );
  }, [images, product_files]);

  const [emblaRef, emblaApi] = useEmblaCarousel({ ...opts, axis: "x" });
  const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel(
    showThumbs
      ? {
          axis:
            thumbPosition === "left" || thumbPosition === "right" ? "y" : "x",
          containScroll: "keepSnaps",
          dragFree: true,
        }
      : undefined
  );

  const [internalSelectedIndex, setInternalSelectedIndex] = useState(0);
  const currentIndex = isControlled ? controlledIndex : internalSelectedIndex;

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const selectedSlideIndex = emblaApi.selectedScrollSnap();
    if (!isControlled) setInternalSelectedIndex(selectedSlideIndex);
    if (onSlideChange) onSlideChange(selectedSlideIndex);
    if (showThumbs && emblaThumbsApi)
      emblaThumbsApi.scrollTo(selectedSlideIndex);
  }, [emblaApi, emblaThumbsApi, showThumbs, isControlled, onSlideChange]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  if (sortedMedia.length === 0) return null;

  return (
    <div
      className={cn(
        "relative w-full max-w-3xl",
        {
          "flex-row-reverse": showThumbs && thumbPosition === "left",
          "flex gap-4":
            showThumbs &&
            (thumbPosition === "left" || thumbPosition === "right"),
        },
        className
      )}
      role="region"
      {...props}
    >
      {/* ANA SLIDER ALANI */}
      <div className={cn("relative flex-1")}>
        <div ref={emblaRef} className="overflow-hidden rounded-lg">
          <div className="flex -ml-4">
            {sortedMedia.map((item, index) => (
              <div
                key={index}
                className="min-w-0 shrink-0 grow-0 basis-full pl-4"
              >
                <MediaItem
                  item={item}
                  productFiles={product_files} // SAF STL LİSTESİ BURAYA AKTARILIYOR
                  aspectRatio={aspectRatio}
                  fit={imageFit}
                  showImageControls={showImageControls}
                  classNameImage={classNameImage}
                  classNameThumbnail={classNameThumbnail}
                />
              </div>
            ))}
          </div>
        </div>

        {/* CAROUSEL KONTROLLERİ */}
        {showCarouselControls && sortedMedia.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-1/2 left-4 z-10 -translate-y-1/2 rounded-full bg-white/80 backdrop-blur-sm"
              onClick={() => emblaApi?.scrollPrev()}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-1/2 right-4 z-10 -translate-y-1/2 rounded-full bg-white/80 backdrop-blur-sm"
              onClick={() => emblaApi?.scrollNext()}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {/* THUMBNAILS (KÜÇÜK RESİMLER) */}
      {showThumbs && sortedMedia.length > 1 && (
        <div
          className={cn(
            thumbPosition === "bottom" ? "mt-4" : "w-20",
            "overflow-hidden"
          )}
          ref={emblaThumbsRef}
        >
          <div
            className={cn(
              "flex gap-2",
              thumbPosition === "left" || thumbPosition === "right"
                ? "flex-col"
                : "flex-row"
            )}
          >
            {sortedMedia.map((item, index) => (
              <button
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                className={cn(
                  "relative aspect-square w-16 shrink-0 overflow-hidden rounded-md border-2 transition-all",
                  currentIndex === index
                    ? "border-purple-600 opacity-100"
                    : "border-transparent opacity-50"
                )}
              >
                {getMediaType(item.url, item.type) === "model" ? (
                  <div className="flex h-full w-full items-center justify-center bg-neutral-100">
                    <Box className="h-6 w-6 text-purple-600" />
                  </div>
                ) : (
                  <img
                    src={item.url}
                    className="h-full w-full object-cover"
                    alt=""
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --------------------------------------------------------
// MEDIA ITEM (Dialog ve Lightbox Yönetimi)
// --------------------------------------------------------

const MediaItem = ({
  item,
  productFiles,
  aspectRatio,
  fit,
  showImageControls,
  classNameImage,
  classNameThumbnail,
}: any) => {
  const mediaType = getMediaType(item.url, item.type);
  const isVideo = mediaType === "video";
  const isModel = mediaType === "model";

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-lg bg-gray-100 shadow-sm",
        getAspectRatioClass(aspectRatio)
      )}
    >
      <Dialog>
        <DialogTrigger asChild>
          <div className="group relative h-full w-full cursor-pointer overflow-hidden">
            {isModel ? (
              <div className="flex h-full w-full flex-col items-center justify-center bg-neutral-50 group-hover:bg-neutral-100 transition-colors">
                <div className="rounded-full bg-purple-100 p-4 transition-transform group-hover:scale-110">
                  <Box className="h-10 w-10 text-purple-700" />
                </div>
                <span className="mt-3 text-[10px] font-bold tracking-widest text-purple-900 uppercase">
                  3D Görüntüle
                </span>
              </div>
            ) : isVideo ? (
              <div className="relative h-full w-full">
                <video
                  src={item.url}
                  className="h-full w-full object-cover"
                  muted
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                  <Play className="h-12 w-12 text-white fill-white/20" />
                </div>
              </div>
            ) : (
              <BlurImage
                fill
                alt={"item?.name"}
                src={item.url}
                imageClassName={cn(
                  "h-full w-full",
                  fit === "contain" ? "object-contain" : "object-cover",
                  classNameThumbnail
                )}
              />
            )}
          </div>
        </DialogTrigger>

        <DialogPortal>
          <DialogOverlay className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md" />
          <DialogContent className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-transparent p-0 outline-none border-none">
            <DialogTitle className="sr-only">
              {item.title || "Medya"}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Tam Ekran Görünümü
            </DialogDescription>

            <div className="relative flex h-screen w-screen items-center justify-center">
              {isModel ? (
                // --- STL VIEWER ---
                // Burada product_files listesini (all STL files) ve başlangıç URL'ini gönderiyoruz
                <div className="relative w-[95vw] h-[85vh] md:w-[90vw] md:h-[90vh] bg-neutral-900 rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
                  <STLViewer urls={productFiles} />
                </div>
              ) : isVideo ? (
                <video
                  src={item.url}
                  controls
                  autoPlay
                  className="max-h-[90vh] max-w-[90vw]"
                />
              ) : (
                <TransformWrapper initialScale={1}>
                  {({ zoomIn, zoomOut }) => (
                    <>
                      <TransformComponent wrapperClass="w-full h-full flex items-center justify-center">
                        <img
                          src={item.url}
                          className={cn(
                            "max-h-[90vh] max-w-[90vw] object-contain shadow-2xl",
                            classNameImage
                          )}
                          alt=""
                        />
                      </TransformComponent>
                      {showImageControls && (
                        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-4 bg-black/50 backdrop-blur-md p-2 rounded-full z-50">
                          <button
                            onClick={() => zoomOut()}
                            className="p-2 text-white hover:text-purple-400 transition-colors"
                          >
                            <MinusCircle className="h-6 w-6" />
                          </button>
                          <button
                            onClick={() => zoomIn()}
                            className="p-2 text-white hover:text-purple-400 transition-colors"
                          >
                            <PlusCircle className="h-6 w-6" />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </TransformWrapper>
              )}

              <DialogClose asChild>
                <button className="absolute top-6 right-6 z-50 text-white/50 hover:text-white transition-colors bg-white/10 p-2 rounded-full backdrop-blur-sm">
                  <X className="h-8 w-8" />
                </button>
              </DialogClose>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  );
};

export default ImageCarousel_Basic;

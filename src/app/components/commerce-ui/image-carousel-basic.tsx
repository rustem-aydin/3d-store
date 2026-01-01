"use client";

import { Button } from "@/app/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { type EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, X, Play } from "lucide-react";
import React, { useCallback, useEffect, useState, useMemo } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { BlurImage } from "../images/blur-image";

// --- TİPLER ---

export type CarouselImage = {
  title?: string;
  url: string;
  display_order?: number;
  type?: "image" | "video";
  thumbnailUrl?: string;
};

interface ImageCarousel_BasicProps
  extends React.HTMLAttributes<HTMLDivElement> {
  images: CarouselImage[];
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

// --- YARDIMCI FONKSİYONLAR ---

const getAspectRatioClass = (ratio?: string) => {
  switch (ratio) {
    case "square":
      return "aspect-square";
    case "video":
      return "aspect-video";
    case "wide":
      return "aspect-[4/3]";
    case "auto":
      return "aspect-auto";
    default:
      return "aspect-[4/3]";
  }
};

const isVideoFile = (url: string, type?: string) => {
  if (type === "video") return true;
  return /\.(mp4|webm|mov|m4v)$/i.test(url);
};

// --- ANA BİLEŞEN ---

const ImageCarousel_Basic: React.FC<ImageCarousel_BasicProps> = ({
  aspectRatio = "wide",
  className,
  classNameImage,
  classNameThumbnail,
  imageFit = "contain",
  images = [],
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

  // Medya sıralama mantığı
  const sortedMedia = useMemo(() => {
    if (!images) return [];
    const videos = images.filter((item) => isVideoFile(item.url, item.type));
    const photos = images.filter((item) => !isVideoFile(item.url, item.type));

    photos.sort((a, b) => (a.display_order ?? 99) - (b.display_order ?? 99));

    if (photos.length === 0) return videos;
    if (videos.length === 0) return photos;

    return [photos[0], ...videos, ...photos.slice(1)];
  }, [images]);

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
        "relative w-full", // max-w-3xl burada kısıtlayıcı olabilir, kaldırdım veya parent kontrol etmeli.
        {
          "flex flex-row-reverse gap-4": showThumbs && thumbPosition === "left",
          "flex flex-row gap-4": showThumbs && thumbPosition === "right",
          "flex flex-col gap-4":
            showThumbs &&
            (thumbPosition === "bottom" || thumbPosition === "top"),
          "flex-col-reverse": showThumbs && thumbPosition === "top",
        },
        className
      )}
      {...props}
    >
      {/* ANA SLIDER */}
      <div className="relative flex-1 min-w-0">
        <div
          ref={emblaRef}
          className="overflow-hidden rounded-xl border border-gray-100 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-900/50"
        >
          <div className="flex -ml-4 touch-pan-y">
            {sortedMedia.map((item, index) => (
              <div
                key={index}
                className="min-w-0 shrink-0 grow-0 basis-full pl-4"
              >
                <MediaItem
                  item={item}
                  aspectRatio={aspectRatio}
                  fit={imageFit}
                  showImageControls={showImageControls}
                  classNameImage={classNameImage}
                />
              </div>
            ))}
          </div>
        </div>

        {/* OKLAR */}
        {showCarouselControls && sortedMedia.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-1/2 left-4 z-10 -translate-y-1/2 rounded-full h-8 w-8 bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm"
              onClick={() => emblaApi?.scrollPrev()}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-1/2 right-4 z-10 -translate-y-1/2 rounded-full h-8 w-8 bg-white/80 backdrop-blur-sm hover:bg-white shadow-sm"
              onClick={() => emblaApi?.scrollNext()}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {/* THUMBNAILS */}
      {showThumbs && sortedMedia.length > 1 && (
        <div
          className={cn(
            "overflow-hidden px-1",
            // Yatay (bottom/top) ise w-full, dikey ise w-20
            thumbPosition === "bottom" || thumbPosition === "top"
              ? "w-full"
              : "w-20 h-96"
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
                  "relative aspect-auto w-30 h-24 shrink-0 overflow-hidden rounded-lg border-2 transition-all bg-gray-100 dark:bg-gray-800",
                  currentIndex === index
                    ? "border-purple-600 ring-2 ring-purple-600/20 opacity-100"
                    : "border-transparent opacity-60 hover:opacity-100"
                )}
              >
                {isVideoFile(item.url, item.type) ? (
                  <div className="flex h-full w-full items-center justify-center bg-gray-200">
                    <Play className="h-8 w-8 text-gray-500" />
                  </div>
                ) : (
                  <BlurImage
                    fill
                    src={item.url}
                    // DÜZELTME BURADA:
                    // 1. className yerine 'imageClassName' kullan (Bileşen yapına göre)
                    // 2. 'object-cover' kullan: Bu, resmi bozmadan (oranını koruyarak) kutuyu doldurur.
                    //    (Dikey resimlerde alt ve üstten, yataylarda yanlardan kırparak tam doldurur).
                    imageClassName="h-full w-full object-cover"
                    alt={item.title || "thumbnail"}
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

// --- ALT BİLEŞEN: MEDIA ITEM ---

const MediaItem = ({ item, aspectRatio, fit, classNameImage }: any) => {
  const isVideo = isVideoFile(item.url, item.type);

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden",
        getAspectRatioClass(aspectRatio)
      )}
    >
      <Dialog>
        <DialogTrigger asChild>
          <div className="group relative h-full w-full cursor-pointer flex items-center justify-center overflow-hidden bg-black/5">
            {isVideo ? (
              <div className="relative h-full w-full bg-black">
                <video
                  src={item?.url}
                  className="h-full w-full object-contain"
                  muted
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                  <Play className="h-24 w-24 text-white fill-white/20" />
                </div>
              </div>
            ) : (
              <>
                <div className="absolute inset-0 z-0">
                  <BlurImage
                    fill
                    src={item?.url}
                    alt=""
                    imageClassName="object-cover w-full h-full blur-xl scale-110 opacity-60 brightness-[0.7]"
                  />
                </div>

                <BlurImage
                  fill
                  src={item?.url}
                  alt={item.title || "Product image"}
                  imageClassName={cn(
                    "transition-transform duration-500 group-hover:scale-105 z-10 relative",
                    // fit prop'u genelde 'contain' olmalı ki arkadaki blur gözüksün.
                    fit === "contain" ? "object-contain" : "object-cover",
                    classNameImage
                  )}
                />
              </>
            )}
          </div>
        </DialogTrigger>

        {/* POPUP (MODAL) KISMI AYNEN KALDI */}
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm animate-in fade-in" />
          <DialogContent className="fixed inset-0 z-[60] flex items-center justify-center p-0 border-none outline-none bg-transparent max-w-none w-screen h-screen">
            <DialogTitle className="sr-only">Görüntüleyici</DialogTitle>

            <div className="relative w-full h-full flex items-center justify-center p-4">
              {isVideo ? (
                <video
                  src={item.url}
                  controls
                  autoPlay
                  className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-2xl"
                />
              ) : (
                <TransformWrapper>
                  <TransformComponent wrapperClass="w-full h-full flex items-center justify-center">
                    <img
                      src={item.url}
                      className="max-h-[90vh] max-w-[95vw] object-contain rounded-lg shadow-2xl"
                      alt=""
                    />
                  </TransformComponent>
                </TransformWrapper>
              )}

              <DialogClose asChild>
                <button className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 p-2 rounded-full backdrop-blur-sm transition-colors z-[70] cursor-pointer">
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

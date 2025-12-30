"use client";

import ImageCarouselBasic, {
  CarouselImage,
} from "@/app/components/commerce-ui/image-carousel-basic";
import PriceFormat from "@/app/components/commerce-ui/price-format-basic";
import PriceFormat_Basic from "@/app/components/commerce-ui/price-format-basic";
import QuantityInputBasic from "@/app/components/commerce-ui/quantity-input-basic";
import StarRating_Fractions from "@/app/components/commerce-ui/star-rating-fractions";
import { Button } from "@/app/components/ui/button";
import { ModelProps } from "@/types/model-types";
import {
  ChevronRightIcon,
  Download,
  DownloadIcon,
  Eye,
  Heart,
  ShieldCheck,
  ShoppingCart,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import STLViewer from "../viewer-3d";
import { getPreviewUrl } from "@/helpers/get-product-files";

const DEFAULT_PRODUCT_IMAGES: CarouselImage[] = [
  {
    title: "Logo",
    display_order: 1,
    url: "https://raw.githubusercontent.com/stackzero-labs/ui/refs/heads/main/public/placeholders/coffee-machine-01.jpg",
    type: "image",
  },
];

function ModelDetails({
  product_files = [],
  badge = "New Arrival",
  description = "Ürün açıklaması...",
  title = "Ürün Başlığı",
  defaultImages = [],
  errorMessage = null,
  rating = 4.8,
  viewCount = 0,
  downloadCount = 0,
  likeCount = 0,
  author = "Tasarımcı",
  images = [],
  onAddToCart = () => {},
  onBuyNow = () => {},
  onQuantityChange,
  price = 0,
  price_digital = 0,
  quantity: controlledQuantity,
  warranty = "Digital Access",
}: ModelProps) {
  const [internalQuantity, setInternalQuantity] = useState(1);

  const isQuantityControlled = controlledQuantity !== undefined;
  const quantity = isQuantityControlled ? controlledQuantity : internalQuantity;
  const totalPrice = price * quantity;

  const handleQuantityChange = (newQuantity: number) => {
    if (isQuantityControlled) onQuantityChange?.(newQuantity);
    else setInternalQuantity(newQuantity);
  };

  const validCarouselImages = useMemo(() => {
    const rawImages = images?.length > 0 ? images : defaultImages;
    if (!rawImages || rawImages.length === 0) return DEFAULT_PRODUCT_IMAGES;

    return rawImages.filter(
      (img) => img.type === "image" || img.type === "video" || !img.type
    ) as CarouselImage[];
  }, [images, defaultImages]);

  if (errorMessage) {
    return (
      <div className="my-6 rounded-lg border p-6 text-red-600 dark:border-red-900">
        <p className="font-medium">Hata oluştu</p>
        <p className="text-sm">{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col p-4">
      <div className="relative flex flex-col overflow-hidden rounded-xl border border-purple-500/20 shadow-sm transition-all duration-300">
        {/* DÜZELTME: items-start eklendi. Bu, sol kolonun sağ kolon kadar uzamasını engeller. */}
        <div className="flex flex-col lg:flex-row items-start">
          {/* Sol Kolon: Slider */}
          <div className="relative flex w-full flex-col lg:w-1/2 p-6">
            {badge && (
              <div className="absolute top-4 left-4 z-20">
                <div className="rounded-md bg-purple-800 px-3 py-1 text-xs font-bold text-white uppercase shadow-md">
                  {badge}
                </div>
              </div>
            )}

            <ImageCarouselBasic
              images={validCarouselImages}
              showThumbs={true}
              thumbPosition="bottom"
              imageFit="contain"
            />
          </div>

          {/* Sağ Kolon: Detaylar */}
          <div className="relative z-10 flex flex-1 flex-col p-6 lg:w-1/2 lg:border-l border-t lg:border-t-0 border-purple-500/20 h-full">
            <div className="flex-1">
              <div className="mb-6">
                {/* DÜZELTME: Başlık alanı flex yapısı iyileştirildi */}
                <div className="flex items-start justify-between gap-4">
                  <h1 className="text-2xl font-bold text-purple-950 dark:text-purple-50 flex-1 leading-tight break-words">
                    {title}
                  </h1>
                  <div className="shrink-0">
                    <PriceFormat
                      value={price}
                      className="text-2xl font-bold text-purple-700"
                    />
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <StarRating_Fractions
                    value={rating}
                    readOnly
                    iconSize={16}
                    color="#301c43"
                  />
                  <div className="flex items-center gap-3 text-gray-500 text-xs">
                    <span className="flex items-center">
                      <Eye className="mr-1 h-3.5 w-3.5" />
                      {viewCount}
                    </span>
                    <span className="flex items-center">
                      <Download className="mr-1 h-3.5 w-3.5" />
                      {downloadCount}
                    </span>
                    <span className="flex items-center">
                      <Heart className="mr-1 h-3.5 w-3.5" />
                      {likeCount}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-6 flex items-center gap-3 p-3 rounded-lg border border-purple-500/20 bg-purple-50/50 dark:bg-purple-900/10">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center font-bold text-purple-800 uppercase shrink-0">
                  {author.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold">{author}</p>
                  <p className="text-[10px] text-purple-600 uppercase">
                    Pro Designer
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                {description}
              </p>

              <div className="mb-8 p-4 rounded-xl border border-purple-500/20 shadow-sm bg-white dark:bg-transparent">
                <div className="flex items-center justify-between">
                  <div>
                    <QuantityInputBasic
                      quantity={quantity}
                      onChange={handleQuantityChange}
                      max={10}
                    />
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] font-bold uppercase text-gray-400">
                      Toplam
                    </span>
                    <PriceFormat
                      value={totalPrice}
                      className="text-xl font-black text-purple-800"
                    />
                  </div>
                </div>
              </div>
              {product_files?.map(async (file: any, index: any) => {
                return (
                  <Dialog key={index}>
                    <DialogTrigger asChild>
                      <Button
                        className="group cursor-pointer border-purple-500/20 h-auto mb-2 gap-4 py-3 text-left"
                        variant="outline"
                      >
                        <div className="space-y-1">
                          <h6 className="text-lg s">3d Görüntüle</h6>
                          <p className="whitespace-break-spaces font-normal text-sm text-gray">
                            {file?.file_name}
                          </p>
                        </div>
                        <ChevronRightIcon
                          aria-hidden="true"
                          className="opacity-60 transition-transform group-hover:translate-x-0.5"
                          size={16}
                        />
                      </Button>
                    </DialogTrigger>
                    <DialogContent fullscreen>
                      <DialogTitle className="hidden"></DialogTitle>
                      <STLViewer file_url={file?.file_url} />
                    </DialogContent>
                  </Dialog>
                );
              })}
            </div>

            <div className="flex flex-col gap-3 mt-auto">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 h-12 border-purple-500/20 cursor-pointer text-purple-900 hover:bg-purple-50"
                  onClick={() =>
                    onAddToCart({ productPrice: price, quantity, totalPrice })
                  }
                >
                  <ShoppingCart className="mr-2 h-4 w-4" /> Sepete Ekle
                </Button>
                <Button
                  className="flex-1 h-12 cursor-pointer bg-purple-800 text-white hover:bg-purple-900"
                  onClick={() =>
                    onBuyNow({ productPrice: price, quantity, totalPrice })
                  }
                >
                  <DownloadIcon className="mr-2 h-4 w-4" /> İndir
                  <PriceFormat_Basic
                    value={price_digital}
                    className="ml-1 text-xs opacity-80"
                  />
                </Button>
              </div>
              <p className="flex items-center justify-center text-[10px] text-gray-400">
                <ShieldCheck className="mr-1 h-3 w-3" /> {warranty} Lisansı
                Dahildir
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModelDetails;

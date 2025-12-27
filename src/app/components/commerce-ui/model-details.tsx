"use client";

import ImageCarouselBasic, {
  CarouselImage,
} from "@/app/components/commerce-ui/image-carousel-basic";
import PriceFormat_Basic from "@/app/components/commerce-ui/price-format-basic";
import PriceFormat from "@/app/components/commerce-ui/price-format-basic";
import QuantityInputBasic from "@/app/components/commerce-ui/quantity-input-basic";
import StarRating_Fractions from "@/app/components/commerce-ui/star-rating-fractions";
import { Button } from "@/app/components/ui/button";
import { ModelProps } from "@/types/model-types";
import {
  ShieldCheck,
  Eye,
  Download,
  Heart,
  Hammer,
  ShoppingCart,
  DownloadIcon,
} from "lucide-react";
import { useState } from "react";

export interface ProductSelectionPayload {
  productPrice: number;
  quantity: number;
  totalPrice: number;
}

const DEFAULT_PRODUCT_IMAGES: CarouselImage[] = [
  {
    title: "Logo",
    url: "https://raw.githubusercontent.com/stackzero-labs/ui/refs/heads/main/public/placeholders/coffee-machine-01.jpg",
  },
];

function ModelDetails({
  badge = "New Arrival",
  description = "Product description goes here...",
  title = "Product Title",
  defaultImages = [],
  errorMessage = null,
  rating = 4.8,
  viewCount = 0,
  downloadCount = 0,
  likeCount = 0,
  makeCount = 0,
  author = "Rüstem Aydın",
  images = DEFAULT_PRODUCT_IMAGES,
  isLoading = false,
  onAddToCart = () => {}, // Dışarıdan gelen fonksiyonlar
  onBuyNow = () => {},
  onQuantityChange,
  price = 0,
  price_digital = 0,
  quantity: controlledQuantity,
  reviewCount = 0,
  warranty = "Digital Access",
}: ModelProps) {
  const [internalQuantity, setInternalQuantity] = useState(1);

  const isQuantityControlled = controlledQuantity !== undefined;
  const quantity = isQuantityControlled ? controlledQuantity : internalQuantity;

  const totalPrice = price * quantity;

  const handleQuantityChange = (newQuantity: number) => {
    if (isQuantityControlled) {
      onQuantityChange?.(newQuantity);
    } else {
      setInternalQuantity(newQuantity);
    }
  };

  // Sepete ekleme işlemi
  const handleAddToCart = () => {
    onAddToCart({
      productPrice: price,
      quantity,
      totalPrice,
    });
  };

  // Satın alma işlemi
  const handleBuyNow = () => {
    onBuyNow({
      productPrice: price,
      quantity,
      totalPrice,
    });
  };

  if (errorMessage) {
    return (
      <div className="my-6 rounded-lg border  p-6 text-red-600 dark:border-red-900  dark:text-red-400">
        <p className="font-medium">Error loading product</p>
        <p className="text-sm">{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col">
      <div className="border-brown-200 dark:border-brown-800 relative flex flex-col overflow-hidden rounded-xl border  border-purple-500/20  shadow-sm transition-all duration-300 hover:shadow-md ">
        {/* Dekoratif Arka Plan */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-8 -left-8 h-32 w-32 animate-pulse rounded-full bg-purple-700/10"></div>
          <div className="absolute right-0 bottom-0 h-40 w-40 rounded-full bg-purple-900/5 blur-md"></div>
        </div>

        <div className="flex flex-col lg:flex-row">
          <div className="relative flex w-full flex-col from-purple-50/50 via-white lg:w-1/2 dark:from-gray-900 dark:via-gray-800/50">
            {badge && (
              <div className="absolute top-4 left-4 z-20">
                <div className="rounded-md bg-purple-800 px-3 py-1 text-xs font-bold text-white uppercase shadow-md">
                  {badge}
                </div>
              </div>
            )}

            <div className="relative z-10 flex h-full items-center justify-center p-6">
              <ImageCarouselBasic
                images={images.length > 0 ? images : defaultImages}
                showThumbs={true}
                thumbPosition="bottom"
                className="mx-auto"
              />
            </div>
          </div>

          <div className="relative z-10 flex flex-1 flex-col p-6 lg:w-1/2 border-l border-purple-500/20 ">
            <div className="flex-1">
              <div className="mb-4">
                <div className="flex items-start justify-between gap-4">
                  <h1 className="text-2xl font-bold text-purple-950 dark:text-purple-50 leading-tight">
                    {title}
                  </h1>
                  <PriceFormat
                    value={price}
                    className="text-2xl font-bold text-purple-700  shrink-0"
                  />
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-4">
                  <div className="flex items-center">
                    <StarRating_Fractions
                      value={rating}
                      readOnly
                      iconSize={16}
                      color="#301c43"
                    />
                    <span className="ml-2 text-sm font-medium text-purple-800 dark:text-purple-500">
                      ({reviewCount})
                    </span>
                  </div>

                  <div className="flex items-center  gap-2 border-l border-purple-200 pl-4 dark:border-purple-800">
                    <div
                      className="flex items-center text-[11px] text-gray-500"
                      title="Views"
                    >
                      <Eye className="mr-1 h-3.5 w-3.5 text-purple-700/70" />
                      <span>{viewCount.toLocaleString()}</span>
                    </div>
                    <div
                      className="flex items-center text-[11px] text-gray-500"
                      title="Downloads"
                    >
                      <Download className="mr-1 h-3.5 w-3.5 text-purple-700/70" />
                      <span>{downloadCount.toLocaleString()}</span>
                    </div>
                    <div
                      className="flex items-center text-[11px] text-gray-500"
                      title="Likes"
                    >
                      <Heart className="mr-1 h-3.5 w-3.5 text-purple-700/70" />
                      <span>{likeCount.toLocaleString()}</span>
                    </div>
                    <div
                      className="flex items-center text-[11px] text-gray-500"
                      title="Makes"
                    >
                      <Hammer className="mr-1 h-3.5 w-3.5 text-purple-700/70" />
                      <span>{makeCount}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tasarımcı (Author) Bölümü */}
              <div className="mb-6 flex items-center justify-between rounded-xl border border-purple-100 bg-purple-50/30 p-4 dark:border-purple-900/20 dark:bg-purple-950/10">
                <div className="flex items-center space-x-3 gap-2">
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-800 font-bold uppercase border-2 border-white shadow-sm">
                    {author.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-purple-950 dark:text-purple-50">
                      {author}
                    </p>
                    <p className="text-[10px] text-purple-700/60 uppercase tracking-tighter">
                      Pro Designer
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                {description}
              </p>

              {/* Adet ve Toplam Fiyat Bölümü */}
              <div className="mb-8 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold text-purple-900 dark:text-purple-200 uppercase tracking-wider">
                      Adet
                    </label>
                    <QuantityInputBasic
                      quantity={quantity}
                      onChange={handleQuantityChange}
                      max={10}
                      className="w-[120px] bg-white dark:bg-gray-900 border-purple-100"
                    />
                  </div>
                  <div className="text-right">
                    <span className="block text-xs font-bold text-purple-900 dark:text-purple-200 uppercase tracking-wider">
                      Toplam Tutar
                    </span>
                    <PriceFormat
                      value={totalPrice}
                      className="text-xl font-black text-purple-800 dark:text-purple-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleAddToCart}
                  className="flex-1 border-purple-300 h-12 font-bold text-purple-900 cursor-pointer dark:border-purple-800 dark:text-purple-100"
                  disabled={isLoading}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Sepete Ekle
                </Button>
                <Button
                  onClick={handleBuyNow}
                  className="flex-1 bg-purple-800 h-12 font-bold text-white hover:bg-purple-900 cursor-pointer dark:bg-purple-700 transition-all shadow-lg shadow-purple-900/20"
                  disabled={isLoading}
                >
                  <DownloadIcon className=" h-4 w-4 fill-white" />
                  İndir
                  <PriceFormat_Basic
                    value={price_digital}
                    className="text-xs"
                  />
                </Button>
              </div>
              <p className="flex items-center justify-center text-[10px] font-medium text-gray-400 mt-1">
                <ShieldCheck className="mr-1.5 h-3 w-3" />
                {warranty} Lisansı Dahildir
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModelDetails;

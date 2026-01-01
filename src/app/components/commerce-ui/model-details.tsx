"use client";
import ImageCarouselBasic, {
  CarouselImage,
} from "@/app/components/commerce-ui/image-carousel-basic";
import PriceFormat from "@/app/components/commerce-ui/price-format-basic";
import QuantityInputBasic from "@/app/components/commerce-ui/quantity-input-basic";
import StarRating_Fractions from "@/app/components/commerce-ui/star-rating-fractions";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge"; // Badge bileşenini import ettiğinizden emin olun
import { ModelProps } from "@/types/model-types";
import {
  DownloadIcon,
  Eye,
  Heart,
  ShieldCheck,
  ShoppingCart,
  Box,
} from "lucide-react";
import { useMemo, useState } from "react";
import Drawer3D from "../drawer-3d";

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
  // Props'a collections eklendiğini varsayıyorum
  collections = ["Fidget", "Tactical", "Mechanical"],
}: ModelProps & { collections?: string[] }) {
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
      <div className="my-6 rounded-lg border p-6 text-red-600 dark:border-red-900 bg-red-50">
        <p className="font-medium">Hata oluştu</p>
        <p className="text-sm">{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col p-4">
      <div className="relative flex flex-col overflow-hidden rounded-2xl border border-purple-500/20 bg-white dark:bg-neutral-950 shadow-xl transition-all duration-300">
        <div className="flex flex-col lg:flex-row items-stretch">
          {/* Sol Kolon: Slider */}
          <div className="relative flex w-full flex-col lg:w-1/2 p-6 bg-neutral-50/50 dark:bg-neutral-900/20">
            {badge && (
              <div className="absolute top-8 left-8 z-20">
                <Badge className="bg-purple-700 hover:bg-purple-800 text-white px-3 py-1 shadow-lg border-none">
                  {badge}
                </Badge>
              </div>
            )}

            <div className="sticky top-6">
              <ImageCarouselBasic
                images={validCarouselImages}
                showThumbs={true}
                thumbPosition="bottom"
                imageFit="contain"
                className="rounded-xl overflow-hidden"
              />
            </div>
          </div>

          {/* Sağ Kolon: Detaylar */}
          <div className="relative z-10 flex flex-1 flex-col p-8 lg:w-1/2 lg:border-l border-t lg:border-t-0 border-purple-500/20">
            {/* Üst Kısım: Başlık ve Bilgiler */}
            <div className="flex-1 flex flex-col">
              {/* KOLEKSİYON LİSTESİ (Title Üstüne) */}
              <div className="flex flex-wrap gap-2 mb-3">
                {collections.map((cat, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-none text-[10px] uppercase tracking-wider font-bold"
                  >
                    {cat}
                  </Badge>
                ))}
              </div>

              <div className="mb-6">
                <div className="flex items-start justify-between gap-4">
                  <h1 className="text-3xl font-extrabold text-purple-950 dark:text-amber-50 flex-1 leading-tight break-words tracking-tight">
                    {title}
                  </h1>
                  <div className="shrink-0 text-right">
                    <span className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                      Fiziksel Sipariş
                    </span>
                    <PriceFormat
                      value={price}
                      className="text-3xl font-black text-purple-800 dark:text-purple-400"
                    />
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-6">
                  <StarRating_Fractions
                    value={rating}
                    readOnly
                    iconSize={18}
                    color="#6b21a8"
                  />
                  <div className="flex items-center gap-4 text-gray-500 text-sm font-medium">
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" /> {viewCount.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <DownloadIcon className="h-4 w-4" />{" "}
                      {downloadCount.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-4 w-4 fill-red-500 text-red-500" />{" "}
                      {likeCount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tasarımcı Kartı */}
              <div className="mb-6 flex items-center gap-4 p-4 rounded-xl border border-purple-500/10 bg-purple-50/30 dark:bg-purple-900/5 transition-colors hover:bg-purple-50/60">
                <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-white uppercase shadow-md shrink-0 border-2 border-white">
                  {author.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-purple-950 dark:text-white uppercase tracking-tight">
                    {author}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] text-purple-600 dark:text-purple-400 font-bold uppercase">
                    <Box size={10} /> Pro Verified Designer
                  </div>
                </div>
              </div>

              <div className="prose prose-sm dark:prose-invert mb-8">
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {description}
                </p>
              </div>

              <div className="mb-8">
                <Drawer3D product_files={product_files} />
              </div>

              {/* Fiyat ve Adet Seçimi */}
              <div className="mb-8 p-5 rounded-2xl border border-purple-500/20 bg-neutral-50 dark:bg-neutral-900/40">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase text-purple-800/60 dark:text-purple-400/60">
                      Adet Seçimi
                    </label>
                    <QuantityInputBasic
                      quantity={quantity}
                      onChange={handleQuantityChange}
                      max={10}
                      className="bg-white dark:bg-neutral-800 border-purple-100"
                    />
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                      Tahmini Toplam
                    </span>
                    <PriceFormat
                      value={totalPrice}
                      className="text-2xl font-black text-purple-900 dark:text-purple-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Alt Kısım: Sabitlenmiş Butonlar */}
            <div className="flex flex-col gap-4 mt-auto pt-6 border-t border-purple-500/10">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 h-14 border-purple-500/30 font-bold text-purple-900 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all active:scale-95"
                  onClick={() =>
                    onAddToCart({ productPrice: price, quantity, totalPrice })
                  }
                >
                  <ShoppingCart className="mr-2 h-5 w-5" /> Sepete Ekle
                </Button>

                <Button
                  size="lg"
                  className="flex-1 h-14 bg-purple-800 text-white hover:bg-purple-900 shadow-lg shadow-purple-900/20 transition-all active:scale-95 flex flex-col items-center justify-center gap-0"
                  onClick={() =>
                    onBuyNow({ productPrice: price, quantity, totalPrice })
                  }
                >
                  <div className="flex items-center font-black">
                    <DownloadIcon className="mr-2 h-5 w-5" /> Modeli İndir
                  </div>
                  <div className="text-[10px] opacity-80 font-medium">
                    Dijital Dosya Lisansı:{" "}
                    <PriceFormat
                      value={price_digital}
                      className="inline ml-1"
                    />
                  </div>
                </Button>
              </div>

              <div className="flex items-center justify-center gap-4 py-2">
                <p className="flex items-center text-[10px] text-gray-400 font-medium">
                  <ShieldCheck className="mr-1.5 h-3.5 w-3.5 text-green-500" />{" "}
                  {warranty} Güvenli Lisans
                </p>
                <div className="h-1 w-1 rounded-full bg-gray-300" />
                <p className="text-[10px] text-gray-400 font-medium lowercase">
                  Anında Teslimat
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModelDetails;

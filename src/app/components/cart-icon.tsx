"use client";

import React, { useEffect, useState } from "react";
import {
  ShoppingCart,
  Trash2,
  ShoppingBag,
  Loader2,
  X,
  Minus,
  Plus,
} from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import Image from "next/image";

// Kendi projenizdeki path'lere göre kontrol edin
import PriceFormat from "./commerce-ui/price-format-basic";
import QuantityInputBasic from "./commerce-ui/quantity-input-basic";
import { useCartStore } from "@/store/useCartStore";

export default function CartDrawer() {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { items, removeItem, updateQuantity, getTotalPrice, getItemCount } =
    useCartStore();

  const vatRate = 0.2; // %20 KDV
  const shippingCost = 15.0;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const subtotal = getTotalPrice();
  const vatAmount = subtotal * vatRate;
  const totalAmount = subtotal > 0 ? subtotal + vatAmount + shippingCost : 0;
  const totalItems = getItemCount();

  // --- İÇ FONKSİYON (Simülasyon) ---
  const handleCheckout = () => {
    setIsLoading(true);
    setTimeout(() => {
      alert("Ödeme sayfasına yönlendiriliyorsunuz...");
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          aria-label="Sepeti Aç"
          className="relative"
          size="icon"
          variant="outline"
        >
          <ShoppingCart aria-hidden="true" size={18} />
          {totalItems > 0 && (
            <Badge className="-top-2 -translate-x-1/2 absolute left-full min-w-5 px-1 bg-gradient-to-r from-blue-600 to-violet-600 text-white border-none">
              {totalItems > 99 ? "99+" : totalItems}
            </Badge>
          )}
        </Button>
      </DrawerTrigger>

      <DrawerContent className="bg-white dark:bg-gray-900 border-t dark:border-gray-800 max-h-[90vh]">
        <div className="mx-auto w-full max-w-2xl flex flex-col h-full overflow-hidden">
          {/* Mağaza Header (Görseldeki Gradyan Stil) */}
          <div className="flex items-center gap-3 bg-linear-to-r from-blue-600 to-violet-600 p-6 text-white rounded-t-xl mx-4 mt-2">
            <div className="h-10 w-10 overflow-hidden rounded-full bg-white p-1 flex items-center justify-center">
              <ShoppingBag className="text-blue-600 h-6 w-6" />
            </div>
            <DrawerHeader className="p-0 text-left">
              <DrawerTitle className="text-xl font-bold text-white">
                Alışveriş Sepetim
              </DrawerTitle>
              <DrawerDescription className="text-blue-100 text-xs">
                Toplam {totalItems} ürün bulunmaktadır.
              </DrawerDescription>
            </DrawerHeader>
          </div>

          {totalItems === 0 ? (
            <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
              <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-8">
                <ShoppingCart size={48} className="text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold">Sepetiniz boş görünüyor</h2>
              <DrawerClose asChild>
                <Button variant="link" className="text-blue-600">
                  Modelleri Keşfetmeye Dön
                </Button>
              </DrawerClose>
            </div>
          ) : (
            <>
              {/* Ürün Listesi Alanı */}
              <ScrollArea className="flex-1 px-6 py-4 overflow-y-auto">
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {items.map((item) => (
                    <div key={item.id} className="py-4 first:pt-0">
                      <div className="flex gap-4 items-center">
                        {/* Ürün Önizleme */}
                        <div className="h-20 w-20 relative shrink-0 rounded-lg bg-gray-50 dark:bg-gray-800 overflow-hidden border dark:border-gray-700">
                          <Image
                            src={item.imageUrl || ""}
                            alt={item.title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>

                        {/* Ürün Detay */}
                        <div className="flex flex-col justify-between flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-sm text-gray-900 dark:text-white truncate">
                                {item.title}
                              </h3>
                              <p className="text-[10px] text-gray-500 uppercase tracking-tighter">
                                Tasarım: {item.author}
                              </p>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-gray-400 hover:text-red-500 p-1"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            <QuantityInputBasic
                              quantity={item.quantity}
                              min={1}
                              onChange={(val) => updateQuantity(item.id, val)}
                              className="h-8 scale-90 origin-left"
                            />
                            <div className="text-right">
                              <PriceFormat
                                value={item.price * item.quantity}
                                className="font-bold text-sm text-blue-600 dark:text-blue-400"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <DrawerFooter className="bg-gray-50 dark:bg-gray-800/40 border-t p-6">
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="space-y-1 text-left">
                    <p>Ara Toplam:</p>
                    <p>Kargo:</p>
                    <p>Vergi (%20):</p>
                  </div>
                  <div className="space-y-1 flex flex-col text-right font-medium text-gray-900 dark:text-white">
                    <PriceFormat value={subtotal} />
                    <PriceFormat value={shippingCost} />
                    <PriceFormat value={vatAmount} />
                  </div>

                  <div className="col-span-2 border-t pt-3 mt-1 flex justify-between items-center">
                    <span className="text-lg font-black uppercase tracking-wider">
                      Toplam
                    </span>
                    <PriceFormat
                      value={totalAmount}
                      className="text-2xl font-black text-blue-600 dark:text-blue-400"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    onClick={handleCheckout}
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold text-md rounded-xl hover:opacity-90 shadow-lg transition-all"
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Ödemeye Geç"
                    )}
                  </Button>

                  <DrawerClose asChild>
                    <Button
                      variant="ghost"
                      className="w-full text-xs text-gray-400"
                    >
                      Alışverişe Devam Et
                    </Button>
                  </DrawerClose>
                </div>
              </DrawerFooter>
            </>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

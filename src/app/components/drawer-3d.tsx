import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";
import { Button } from "./ui/button";
import { ArrowUpRight, ChevronRightIcon, Cuboid, X } from "lucide-react"; // X ikonu eklendi (kapatma için opsiyonel)
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import STLViewer from "./viewer-3d";
import { DrawerClose } from "./ui/drawer"; // Kapatma butonu için

// Dosya boyutunu (bytes) okunabilir formata çeviren yardımcı fonksiyon
const formatFileSize = (size: string | number) => {
  if (!size) return "Bilinmiyor";

  const stringSize = size.toString();
  if (isNaN(Number(stringSize))) return stringSize;

  const bytes = Number(stringSize);
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

type Drawer3DProps = {
  product_files: any[];
};

const Drawer3D = ({ product_files }: Drawer3DProps) => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          className={cn(
            "relative w-full h-14 px-4 overflow-hidden",
            "bg-zinc-900 dark:bg-zinc-100",
            "transition-all duration-200",
            "group"
          )}
        >
          <div
            className={cn(
              "absolute inset-0",
              "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500",
              "opacity-40 group-hover:opacity-80",
              "blur transition-opacity duration-500"
            )}
          />

          <div className="relative flex items-center justify-center gap-2">
            <span className="text-white dark:text-zinc-900 font-medium">
              3D Görüntüle
            </span>
            <ArrowUpRight className="w-4 h-4 text-white/90 dark:text-zinc-900/90" />
          </div>
        </Button>
      </DrawerTrigger>

      {/* max-h-[85vh] ile yüksekliği sınırlıyoruz ki scroll oluşsun */}
      <DrawerContent className="bg-white dark:bg-gray-950 border-t dark:border-gray-800 max-h-[85vh] h-[85vh]">
        {/* Ana Kapsayıcı: Flex Column ve h-full önemli */}
        <div className="mx-auto w-full max-w-2xl flex flex-col h-full">
          {/* HEADER: Sabit kalacak kısım */}
          <div className="pt-6 pb-4 px-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between shrink-0">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                3D Dosyalar
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {product_files?.length || 0} adet dosya listeleniyor.
              </p>
            </div>
            <DrawerClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>

          {/* LISTE ALANI: Scroll buraya uygulanıyor */}
          {/* flex-1: Kalan boşluğu doldur */}
          {/* overflow-y-auto: Dikey scroll yap */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {product_files?.map((file: any, index: any) => {
              const hasThumbnail = file?.thumbnail_url;

              return (
                <Dialog key={index}>
                  <DialogTrigger asChild>
                    <Button
                      className={cn(
                        "w-full h-auto p-3 flex items-center justify-between",
                        "bg-white dark:bg-gray-900",
                        "border border-gray-200 dark:border-gray-800",
                        "hover:border-purple-500/50 hover:bg-gray-50 dark:hover:bg-gray-800/50",
                        "transition-all duration-200 group text-left shadow-sm",
                        "animate-in fade-in slide-in-from-bottom-2 duration-300" // Giriş animasyonu
                      )}
                      style={{ animationDelay: `${index * 50}ms` }} // Sırayla gelmesi için
                      variant="ghost"
                    >
                      <div className="flex items-center gap-4">
                        {/* İkon / Resim */}
                        <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-700 shrink-0">
                          {hasThumbnail ? (
                            <img
                              src={hasThumbnail}
                              alt={file.file_name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Cuboid
                              className="w-7 h-7 text-purple-500/70"
                              strokeWidth={1.5}
                            />
                          )}
                        </div>

                        {/* Text Bilgisi */}
                        <div className="flex flex-col gap-1 min-w-0">
                          <h6 className="font-medium text-gray-900 dark:text-gray-100 truncate text-base">
                            {file?.file_name || "İsimsiz Dosya"}
                          </h6>
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300 font-bold text-[10px] tracking-wider">
                              {file?.file_type
                                ? file.file_type.toUpperCase().replace(".", "")
                                : "STL"}
                            </span>
                            <span>•</span>
                            <span>{formatFileSize(file?.file_size)}</span>
                          </div>
                        </div>
                      </div>

                      <ChevronRightIcon
                        className="text-gray-300 group-hover:text-purple-500 group-hover:translate-x-1 transition-all shrink-0 ml-2"
                        size={20}
                      />
                    </Button>
                  </DialogTrigger>

                  {/* STL Viewer Dialog */}
                  <DialogContent
                    fullscreen
                    className="p-0 gap-0 bg-black border-none"
                  >
                    <DialogTitle className="hidden">
                      3D Görüntüleyici
                    </DialogTitle>
                    <div className="relative w-full h-full flex flex-col">
                      <div className="absolute top-0 left-0 right-0 z-50 p-4 flex justify-between items-start pointer-events-none">
                        <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg text-white pointer-events-auto">
                          <p className="font-medium text-sm">
                            {file?.file_name}
                          </p>
                        </div>
                        {/* Dialog kapatma butonu DialogContent içinde default gelir ama stil verilebilir */}
                      </div>

                      <div className="flex-1 w-full h-full bg-gradient-to-b from-gray-900 to-black">
                        <STLViewer file_url={file?.file_url} />
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              );
            })}

            {(!product_files || product_files.length === 0) && (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500 gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <Cuboid className="w-6 h-6 opacity-40" />
                </div>
                <p>Görüntülenecek 3D dosya bulunamadı.</p>
              </div>
            )}

            {/* Scroll'un en altında biraz boşluk bırakır */}
            <div className="h-6"></div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default Drawer3D;

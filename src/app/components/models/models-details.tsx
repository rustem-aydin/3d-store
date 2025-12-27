"use client";
import ModelDetails from "@/app/components/commerce-ui/model-details";
import { useProductDetail } from "@/lib/supabase/hooks/usePoducts";
import { useCartStore } from "@/store/useCartStore"; // Zustand store importu

export default function ModelDetailsContainer({ slug }: { slug: string }) {
  const { data: product, isLoading, error } = useProductDetail(slug);

  const addItem = useCartStore((state) => state.addItem);

  if (isLoading) return <div className="py-24 text-center">Yükleniyor...</div>;
  if (error || !product)
    return (
      <div className="py-24 text-center text-red-500">
        Ürün yüklenirken bir hata oluştu veya ürün bulunamadı.
      </div>
    );
  return (
    <div className="container mx-auto py-24 p-4">
      <ModelDetails
        title={product.title}
        description={product.description}
        price={product.price}
        price_digital={product.price_digital}
        badge={product.price === 0 ? "Ücretsiz" : "Premium"}
        author={product.author || "Anonim"}
        viewCount={product.view_count}
        downloadCount={product.download_count}
        likeCount={product.like_count}
        makeCount={product.make_count}
        images={product.product_images?.map((img: any) => ({
          url: img.image_url,
          title: product.title,
        }))}
        onAddToCart={(payload) => {
          addItem({
            id: product.id,
            title: product.title,
            price: product.price,
            quantity: payload.quantity, // Seçilen adet bilgisi payload'dan gelir
            imageUrl: product.product_images?.[0]?.image_url || "",
            author: product.author || "Anonim",
            slugText: product.slug_text || slug,
          });
        }}
      />
    </div>
  );
}

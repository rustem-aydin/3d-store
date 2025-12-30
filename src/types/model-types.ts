export interface ProductSelectionPayload {
  productPrice: number;
  quantity: number;
  totalPrice: number;
}

// 1. ProductFile tipini tanımlıyoruz (JSON'dan gelen yapıya uygun)
export type ProductFile = {
  id?: string;
  file_url: string; // <-- TypeScript'in aradığı anahtar bu
  file_name?: string;
  file_size?: string;
  file_type?: string;
  display_order?: number;
};

// 2. CarouselImage tipini tanımlıyoruz (Normal görseller için)
export type CarouselImage = {
  id?: string;
  title?: string;
  url: string; // <-- Normal görsellerde bu kullanılır
  display_order?: number;
  type?: "image" | "video" | "model";
  thumbnailUrl?: string;
};

// 3. ModelProps'u güncelliyoruz
export interface ModelProps {
  title?: string;
  description?: string;
  price?: number;
  price_digital: number;

  badge?: string | null;
  rating?: number;
  reviewCount?: number;
  viewCount?: number;
  downloadCount?: number;
  likeCount?: number;
  makeCount?: number;
  author?: string;
  warranty?: string;

  images?: CarouselImage[]; // Normal resimler (url kullanır)
  product_files?: ProductFile[]; // STL Dosyaları (file_url kullanır) <--- DÜZELTİLDİ
  defaultImages?: CarouselImage[];

  quantity?: number;
  onQuantityChange?: (quantity: number) => void;
  onAddToCart?: (payload: ProductSelectionPayload) => void;
  onBuyNow?: (payload: ProductSelectionPayload) => void;
  onFollowAuthor?: () => void;
  isLoading?: boolean;
  errorMessage?: string | null;
  currencyPrefix?: string;
  featuredReview?: {
    rating: number;
    reviewDate: string;
    reviewText: string;
    avatarUrl: string;
    reviewerName: string;
    reviewerTitle: string;
  };
}

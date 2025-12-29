import { ProductSelectionPayload } from "@/app/components/commerce-ui/model-details";

export type CarouselImage = {
  title?: string;
  url: string;
  display_order?: number;
  type?: "image" | "video" | "model";
  thumbnailUrl?: string;
};

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
  images?: CarouselImage[];
  product_files?: CarouselImage[]; // STL Dosyaları buraya gelecek
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

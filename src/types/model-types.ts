import { CarouselImage } from "@/app/components/commerce-ui/image-carousel-basic";
import { ProductSelectionPayload } from "@/app/components/commerce-ui/model-details";

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

export interface InteractiveProductCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  imageUrl: string;
  title: string;
  slug_text: string;
  category: string;
  price: string;
  formats: string[];
  isPremium?: boolean;
}

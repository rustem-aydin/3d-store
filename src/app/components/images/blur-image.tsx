"use client";
import { cn } from "@/lib/utils";
import NextImage from "next/image";
import { useState, useCallback, memo } from "react";

type ImageProps = {
  imageClassName?: string;
  lazy?: boolean;
} & React.ComponentProps<typeof NextImage>;

const BlurImage = memo((props: ImageProps) => {
  const {
    alt,
    src,
    className,
    imageClassName,
    lazy = true,
    priority = false,
    loading,
    ...rest
  } = props;

  const [isLoading, setIsLoading] = useState(true);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Lazy loading mantığını optimize et
  const imageLoading = priority
    ? undefined
    : loading || (lazy ? "lazy" : "eager");

  return (
    <div className={cn("overflow-hidden", className)}>
      <NextImage
        className={cn(
          "duration-700 ease-in-out",
          isLoading ? "scale-105 blur-lg" : "scale-100 blur-0",
          imageClassName
        )}
        onLoadingComplete={() => setIsLoading(false)}
        src={src}
        alt={alt}
        loading={imageLoading}
        priority={priority}
        onLoad={handleLoad}
        {...rest}
      />
    </div>
  );
});

BlurImage.displayName = "BlurImage";

export { BlurImage };

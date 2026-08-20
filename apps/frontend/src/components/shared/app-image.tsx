'use client';

import { useState } from 'react';
import { ImageIcon, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

type AppImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  imgClassName?: string;
  /** Product-style icon; defaults to image icon */
  variant?: 'product' | 'image';
};

/**
 * Renders an image when `src` is valid; otherwise (or on load error)
 * shows a muted placeholder.
 */
export function AppImage({
  src,
  alt,
  className,
  imgClassName,
  variant = 'product',
}: AppImageProps) {
  const [failed, setFailed] = useState(false);
  const url = typeof src === 'string' ? src.trim() : '';
  const showImage = Boolean(url) && !failed;
  const Icon = variant === 'product' ? Package : ImageIcon;

  return (
    <div
      className={cn(
        'relative flex shrink-0 items-center justify-center overflow-hidden bg-muted text-muted-foreground',
        className,
      )}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element -- remote product URLs; fallback on error
        <img
          src={url}
          alt={alt}
          className={cn('size-full object-cover', imgClassName)}
          onError={() => setFailed(true)}
        />
      ) : (
        <Icon className="size-[40%] max-h-8 max-w-8 opacity-60" aria-hidden />
      )}
      <span className="sr-only">{showImage ? alt : `${alt} placeholder`}</span>
    </div>
  );
}

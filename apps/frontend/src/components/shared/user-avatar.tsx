'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/helpers';
import { cn } from '@/lib/utils';

type UserAvatarProps = {
  name: string;
  src?: string | null;
  className?: string;
  fallbackClassName?: string;
};

/**
 * Avatar with image when available; initials placeholder otherwise
 * (also falls back if the image fails to load).
 */
export function UserAvatar({
  name,
  src,
  className,
  fallbackClassName,
}: UserAvatarProps) {
  const url = typeof src === 'string' ? src.trim() : '';

  return (
    <Avatar className={className}>
      {url ? <AvatarImage src={url} alt={name} /> : null}
      <AvatarFallback className={cn(fallbackClassName)}>
        {getInitials(name || '?')}
      </AvatarFallback>
    </Avatar>
  );
}

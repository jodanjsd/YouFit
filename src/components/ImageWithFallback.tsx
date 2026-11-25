import React, { useState } from 'react';
import { Dumbbell } from 'lucide-react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  fallbackTitle,
}) => {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#151917] via-[#1D231F] to-[#0B0D0C] text-[#A1AAA3] p-6 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Dumbbell className="w-8 h-8 text-[#B8F34A] mb-2" aria-hidden="true" />
        <span className="text-xs font-medium text-[#F7F9F6] max-w-[180px] truncate">
          {fallbackTitle || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
};

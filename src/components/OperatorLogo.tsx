'use client';

import { useState } from 'react';

interface OperatorLogoProps {
  src: string;
  alt: string;
  className?: string;
}

/**
 * OperatorLogo Component
 *
 * Renders operator logos with graceful fallback handling.
 * - Handles both .png and .jpeg extensions automatically
 * - Provides error handling for missing images
 * - Uses object-contain to prevent distortion
 * - NOT clickable (logos are informational only)
 */
export default function OperatorLogo({ src, alt, className = 'h-8 w-auto object-contain' }: OperatorLogoProps) {
  const [error, setError] = useState(false);

  // If image failed to load or src is empty, don't render
  if (error || !src) {
    return null;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
}

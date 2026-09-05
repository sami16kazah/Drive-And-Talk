'use client';

import React, { useState } from 'react';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarHalfIcon from '@mui/icons-material/StarHalf';

interface RatingStarsProps {
  rating: number;
  max?: number;
  interactive?: boolean;
  onRatingChange?: (newRating: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  max = 5,
  interactive = false,
  onRatingChange,
  size = 'md',
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const activeRating = hoverRating !== null ? hoverRating : rating;

  const sizeClasses = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-3xl',
  };

  return (
    <div className="flex items-center gap-0.5 text-amber-400">
      {Array.from({ length: max }, (_, index) => {
        const starValue = index + 1;
        const isFull = activeRating >= starValue;
        const isHalf = activeRating >= starValue - 0.5 && activeRating < starValue;

        return (
          <button
            key={index}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRatingChange && onRatingChange(starValue)}
            onMouseEnter={() => interactive && setHoverRating(starValue)}
            onMouseLeave={() => interactive && setHoverRating(null)}
            className={`${interactive ? 'cursor-pointer hover:scale-125 transition-transform' : 'cursor-default'} ${sizeClasses[size]}`}
          >
            {isFull ? (
              <StarIcon fontSize="inherit" />
            ) : isHalf ? (
              <StarHalfIcon fontSize="inherit" />
            ) : (
              <StarBorderIcon fontSize="inherit" className="text-gray-300" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default RatingStars;

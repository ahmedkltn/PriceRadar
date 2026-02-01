import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
}

const sizeClasses = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
};

export function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  interactive = false,
  onRatingChange,
  className,
}: StarRatingProps) {
  const handleClick = (value: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(value);
    }
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {Array.from({ length: maxRating }, (_, i) => {
        const starValue = i + 1;
        const filled = starValue <= Math.round(rating);
        const halfFilled = starValue - 0.5 <= rating && rating < starValue;

        return (
          <button
            key={i}
            type="button"
            onClick={() => handleClick(starValue)}
            disabled={!interactive}
            className={cn(
              "transition-colors",
              interactive && "cursor-pointer hover:scale-110",
              !interactive && "cursor-default"
            )}
            aria-label={`Rate ${starValue} out of ${maxRating}`}
          >
            <Star
              className={cn(
                sizeClasses[size],
                filled
                  ? "fill-primary text-primary"
                  : halfFilled
                  ? "fill-primary/50 text-primary/50"
                  : "fill-muted text-muted-foreground",
                interactive && "hover:fill-primary/80 hover:text-primary/80"
              )}
            />
          </button>
        );
      })}
      {!interactive && (
        <span className="ml-2 text-sm text-muted-foreground">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

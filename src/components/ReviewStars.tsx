type ReviewStarsProps = {
  rating: number;
  onChange?: (rating: number) => void;
  size?: "sm" | "lg";
};

export default function ReviewStars({
  rating,
  onChange,
  size = "lg",
}: ReviewStarsProps) {
  const interactive = Boolean(onChange);

  return (
    <div className="flex max-w-full flex-wrap items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(star)}
          aria-label={`Rate ${star} stars`}
          aria-pressed={interactive ? rating === star : undefined}
          className={`transition ${
            interactive ? "cursor-pointer hover:scale-110" : "cursor-default"
          } ${size === "lg" ? "text-3xl" : "text-lg"} ${
            star <= rating ? "text-amber-400" : "text-gray-600"
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

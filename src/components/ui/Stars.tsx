export function Stars({
  rating,
  size = 16,
}: {
  rating: number;
  size?: number;
}) {
  return (
    <div className="flex items-center" aria-label={`Note ${rating} sur 5`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const fill =
          rating >= i ? 1 : rating >= i - 0.5 ? 0.5 : 0;
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            <Star size={size} className="text-line absolute inset-0" filled />
            {fill > 0 && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fill * 100}%` }}
              >
                <Star size={size} className="text-gold" filled />
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}

function Star({
  size,
  className,
  filled,
}: {
  size: number;
  className?: string;
  filled?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      className={className}
    >
      <path d="M12 2l2.9 6.26L21.6 9.3l-4.8 4.68 1.13 6.62L12 17.6l-5.93 3 1.13-6.62L2.4 9.3l6.7-1.04L12 2z" />
    </svg>
  );
}

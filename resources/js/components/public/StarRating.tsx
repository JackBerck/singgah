import { Star } from 'lucide-react';

interface StarRatingProps {
    value: number; // 0-5, for display
    onChange?: (val: number) => void; // if provided → interactive
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
}

const sizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-7 w-7',
};

export default function StarRating({
    value,
    onChange,
    size = 'md',
    showLabel = false,
}: StarRatingProps) {
    const star = sizes[size];
    const interactive = !!onChange;

    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((i) => (
                <button
                    key={i}
                    type="button"
                    disabled={!interactive}
                    className={`transition-transform ${interactive ? 'cursor-pointer hover:scale-110 active:scale-95' : 'cursor-default'}`}
                    onClick={() => onChange?.(i)}
                    aria-label={`${i} bintang`}
                >
                    <Star
                        className={`${star} transition-colors ${
                            i <= value
                                ? 'fill-yellow-400 text-yellow-400'
                                : interactive
                                  ? 'text-gray-300 hover:text-yellow-300'
                                  : 'text-gray-200'
                        }`}
                    />
                </button>
            ))}
            {showLabel && value > 0 && (
                <span className="ml-1.5 text-sm font-semibold text-gray-700">
                    {value.toFixed(1)}
                </span>
            )}
        </div>
    );
}

import { Link } from '@inertiajs/react';
import { MapPin, Star, ChevronRight, Trees } from 'lucide-react';

export interface VillageCardData {
    id: number;
    name: string;
    slug: string;
    short_description: string | null;
    address: string | null;
    is_featured: boolean;
    cover_image: string | null;
    reviews_count: number;
    reviews_avg_rating: number;
}

export default function VillageCard({ village }: { village: VillageCardData }) {
    const rating = village.reviews_avg_rating || 0;
    const reviewCount = village.reviews_count || 0;

    const locationParts = village.address?.split(',') ?? [];
    const location =
        locationParts.length > 2
            ? locationParts.slice(-2).join(',').trim()
            : (village.address ?? '');

    return (
        <Link
            href={`/desa/${village.slug}`}
            className="village-card group block"
        >
            {/* Cover */}
            <div className="relative h-44 overflow-hidden bg-gray-100">
                {village.cover_image ? (
                    <img
                        src={`/storage/${village.cover_image}`}
                        alt={village.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                    />
                ) : (
                    <div
                        className="flex h-full w-full items-center justify-center"
                        style={{ background: 'var(--singgah-green-200)' }}
                    >
                        <Trees
                            className="h-12 w-12 opacity-30"
                            style={{ color: 'var(--singgah-green-700)' }}
                        />
                    </div>
                )}
                {village.is_featured && (
                    <span
                        className="absolute top-3 left-3 rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
                        style={{ background: 'var(--singgah-earth-400)' }}
                    >
                        ⭐ Pilihan
                    </span>
                )}
            </div>

            {/* Body */}
            <div className="p-4">
                <h3 className="line-clamp-1 font-semibold text-gray-900 transition-colors group-hover:text-[var(--singgah-green-700)]">
                    {village.name}
                </h3>
                {location && (
                    <div className="small-font-size mt-1.5 flex items-center gap-1 text-gray-500">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span className="line-clamp-1">{location}</span>
                    </div>
                )}
                {village.short_description && (
                    <p className="small-font-size mt-2 line-clamp-2 leading-relaxed text-gray-500">
                        {village.short_description}
                    </p>
                )}
                <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                    <div className="flex items-center gap-1">
                        <Star className="rating-star h-3.5 w-3.5 fill-current" />
                        <span className="small-font-size font-semibold text-gray-800">
                            {rating > 0 ? rating.toFixed(1) : '—'}
                        </span>
                        {reviewCount > 0 && (
                            <span className="small-font-size text-gray-400">
                                ({reviewCount})
                            </span>
                        )}
                    </div>
                    <span
                        className="small-font-size flex items-center gap-0.5 font-medium transition-colors group-hover:text-[var(--singgah-green-600)]"
                        style={{ color: 'var(--singgah-green-600)' }}
                    >
                        Lihat Detail <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                </div>
            </div>
        </Link>
    );
}

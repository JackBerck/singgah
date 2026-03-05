import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react';

interface MediaItem {
    id: number;
    file_path: string;
    type: 'image' | 'video';
    alt_text?: string;
}

interface MediaGalleryProps {
    media: MediaItem[];
    initialIndex?: number;
    onClose: () => void;
}

export interface MediaGalleryTriggerProps {
    media: MediaItem[];
    className?: string;
    maxVisible?: number;
}

// Lightbox overlay
export function MediaLightbox({
    media,
    initialIndex = 0,
    onClose,
}: MediaGalleryProps) {
    const [current, setCurrent] = useState(initialIndex);

    const prev = () => setCurrent((c) => (c - 1 + media.length) % media.length);
    const next = () => setCurrent((c) => (c + 1) % media.length);

    const handleKey = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
        },
        [current],
    );

    useEffect(() => {
        document.addEventListener('keydown', handleKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleKey);
            document.body.style.overflow = '';
        };
    }, [handleKey]);

    const item = media[current];
    const src = item.file_path.startsWith('http')
        ? item.file_path
        : `/storage/${item.file_path}`;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
            onClick={onClose}
        >
            {/* Close */}
            <button
                className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25"
                onClick={onClose}
                aria-label="Tutup"
            >
                <X className="h-5 w-5" />
            </button>

            {/* Counter */}
            <span className="absolute top-4 left-1/2 -translate-x-1/2 rounded-full bg-black/40 px-3 py-1 text-sm text-white">
                {current + 1} / {media.length}
            </span>

            {/* Prev */}
            {media.length > 1 && (
                <button
                    className="absolute left-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25"
                    onClick={(e) => {
                        e.stopPropagation();
                        prev();
                    }}
                    aria-label="Sebelumnya"
                >
                    <ChevronLeft className="h-7 w-7" />
                </button>
            )}

            {/* Media */}
            <div
                className="max-h-[85vh] max-w-[90vw]"
                onClick={(e) => e.stopPropagation()}
            >
                {item.type === 'video' ? (
                    <video
                        src={src}
                        controls
                        className="max-h-[85vh] rounded-xl"
                    />
                ) : (
                    <img
                        src={src}
                        alt={item.alt_text ?? ''}
                        className="max-h-[85vh] rounded-xl object-contain"
                    />
                )}
            </div>

            {/* Next */}
            {media.length > 1 && (
                <button
                    className="absolute right-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25"
                    onClick={(e) => {
                        e.stopPropagation();
                        next();
                    }}
                    aria-label="Selanjutnya"
                >
                    <ChevronRight className="h-7 w-7" />
                </button>
            )}

            {/* Thumbnail strip */}
            {media.length > 1 && (
                <div className="absolute bottom-4 flex gap-2 overflow-x-auto px-4">
                    {media.map((m, i) => {
                        const s = m.file_path.startsWith('http')
                            ? m.file_path
                            : `/storage/${m.file_path}`;
                        return (
                            <button
                                key={m.id}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrent(i);
                                }}
                                className={`h-12 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${i === current ? 'border-white' : 'border-transparent opacity-50 hover:opacity-80'}`}
                            >
                                {m.type === 'video' ? (
                                    <div className="flex h-full items-center justify-center bg-gray-800">
                                        <Play className="h-4 w-4 text-white" />
                                    </div>
                                ) : (
                                    <img
                                        src={s}
                                        alt=""
                                        className="h-full w-full object-cover"
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

// Thumbnail grid that opens lightbox
export default function MediaGallery({
    media,
    className = '',
    maxVisible = 5,
}: MediaGalleryTriggerProps) {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    if (!media.length) return null;

    const visible = media.slice(0, maxVisible);
    const extra = media.length - maxVisible;

    return (
        <>
            <div
                className={`grid gap-2 ${media.length === 1 ? 'grid-cols-1' : 'grid-cols-2 sm:grid-cols-3'} ${className}`}
            >
                {visible.map((m, i) => {
                    const src = m.file_path.startsWith('http')
                        ? m.file_path
                        : `/storage/${m.file_path}`;
                    const isLast = i === visible.length - 1 && extra > 0;

                    return (
                        <button
                            key={m.id}
                            className={`relative overflow-hidden rounded-xl bg-gray-100 ${i === 0 && media.length > 1 ? 'col-span-2 sm:col-span-1' : ''} aspect-[4/3]`}
                            onClick={() => setLightboxIndex(i)}
                            aria-label="Buka galeri"
                        >
                            {m.type === 'video' ? (
                                <div className="flex h-full w-full items-center justify-center bg-gray-800">
                                    <Play className="h-8 w-8 text-white" />
                                </div>
                            ) : (
                                <img
                                    src={src}
                                    alt={m.alt_text ?? ''}
                                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                                />
                            )}
                            {isLast && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                    <span className="text-xl font-bold text-white">
                                        +{extra}
                                    </span>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {lightboxIndex !== null && (
                <MediaLightbox
                    media={media}
                    initialIndex={lightboxIndex}
                    onClose={() => setLightboxIndex(null)}
                />
            )}
        </>
    );
}

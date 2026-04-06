import { useState } from 'react';
import { Bookmark } from 'lucide-react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';

interface BookmarkButtonProps {
    type: 'village' | 'event' | 'attraction' | 'culinary' | 'accommodation';
    id: number;
    initialWishlisted: boolean;
    isLoggedIn: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const typeLabel: Record<BookmarkButtonProps['type'], string> = {
    village: 'desa',
    event: 'event',
    attraction: 'wisata',
    culinary: 'kuliner',
    accommodation: 'akomodasi',
};

export default function BookmarkButton({
    type,
    id,
    initialWishlisted,
    isLoggedIn,
    size = 'md',
    className = '',
}: BookmarkButtonProps) {
    const [wishlisted, setWishlisted] = useState(initialWishlisted);
    const [loading, setLoading] = useState(false);

    const toggleBookmark = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isLoggedIn) {
            toast.error('Silakan login', {
                description: 'Anda harus login untuk menyimpan ke wishlist.',
                action: {
                    label: 'Login',
                    onClick: () => router.get('/login'),
                },
            });
            return;
        }

        if (loading) return;

        setLoading(true);
        // Optimistic update
        const previousState = wishlisted;
        setWishlisted(!previousState);

        try {
            // Using fetch explicitly for background request without Inertia navigation side-effects
            const response = await fetch('/wishlist/toggle', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN':
                        (
                            document.head.querySelector(
                                'meta[name="csrf-token"]',
                            ) as HTMLMetaElement
                        )?.content || '',
                },
                body: JSON.stringify({ type, id }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const isNowWishlisted = Boolean(data.wishlisted);
            setWishlisted(isNowWishlisted);

            if (isNowWishlisted) {
                toast.success('Ditambahkan ke wishlist', {
                    description: `Postingan ${typeLabel[type]} berhasil disimpan.`,
                });
            } else {
                toast.success('Dihapus dari wishlist', {
                    description: `Postingan ${typeLabel[type]} berhasil dihapus.`,
                });
            }
        } catch (error) {
            // Revert on error
            setWishlisted(previousState);
            toast.error('Terjadi kesalahan', {
                description: 'Gagal memperbarui wishlist.',
            });
        } finally {
            setLoading(false);
        }
    };

    const iconSizes = {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6',
    };

    return (
        <button
            onClick={toggleBookmark}
            disabled={loading}
            title={wishlisted ? 'Hapus dari Wishlist' : 'Simpan ke Wishlist'}
            className={`flex items-center justify-center rounded-full p-2.5 transition-all hover:bg-gray-100 ${
                wishlisted
                    ? 'text-singgah-green-600'
                    : 'text-gray-500 hover:text-gray-900'
            } ${loading ? 'cursor-not-allowed opacity-70' : ''} ${className}`}
            style={
                wishlisted
                    ? {
                          color: 'var(--singgah-green-600)',
                          background: 'var(--singgah-green-50)',
                      }
                    : {}
            }
            aria-label="Bookmark"
        >
            <Bookmark
                className={`${iconSizes[size]} transition-transform ${wishlisted ? 'scale-110 fill-current' : 'scale-100 hover:scale-110'}`}
            />
        </button>
    );
}

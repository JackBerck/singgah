import { Head, Link, router } from '@inertiajs/react';
import { toast } from 'sonner';
import {
    ArrowUpRight,
    Bookmark,
    CalendarDays,
    MapPin,
    SearchX,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
import ProfileLayout from '@/layouts/ProfileLayout';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
} from '@/components/alert-dialog';

interface WishlistItem {
    id: number;
    type: 'village' | 'event' | 'attraction' | 'culinary' | 'accommodation';
    entity_id: number;
    name: string;
    cover: string | null;
    url: string;
    location?: string | null;
    description?: string | null;
    created_at: string;
}

interface AuthUser {
    id: number;
    name: string;
    email: string;
    role: string;
    avatar: string | null;
}

interface Props {
    user: AuthUser;
    wishlists: WishlistItem[];
    wishlists_count: number;
    reviews_count: number;
}

const typeLabel: Record<string, string> = {
    village: '🏡 Desa',
    event: '📅 Event',
    attraction: '🗺️ Wisata',
    culinary: '🍜 Kuliner',
    accommodation: '🏠 Akomodasi',
};

const typeDescription: Record<string, string> = {
    village: 'Profil desa wisata dengan informasi lengkap destinasi.',
    event: 'Agenda dan aktivitas terbaru yang bisa Anda ikuti.',
    attraction: 'Objek wisata menarik untuk rencana kunjungan Anda.',
    culinary: 'Rekomendasi kuliner khas yang patut dicoba.',
    accommodation: 'Pilihan akomodasi untuk menginap lebih nyaman.',
};

const formatSavedDate = (value: string) =>
    new Date(value).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });

export default function Wishlist({
    user,
    wishlists,
    wishlists_count,
    reviews_count,
}: Props) {
    const [itemToDelete, setItemToDelete] = useState<{
        id: number;
        type: string;
        name: string;
    } | null>(null);
    const [removing, setRemoving] = useState(false);

    const handleRemove = async (type: string, id: number) => {
        setRemoving(true);

        try {
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
            toast.success('Dihapus dari wishlist', {
                description: `${itemToDelete?.name ?? 'Postingan'} berhasil dihapus dari daftar simpan.`,
            });
            setItemToDelete(null);
            router.reload({ only: ['wishlists', 'user', 'wishlists_count'] });
        } catch (error) {
            toast.error('Gagal menghapus wishlist', {
                description: 'Silakan coba lagi dalam beberapa saat.',
            });
        } finally {
            setRemoving(false);
        }
    };

    return (
        <ProfileLayout
            user={user}
            activeTab="wishlist"
            wishlistsCount={wishlists_count}
            reviewsCount={reviews_count}
        >
            <Head title="Wishlist — Singgah" />

            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="mb-5 flex items-center justify-between font-semibold text-gray-800">
                    <span>Wishlist Saya</span>
                    <span className="text-sm font-normal text-gray-500">
                        {wishlists.length} item
                    </span>
                </h2>

                {wishlists.length === 0 ? (
                    <div
                        className="rounded-2xl py-12 text-center"
                        style={{ background: 'var(--singgah-green-50)' }}
                    >
                        <Bookmark
                            className="mx-auto mb-3 h-10 w-10 opacity-30"
                            style={{ color: 'var(--singgah-green-600)' }}
                        />
                        <p className="text-sm text-gray-500">
                            Anda belum menyimpan apapun ke wishlist.
                        </p>
                        <Link
                            href="/explore"
                            className="btn-primary mt-4 inline-flex"
                        >
                            Jelajahi Sekarang
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                        {wishlists.map((item) => (
                            <div
                                key={item.id}
                                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-200 hover:shadow-lg"
                            >
                                <Link
                                    href={item.url}
                                    className="absolute inset-0 z-10"
                                >
                                    <span className="sr-only">
                                        Lihat {item.name}
                                    </span>
                                </Link>

                                <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                                    {item.cover ? (
                                        <img
                                            src={item.cover}
                                            alt={item.name}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center">
                                            <SearchX className="h-8 w-8 text-gray-300" />
                                        </div>
                                    )}
                                    <div className="absolute inset-x-0 bottom-0 z-15 h-16 bg-linear-to-t from-black/45 via-black/10 to-transparent" />
                                    <div className="absolute top-2 left-2 z-20">
                                        <span
                                            className="inline-block rounded-full px-2 py-1 text-[10px] font-semibold text-white shadow-sm backdrop-blur-md"
                                            style={{
                                                background: 'rgba(0,0,0,0.6)',
                                            }}
                                        >
                                            {typeLabel[item.type] ?? item.type}
                                        </span>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setItemToDelete({
                                                id: item.entity_id,
                                                type: item.type,
                                                name: item.name,
                                            });
                                        }}
                                        className="absolute top-2 right-2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-red-500 shadow-sm transition-transform hover:scale-110 hover:bg-white"
                                        title="Hapus dari wishlist"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>

                                <div className="flex flex-1 flex-col p-4 pt-3">
                                    <h3
                                        className="line-clamp-2 leading-tight font-bold text-gray-900 transition-colors group-hover:text-(--singgah-green-700)"
                                        style={{
                                            fontFamily: 'var(--font-jakarta)',
                                        }}
                                    >
                                        {item.name}
                                    </h3>
                                    {item.location && (
                                        <div className="mt-1.5 flex items-start gap-1 text-xs text-gray-500">
                                            <MapPin
                                                className="mt-0.5 h-3.5 w-3.5 shrink-0"
                                                style={{
                                                    color: 'var(--singgah-green-600)',
                                                }}
                                            />
                                            <span className="line-clamp-1 flex-1">
                                                {item.location}
                                            </span>
                                        </div>
                                    )}
                                    {item.description && (
                                        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-gray-600">
                                            {item.description}
                                        </p>
                                    )}

                                    {!item.description && (
                                        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-gray-600">
                                            {typeDescription[item.type] ??
                                                'Konten ini disimpan agar mudah ditemukan kembali nanti.'}
                                        </p>
                                    )}

                                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                                        <div className="inline-flex items-center gap-1 text-[11px] text-gray-500">
                                            <CalendarDays className="h-3.5 w-3.5" />
                                            Disimpan{' '}
                                            {formatSavedDate(item.created_at)}
                                        </div>
                                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-(--singgah-green-700)">
                                            Lihat detail
                                            <ArrowUpRight className="h-3.5 w-3.5" />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <AlertDialog
                open={!!itemToDelete}
                onOpenChange={(open) => !open && setItemToDelete(null)}
            >
                <AlertDialogContent size="default">
                    <AlertDialogHeader>
                        <AlertDialogMedia>
                            <Trash2 className="h-5 w-5 text-red-600" />
                        </AlertDialogMedia>
                        <AlertDialogTitle>Hapus dari Wishlist</AlertDialogTitle>
                        <AlertDialogDescription>
                            Item <strong>{itemToDelete?.name}</strong> akan
                            dihapus dari wishlist Anda. Tindakan ini bisa Anda
                            lakukan lagi nanti jika ingin menyimpan ulang.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={removing}>
                            Batal
                        </AlertDialogCancel>
                        <AlertDialogAction
                            variant="destructive"
                            disabled={removing}
                            onClick={(event) => {
                                event.preventDefault();

                                if (itemToDelete) {
                                    void handleRemove(
                                        itemToDelete.type,
                                        itemToDelete.id,
                                    );
                                }
                            }}
                        >
                            {removing ? 'Menghapus...' : 'Ya, hapus'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </ProfileLayout>
    );
}

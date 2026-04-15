import { useState } from 'react';
import * as React from 'react';
import { useForm } from '@inertiajs/react';
import { toast } from 'sonner';
import StarRating from '@/components/public/StarRating';
import { MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';

interface User {
    id: number;
    name: string;
    avatar: string | null;
}

interface Review {
    id: number;
    user_id?: number;
    rating: number;
    comment: string | null;
    user: User | null;
    created_at: string;
}

interface Props {
    review: Review;
    currentUserId?: number;
}

const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

export default function ReviewItem({ review, currentUserId }: Props) {
    const isOwner = currentUserId && review.user?.id === currentUserId;

    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);

    // Edit form
    const { data, setData, put, processing, reset, errors } = useForm({
        rating: review.rating,
        comment: review.comment || '',
    });

    // Delete form (just for delete request without body)
    const deleteForm = useForm();

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/reviews/${review.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsEditing(false);
                toast.success('Ulasan berhasil diperbarui.');
            },
            onError: (err) => {
                const msg = Object.values(err)[0] as string;
                toast.error(msg || 'Gagal memperbarui ulasan.');
            }
        });
    };

    const handleDelete = () => {
        deleteForm.delete(`/reviews/${review.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setShowDeleteAlert(false);
                toast.success('Ulasan berhasil dihapus.');
            },
            onError: (err) => {
                const msg = Object.values(err)[0] as string;
                toast.error(msg || 'Gagal menghapus ulasan.');
            }
        });
    };

    return (
        <div className="review-item rounded-2xl border border-gray-100 bg-white p-4">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div
                        className="flex h-9 w-9 items-center justify-center rounded-full font-semibold text-white"
                        style={{ background: 'var(--singgah-green-600)' }}
                    >
                        {review.user?.name?.[0]?.toUpperCase() ?? '?'}
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-800">
                            {review.user?.name ?? 'Anonim'}
                        </p>
                        {!isEditing && <StarRating value={review.rating} size="sm" />}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">
                        {fmtDate(review.created_at)}
                    </span>
                    
                    {isOwner && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-50 focus:outline-none">
                                    <MoreVertical className="h-4 w-4" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-36">
                                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <Edit2 className="h-4 w-4" />
                                        <span>Edit</span>
                                    </div>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setShowDeleteAlert(true)}>
                                    <div className="flex items-center gap-2 text-red-600">
                                        <Trash2 className="h-4 w-4" />
                                        <span>Hapus</span>
                                    </div>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>

            {isEditing ? (
                <form onSubmit={handleEditSubmit} className="mt-4 space-y-3">
                    <div>
                        <label className="text-xs font-medium text-gray-700 mb-1 block">Rating</label>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setData('rating', star)}
                                    className={`focus:outline-none ${data.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                                >
                                    ⭐
                                </button>
                            ))}
                        </div>
                        {errors.rating && <p className="mt-1 text-xs text-red-600">{errors.rating}</p>}
                    </div>
                    <div>
                        <textarea
                            value={data.comment}
                            onChange={(e) => setData('comment', e.target.value)}
                            rows={3}
                            placeholder="Tulis ulasan Anda..."
                            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-singgah-green-500 focus:ring-1 focus:ring-singgah-green-500"
                        />
                        {errors.comment && <p className="mt-1 text-xs text-red-600">{errors.comment}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                setIsEditing(false);
                                reset();
                            }}
                            className="rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg px-3 py-1.5 text-xs font-semibold text-white bg-singgah-green-600 hover:bg-singgah-green-700 disabled:opacity-50"
                        >
                            Simpan Perubahan
                        </button>
                    </div>
                </form>
            ) : (
                review.comment && (
                    <p className="mt-3 text-sm leading-relaxed text-gray-600">
                        {review.comment}
                    </p>
                )
            )}

            <Dialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hapus Ulasan?</DialogTitle>
                        <DialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Ulasan Anda akan dihapus secara permanen.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200">
                                Batal
                            </button>
                        </DialogClose>
                        <button
                            onClick={handleDelete}
                            disabled={deleteForm.processing}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            {deleteForm.processing ? 'Menghapus...' : 'Ya, Hapus'}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

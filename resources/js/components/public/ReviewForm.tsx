import { router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { MessageSquare, Loader2 } from 'lucide-react';
import StarRating from './StarRating';
import ReviewItem from './ReviewItem';
import { Link, usePage } from '@inertiajs/react';

interface ReviewFormProps {
    reviewableType: 'village' | 'attraction' | 'culinary' | 'accommodation' | 'village_event';
    reviewableId: number;
    isLoggedIn: boolean;
    existingReview?: {
        id: number;
        rating: number;
        comment: string | null;
    } | null;
    onSuccess?: () => void;
}

export default function ReviewForm({
    reviewableType,
    reviewableId,
    isLoggedIn,
    existingReview,
    onSuccess,
}: ReviewFormProps) {
    const { auth } = usePage<{ auth: { user: { id: number; name: string; avatar: string | null } | null } }>().props;
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isLoggedIn) {
        return (
            <div className="rounded-2xl border border-dashed border-gray-200 p-6 text-center">
                <MessageSquare className="mx-auto mb-3 h-8 w-8 text-gray-300" />
                <p className="mb-3 text-sm text-gray-500">
                    Masuk untuk memberikan ulasan
                </p>
                <Link href="/login" className="btn-primary text-sm">
                    Masuk
                </Link>
            </div>
        );
    }

    if (existingReview) {
        return (
            <div className="mb-6">
                <p
                    className="mb-2 text-sm font-semibold"
                    style={{ color: 'var(--singgah-green-700)' }}
                >
                    ✓ Ulasan Anda
                </p>
                <div style={{ border: '1px solid var(--singgah-green-200)', borderRadius: '1rem', overflow: 'hidden' }}>
                    <ReviewItem
                        review={{
                            id: existingReview.id,
                            user_id: auth.user?.id,
                            rating: existingReview.rating,
                            comment: existingReview.comment,
                            user: auth.user,
                            created_at: new Date().toISOString(),
                        }}
                        currentUserId={auth.user?.id}
                    />
                </div>
            </div>
        );
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error('Pilih rating terlebih dahulu.');
            return;
        }
        setLoading(true);
        router.post(
            '/reviews',
            {
                reviewable_type: reviewableType,
                reviewable_id: reviewableId,
                rating,
                comment: comment || null,
            },
            {
                onSuccess: () => {
                    toast.success('Ulasan berhasil disimpan!');
                    setRating(0);
                    setComment('');
                    onSuccess?.();
                },
                onError: (errors) => {
                    const msg = Object.values(errors)[0] as string;
                    toast.error(msg || 'Gagal menyimpan ulasan.');
                },
                onFinish: () => setLoading(false),
            },
        );
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Rating Anda
                </label>
                <StarRating value={rating} onChange={setRating} size="lg" />
            </div>
            <div>
                <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                    Komentar{' '}
                    <span className="font-normal text-gray-400">
                        (opsional)
                    </span>
                </label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Ceritakan pengalaman Anda..."
                    rows={3}
                    maxLength={1000}
                    className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm transition-colors outline-none focus:border-(--singgah-green-400) focus:ring-2 focus:ring-(--singgah-green-100)"
                />
                <p className="mt-1 text-right text-xs text-gray-400">
                    {comment.length}/1000
                </p>
            </div>
            <button
                type="submit"
                disabled={loading || rating === 0}
                className="btn-primary w-full justify-center"
            >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Kirim Ulasan
            </button>
        </form>
    );
}

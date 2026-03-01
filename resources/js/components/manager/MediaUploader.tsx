import axios from 'axios';
import { ImagePlus, Loader2, Trash2, Upload, Video } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface MediaItem {
    id: number;
    file_path: string;
    type: 'image' | 'video';
    alt_text?: string;
}

interface MediaUploaderProps {
    existing?: MediaItem[];
    uploadRoute: string;
    deleteRoute: (id: number) => string;
    accept?: string;
    maxSizeMB?: number;
    allowVideo?: boolean;
    maxFiles?: number;
    label?: string;
    onMediaChange?: (mediaIds: number[]) => void;
}

function isImagePath(path: string) {
    return /\.(jpe?g|png|webp|gif)$/i.test(path) || path.startsWith('image/');
}

function MediaPreview({
    item,
    onDelete,
    deleteRoute,
}: {
    item: MediaItem;
    onDelete: () => void;
    deleteRoute: string;
}) {
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const pathname = window.location.pathname;
    const src = pathname.includes("edit") ? `/storage/${item.file_path}` : `${item.file_path}`;

    const handleConfirmDelete = async () => {
        setDeleting(true);
        try {
            await axios.delete(deleteRoute);
            onDelete();
        } catch {
            // silently fail — toast is handled by backend flash
        } finally {
            setDeleting(false);
            setConfirmOpen(false);
        }
    };

    return (
        <>
            <div className="group relative aspect-square overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                {item.type === 'video' ? (
                    <video
                        src={src}
                        className="h-full w-full object-cover"
                        muted
                    />
                ) : (
                    <img
                        src={src}
                        alt={item.alt_text ?? ''}
                        className="h-full w-full object-cover"
                    />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                        type="button"
                        onClick={() => setConfirmOpen(true)}
                        disabled={deleting}
                        className="rounded-lg bg-red-500 p-2 text-white transition-transform hover:scale-110 disabled:opacity-60"
                    >
                        {deleting ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Trash2 className="h-4 w-4" />
                        )}
                    </button>
                </div>
            </div>

            {/* Delete Confirm Dialog */}
            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <DialogContent className="max-w-sm rounded-2xl">
                    <DialogHeader>
                        <DialogTitle>Hapus Foto?</DialogTitle>
                        <DialogDescription>
                            Foto ini akan dihapus secara permanen dan tidak
                            dapat dikembalikan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex gap-2 sm:justify-end">
                        <button
                            type="button"
                            onClick={() => setConfirmOpen(false)}
                            className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirmDelete}
                            disabled={deleting}
                            className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-600 disabled:opacity-60"
                        >
                            {deleting ? 'Menghapus...' : 'Ya, Hapus'}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default function MediaUploader({
    existing = [],
    uploadRoute,
    deleteRoute,
    accept,
    maxSizeMB = 5,
    allowVideo = false,
    maxFiles = 10,
    label = 'Foto / Galeri',
    onMediaChange,
}: MediaUploaderProps) {
    const [items, setItems] = useState<MediaItem[]>(existing);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Notify parent when items change
    useEffect(() => {
        if (onMediaChange) {
            onMediaChange(items.map((item) => item.id));
        }
    }, [items, onMediaChange]);

    const acceptStr =
        accept ??
        (allowVideo
            ? 'image/*,video/mp4,video/webm'
            : 'image/jpeg,image/png,image/webp,image/gif');

    const uploadFile = useCallback(
        async (file: File) => {
            const maxBytes =
                (file.type.startsWith('video/') ? 50 : maxSizeMB) * 1024 * 1024;
            if (file.size > maxBytes) {
                setError(
                    `File "${file.name}" terlalu besar (maks ${file.type.startsWith('video/') ? 50 : maxSizeMB}MB)`,
                );
                return;
            }

            const formData = new FormData();
            formData.append('file', file);

            setUploading(true);
            setError(null);

            try {
                // axios automatically reads the XSRF-TOKEN cookie and sends X-XSRF-TOKEN header
                const { data } = await axios.post<{ id: number; url: string }>(
                    uploadRoute,
                    formData,
                    { headers: { 'Content-Type': 'multipart/form-data' } },
                );

                setItems((prev) => [
                    ...prev,
                    {
                        id: data.id,
                        file_path: data.url,
                        type: isImagePath(file.name) ? 'image' : 'video',
                        alt_text: file.name,
                    },
                ]);
            } catch (err: any) {
                const msg =
                    err?.response?.data?.message ??
                    'Gagal mengunggah file. Periksa koneksi internet Anda.';
                setError(msg);
            } finally {
                setUploading(false);
            }
        },
        [uploadRoute, maxSizeMB],
    );

    const handleFiles = (files: FileList | null) => {
        if (!files) return;
        const remaining = maxFiles - items.length;
        if (remaining <= 0) {
            setError(`Maksimal ${maxFiles} file.`);
            return;
        }
        Array.from(files).slice(0, remaining).forEach(uploadFile);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        handleFiles(e.dataTransfer.files);
    };

    const handleRemove = (id: number) => {
        setItems((prev) => prev.filter((i) => i.id !== id));
    };

    return (
        <div>
            <p className="mb-2 text-sm font-semibold text-gray-700">{label}</p>

            {/* Preview Grid */}
            {items.length > 0 && (
                <div className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                    {items.map((item) => (
                        <MediaPreview
                            key={item.id}
                            item={item}
                            deleteRoute={deleteRoute(item.id)}
                            onDelete={() => handleRemove(item.id)}
                        />
                    ))}
                </div>
            )}

            {/* Drop Zone */}
            {items.length < maxFiles && (
                <div
                    onDragOver={(e) => {
                        e.preventDefault();
                        setDragOver(true);
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => inputRef.current?.click()}
                    className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-all ${
                        dragOver
                            ? 'border-(--singgah-green-500) bg-(--singgah-green-50)'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                >
                    {uploading ? (
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    ) : (
                        <>
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                                {allowVideo ? (
                                    <Video className="h-5 w-5 text-gray-400" />
                                ) : (
                                    <ImagePlus className="h-5 w-5 text-gray-400" />
                                )}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-700">
                                    <span className="text-(--singgah-green-600)">
                                        Klik untuk upload
                                    </span>{' '}
                                    atau drag &amp; drop
                                </p>
                                <p className="mt-0.5 text-xs text-gray-400">
                                    {allowVideo
                                        ? `Gambar (max ${maxSizeMB}MB) atau Video (max 50MB)`
                                        : `JPG, PNG, WebP, GIF — max ${maxSizeMB}MB`}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {items.length}/{maxFiles} file
                                </p>
                            </div>
                        </>
                    )}
                </div>
            )}

            <input
                ref={inputRef}
                type="file"
                accept={acceptStr}
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
            />

            {error && (
                <p className="mt-2 flex items-center gap-1.5 text-xs text-red-500">
                    <Upload className="h-3.5 w-3.5 shrink-0" />
                    {error}
                </p>
            )}
        </div>
    );
}

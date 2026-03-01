import { ImagePlus, Loader2, Trash2, Video, X } from 'lucide-react';
import { useRef, useState } from 'react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface ExistingMedia {
    id: number;
    file_path: string;
    type: 'image' | 'video';
    alt_text?: string;
}

interface NewMediaFile {
    file: File;
    preview: string;
    tempId: string;
}

interface MediaInputProps {
    existingMedia?: ExistingMedia[];
    onChange?: (files: File[], existingIds: number[]) => void;
    accept?: string;
    maxSizeMB?: number;
    allowVideo?: boolean;
    maxFiles?: number;
    label?: string;
    error?: string;
}

function MediaPreview({
    media,
    onDelete,
    deleting,
}: {
    media: ExistingMedia;
    onDelete: () => void;
    deleting: boolean;
}) {
    const [confirmOpen, setConfirmOpen] = useState(false);

    // Handle both relative and absolute paths
    const getMediaUrl = (path: string) => {
        if (path.startsWith('http://') || path.startsWith('https://')) {
            return path;
        }
        if (path.startsWith('/storage/')) {
            return path;
        }
        return `/storage/${path}`;
    };

    const src = getMediaUrl(media.file_path);

    return (
        <>
            <div className="group relative aspect-square overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                {media.type === 'video' ? (
                    <video
                        src={src}
                        className="h-full w-full object-cover"
                        muted
                    />
                ) : (
                    <img
                        src={src}
                        alt={media.alt_text ?? ''}
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

            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <DialogContent className="max-w-sm rounded-2xl">
                    <DialogHeader>
                        <DialogTitle>Hapus Media?</DialogTitle>
                        <DialogDescription>
                            Media ini akan dihapus dan tidak dapat dikembalikan.
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
                            onClick={() => {
                                setConfirmOpen(false);
                                onDelete();
                            }}
                            disabled={deleting}
                            className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-600 disabled:opacity-60"
                        >
                            Ya, Hapus
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

function NewFilePreview({
    newFile,
    onRemove,
}: {
    newFile: NewMediaFile;
    onRemove: () => void;
}) {
    return (
        <div className="group relative aspect-square overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
            {newFile.file.type.startsWith('video/') ? (
                <video
                    src={newFile.preview}
                    className="h-full w-full object-cover"
                    muted
                />
            ) : (
                <img
                    src={newFile.preview}
                    alt={newFile.file.name}
                    className="h-full w-full object-cover"
                />
            )}
            <div className="absolute top-1 right-1">
                <button
                    type="button"
                    onClick={onRemove}
                    className="rounded-lg bg-red-500 p-1.5 text-white shadow-lg transition-transform hover:scale-110"
                >
                    <X className="h-3.5 w-3.5" />
                </button>
            </div>
        </div>
    );
}

export default function MediaInput({
    existingMedia = [],
    onChange,
    accept,
    maxSizeMB = 5,
    allowVideo = false,
    maxFiles = 10,
    label = 'Foto / Galeri',
    error: externalError,
}: MediaInputProps) {
    const [existing, setExisting] = useState<ExistingMedia[]>(existingMedia);
    const [newFiles, setNewFiles] = useState<NewMediaFile[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const acceptStr =
        accept ??
        (allowVideo
            ? 'image/*,video/mp4,video/webm'
            : 'image/jpeg,image/png,image/webp,image/gif');

    const totalFiles = existing.length + newFiles.length;

    const handleFiles = (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const remaining = maxFiles - totalFiles;
        if (remaining <= 0) {
            setError(`Maksimal ${maxFiles} file.`);
            return;
        }

        setError(null);
        const filesToAdd: NewMediaFile[] = [];

        Array.from(files)
            .slice(0, remaining)
            .forEach((file) => {
                const maxBytes =
                    (file.type.startsWith('video/') ? 50 : maxSizeMB) *
                    1024 *
                    1024;
                if (file.size > maxBytes) {
                    setError(
                        `File "${file.name}" terlalu besar (maks ${file.type.startsWith('video/') ? 50 : maxSizeMB}MB)`,
                    );
                    return;
                }

                const preview = URL.createObjectURL(file);
                filesToAdd.push({
                    file,
                    preview,
                    tempId: `${Date.now()}-${Math.random()}`,
                });
            });

        if (filesToAdd.length > 0) {
            const updated = [...newFiles, ...filesToAdd];
            setNewFiles(updated);

            // Notify parent
            if (onChange) {
                onChange(
                    updated.map((nf) => nf.file),
                    existing.map((e) => e.id),
                );
            }
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        handleFiles(e.dataTransfer.files);
    };

    const removeNewFile = (tempId: string) => {
        const updated = newFiles.filter((nf) => nf.tempId !== tempId);
        setNewFiles(updated);

        if (onChange) {
            onChange(
                updated.map((nf) => nf.file),
                existing.map((e) => e.id),
            );
        }

        // Revoke object URL to prevent memory leak
        const removed = newFiles.find((nf) => nf.tempId === tempId);
        if (removed) {
            URL.revokeObjectURL(removed.preview);
        }
    };

    const deleteExisting = (id: number) => {
        const updated = existing.filter((e) => e.id !== id);
        setExisting(updated);

        if (onChange) {
            onChange(
                newFiles.map((nf) => nf.file),
                updated.map((e) => e.id),
            );
        }
    };

    return (
        <div>
            <p className="mb-2 text-sm font-semibold text-gray-700">{label}</p>

            {/* Preview Grid */}
            {totalFiles > 0 && (
                <div className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                    {existing.map((media) => (
                        <MediaPreview
                            key={media.id}
                            media={media}
                            onDelete={() => deleteExisting(media.id)}
                            deleting={false}
                        />
                    ))}
                    {newFiles.map((newFile) => (
                        <NewFilePreview
                            key={newFile.tempId}
                            newFile={newFile}
                            onRemove={() => removeNewFile(newFile.tempId)}
                        />
                    ))}
                </div>
            )}

            {/* Drop Zone */}
            {totalFiles < maxFiles && (
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
                                Klik untuk pilih
                            </span>{' '}
                            atau drag &amp; drop
                        </p>
                        <p className="mt-0.5 text-xs text-gray-400">
                            {allowVideo
                                ? `Gambar (max ${maxSizeMB}MB) atau Video (max 50MB)`
                                : `JPG, PNG, WebP, GIF — max ${maxSizeMB}MB`}
                        </p>
                        <p className="text-xs text-gray-400">
                            {totalFiles}/{maxFiles} file
                        </p>
                    </div>
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

            {error && <p className="mt-2 text-xs text-red-500">⚠️ {error}</p>}
            {externalError && (
                <p className="mt-2 text-xs text-red-500">⚠️ {externalError}</p>
            )}
        </div>
    );
}

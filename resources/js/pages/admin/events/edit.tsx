import { router } from '@inertiajs/react';
import { Save } from 'lucide-react';
import { useState } from 'react';

import AdminLayout from '@/layouts/AdminLayout';
import PageHeader from '@/components/manager/PageHeader';
import RichEditor from '@/components/manager/RichEditor';
import DatePicker from '@/components/manager/DatePicker';
import MediaInput from '@/components/manager/MediaInput';

interface Village {
    id: number;
    name: string;
}
interface Media {
    id: number;
    file_path: string;
    type: 'image' | 'video';
    alt_text?: string;
}
interface Event {
    id: number;
    name: string;
    description: string;
    event_date: string;
    end_date: string | null;
    location: string | null;
    contact_info: string | null;
    is_featured: boolean;
    media: Media[];
}
interface Props {
    event: Event;
    village?: Village;
}

function Field({
    label,
    error,
    required,
    children,
}: {
    label: string;
    error?: string;
    required?: boolean;
    children: React.ReactNode;
}) {
    return (
        <div>
            <label className="mb-1.5 block text-sm font-semibold text-gray-700">
                {label}
                {required && <span className="ml-1 text-red-500">*</span>}
            </label>
            {children}
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}
function Input(
    props: React.InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean },
) {
    const { hasError, className, ...rest } = props;
    return (
        <input
            {...rest}
            className={`w-full rounded-xl border px-4 py-2.5 text-sm transition-colors outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 ${hasError ? 'border-red-400' : 'border-gray-200'} ${className ?? ''}`}
        />
    );
}

// Convert full ISO timestamp (2025-06-15T12:00:00.000000Z) → yyyy-MM-dd'T'HH:mm for DatePicker
const toISO = (s: string | null): string => {
    if (!s) return '';
    try {
        return new Date(s).toISOString().slice(0, 16);
    } catch {
        return '';
    }
};

export default function AdminEditEvent({ event, village }: Props) {
    const [files, setFiles] = useState<File[]>([]);
    const [existingMediaIds, setExistingMediaIds] = useState<number[]>(
        event.media.map((m) => m.id),
    );
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState({
        name: event.name,
        description: event.description,
        event_date: toISO(event.event_date),
        end_date: toISO(event.end_date),
        location: event.location ?? '',
        contact_info: event.contact_info ?? '',
        is_featured: event.is_featured,
    });

    const set = (key: keyof typeof formData, value: string | boolean) =>
        setFormData((prev) => ({ ...prev, [key]: value }));

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const fd = new FormData();
        fd.append('_method', 'PUT');
        fd.append('name', formData.name);
        fd.append('description', formData.description);
        fd.append('event_date', formData.event_date);
        fd.append('end_date', formData.end_date);
        fd.append('location', formData.location);
        fd.append('contact_info', formData.contact_info);
        fd.append('is_featured', formData.is_featured ? '1' : '0');
        existingMediaIds.forEach((id) =>
            fd.append('existing_media_ids[]', String(id)),
        );
        files.forEach((file) => fd.append('files[]', file));

        setProcessing(true);
        router.post(`/admin/events/${event.id}`, fd, {
            forceFormData: true,
            onError: (e) => setErrors(e),
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <AdminLayout title="Edit Acara">
            <PageHeader
                title="Edit Acara"
                breadcrumbs={[
                    { label: 'Dashboard', href: '/admin' },
                    { label: 'Acara', href: '/admin/events' },
                    { label: 'Edit' },
                ]}
            />

            <form onSubmit={submit}>
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                    <div className="space-y-5 lg:col-span-2">
                        <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                            <Field
                                label="Nama Acara"
                                required
                                error={errors.name}
                            >
                                <Input
                                    value={formData.name}
                                    onChange={(e) =>
                                        set('name', e.target.value)
                                    }
                                    hasError={!!errors.name}
                                />
                            </Field>
                            <Field
                                label="Deskripsi"
                                required
                                error={errors.description}
                            >
                                <RichEditor
                                    content={formData.description}
                                    onChange={(html) =>
                                        set('description', html)
                                    }
                                    error={errors.description}
                                />
                            </Field>
                            <div className="grid grid-cols-2 gap-4">
                                <Field
                                    label="Tanggal Mulai"
                                    required
                                    error={errors.event_date}
                                >
                                    <DatePicker
                                        value={formData.event_date}
                                        onChange={(v) => set('event_date', v)}
                                        withTime
                                        placeholder="Pilih tanggal mulai"
                                        error={errors.event_date}
                                    />
                                </Field>
                                <Field
                                    label="Tanggal Selesai"
                                    error={errors.end_date}
                                >
                                    <DatePicker
                                        value={formData.end_date}
                                        onChange={(v) => set('end_date', v)}
                                        withTime
                                        placeholder="Pilih tanggal selesai"
                                        error={errors.end_date}
                                    />
                                </Field>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Lokasi" error={errors.location}>
                                    <Input
                                        value={formData.location}
                                        onChange={(e) =>
                                            set('location', e.target.value)
                                        }
                                        hasError={!!errors.location}
                                    />
                                </Field>
                                <Field
                                    label="Info Kontak"
                                    error={errors.contact_info}
                                >
                                    <Input
                                        value={formData.contact_info}
                                        onChange={(e) =>
                                            set('contact_info', e.target.value)
                                        }
                                        hasError={!!errors.contact_info}
                                    />
                                </Field>
                            </div>
                        </div>

                        {/* Media */}
                        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                            <MediaInput
                                label="Foto/Video Acara"
                                maxFiles={10}
                                allowVideo
                                existingMedia={event.media}
                                onChange={(f, ids) => {
                                    setFiles(f);
                                    setExistingMediaIds(ids);
                                }}
                                error={errors['files.0']}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                            <p className="text-sm font-bold tracking-wide text-gray-500 uppercase">
                                Pengaturan
                            </p>
                            {village && (
                                <div>
                                    <p className="text-xs tracking-wide text-gray-400 uppercase">
                                        Desa
                                    </p>
                                    <p className="text-sm font-medium text-gray-700">
                                        {village.name}
                                    </p>
                                </div>
                            )}
                            <label className="flex cursor-pointer items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={formData.is_featured}
                                    onChange={(e) =>
                                        set('is_featured', e.target.checked)
                                    }
                                    className="h-4 w-4 rounded accent-red-600"
                                />
                                <span className="text-sm font-medium text-gray-700">
                                    Acara Unggulan
                                </span>
                            </label>
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                            >
                                <Save className="h-4 w-4" />
                                {processing
                                    ? 'Menyimpan...'
                                    : 'Simpan Perubahan'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}

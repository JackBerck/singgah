import { router } from '@inertiajs/react';
import { Save } from 'lucide-react';
import { useState } from 'react';

import AdminLayout from '@/layouts/AdminLayout';
import PageHeader from '@/components/manager/PageHeader';
import RichEditor from '@/components/manager/RichEditor';
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
interface Attraction {
    id: number;
    name: string;
    description: string;
    location: string | null;
    contact_info: string | null;
    open_time: string | null;
    close_time: string | null;
    map_url: string | null;
    price_min: number | null;
    price_max: number | null;
    village: Village;
    media: Media[];
}
interface Props {
    attraction: Attraction;
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

export default function AdminEditAttraction({ attraction }: Props) {
    const [files, setFiles] = useState<File[]>([]);
    const [existingMediaIds, setExistingMediaIds] = useState<number[]>(
        attraction.media.map((m) => m.id),
    );
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState({
        name: attraction.name,
        description: attraction.description,
        location: attraction.location ?? '',
        contact_info: attraction.contact_info ?? '',
        open_time: attraction.open_time ?? '',
        close_time: attraction.close_time ?? '',
        map_url: attraction.map_url ?? '',
        price_min: String(attraction.price_min ?? ''),
        price_max: String(attraction.price_max ?? ''),
    });

    const set = (key: keyof typeof formData, value: string) =>
        setFormData((prev) => ({ ...prev, [key]: value }));

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const fd = new FormData();
        fd.append('_method', 'PUT');
        Object.entries(formData).forEach(([k, v]) => fd.append(k, v));
        existingMediaIds.forEach((id) =>
            fd.append('existing_media_ids[]', String(id)),
        );
        files.forEach((file) => fd.append('files[]', file));

        setProcessing(true);
        router.post(`/admin/attractions/${attraction.id}`, fd, {
            forceFormData: true,
            onError: (e) => setErrors(e),
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <AdminLayout title="Edit Wisata">
            <PageHeader
                title="Edit Wisata"
                breadcrumbs={[
                    { label: 'Dashboard', href: '/admin' },
                    { label: 'Wisata Alam', href: '/admin/attractions' },
                    { label: 'Edit' },
                ]}
            />

            <form onSubmit={submit}>
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                    <div className="space-y-5 lg:col-span-2">
                        <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                            <Field
                                label="Nama Wisata"
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
                            <Field label="Deskripsi" error={errors.description}>
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
                                    label="Harga Minimum (Rp)"
                                    error={errors.price_min}
                                >
                                    <Input
                                        type="number"
                                        min="0"
                                        value={formData.price_min}
                                        onChange={(e) =>
                                            set('price_min', e.target.value)
                                        }
                                        hasError={!!errors.price_min}
                                        placeholder="0"
                                    />
                                </Field>
                                <Field
                                    label="Harga Maksimum (Rp)"
                                    error={errors.price_max}
                                >
                                    <Input
                                        type="number"
                                        min="0"
                                        value={formData.price_max}
                                        onChange={(e) =>
                                            set('price_max', e.target.value)
                                        }
                                        hasError={!!errors.price_max}
                                        placeholder="100000"
                                    />
                                </Field>
                            </div>
                            <Field label="Lokasi" error={errors.location}>
                                <Input
                                    value={formData.location}
                                    onChange={(e) =>
                                        set('location', e.target.value)
                                    }
                                    hasError={!!errors.location}
                                />
                            </Field>
                            <div className="grid grid-cols-2 gap-4">
                                <Field
                                    label="Jam Buka"
                                    error={errors.open_time}
                                >
                                    <Input
                                        type="time"
                                        value={formData.open_time}
                                        onChange={(e) =>
                                            set(
                                                'open_time',
                                                e.target.value,
                                            )
                                        }
                                        hasError={!!errors.open_time}
                                    />
                                </Field>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Field
                                    label="Jam Tutup"
                                    error={errors.close_time}
                                >
                                    <Input
                                        type="time"
                                        value={formData.close_time}
                                        onChange={(e) =>
                                            set(
                                                'close_time',
                                                e.target.value,
                                            )
                                        }
                                        hasError={!!errors.close_time}
                                    />
                                </Field>
                                <Field
                                    label="Info Kontak (Nomor HP)"
                                    error={errors.contact_info}
                                >
                                    <Input
                                        type="tel"
                                        value={formData.contact_info}
                                        onChange={(e) =>
                                            set('contact_info', e.target.value.replace(/\D/g, ''))
                                        }
                                        hasError={!!errors.contact_info}
                                    />
                                </Field>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                <Field
                                    label="Tautan Peta (Google Maps)"
                                    error={errors.map_url}
                                >
                                    <Input
                                        type="url"
                                        value={formData.map_url}
                                        onChange={(e) =>
                                            set('map_url', e.target.value)
                                        }
                                        hasError={!!errors.map_url}
                                    />
                                </Field>
                            </div>
                        </div>

                        {/* Media */}
                        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                            <MediaInput
                                label="Foto/Video Wisata"
                                maxFiles={10}
                                allowVideo
                                existingMedia={attraction.media}
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
                            <p className="text-xs font-bold tracking-wide text-gray-500 uppercase">
                                Informasi
                            </p>
                            <div>
                                <p className="text-xs tracking-wide text-gray-400 uppercase">
                                    Desa
                                </p>
                                <p className="text-sm font-medium text-gray-700">
                                    {attraction.village.name}
                                </p>
                            </div>
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

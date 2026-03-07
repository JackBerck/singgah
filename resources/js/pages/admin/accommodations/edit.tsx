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
interface Accommodation {
    id: number;
    name: string;
    description: string;
    location: string | null;
    contact_info: string | null;
    operating_hours: string | null;
    price_min: number | null;
    price_max: number | null;
    village: Village;
    media: Media[];
}
interface Props {
    accommodation: Accommodation;
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

export default function AdminEditAccommodation({ accommodation }: Props) {
    const [files, setFiles] = useState<File[]>([]);
    const [existingMediaIds, setExistingMediaIds] = useState<number[]>(
        accommodation.media.map((m) => m.id),
    );
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState({
        name: accommodation.name,
        description: accommodation.description,
        location: accommodation.location ?? '',
        contact_info: accommodation.contact_info ?? '',
        operating_hours: accommodation.operating_hours ?? '',
        price_min: String(accommodation.price_min ?? ''),
        price_max: String(accommodation.price_max ?? ''),
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
        router.post(`/admin/accommodations/${accommodation.id}`, fd, {
            forceFormData: true,
            onError: (e) => setErrors(e),
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <AdminLayout title="Edit Akomodasi">
            <PageHeader
                title="Edit Akomodasi"
                breadcrumbs={[
                    { label: 'Dashboard', href: '/admin' },
                    { label: 'Akomodasi', href: '/admin/accommodations' },
                    { label: 'Edit' },
                ]}
            />

            <form onSubmit={submit}>
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                    <div className="space-y-5 lg:col-span-2">
                        <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                            <Field
                                label="Nama Akomodasi"
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
                                        placeholder="500000"
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
                                    label="Jam Check-in/Check-out"
                                    error={errors.operating_hours}
                                >
                                    <Input
                                        value={formData.operating_hours}
                                        onChange={(e) =>
                                            set(
                                                'operating_hours',
                                                e.target.value,
                                            )
                                        }
                                        hasError={!!errors.operating_hours}
                                        placeholder="14.00 / 12.00"
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
                                label="Foto/Video Akomodasi"
                                maxFiles={10}
                                allowVideo
                                existingMedia={accommodation.media}
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
                                    {accommodation.village.name}
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

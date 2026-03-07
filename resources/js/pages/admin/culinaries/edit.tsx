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
interface Culinary {
    id: number;
    name: string;
    description: string;
    location: string | null;
    contact_info: string | null;
    price_min: number | null;
    price_max: number | null;
    village: Village;
    media: Media[];
}
interface Props {
    culinary: Culinary;
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

export default function AdminEditCulinary({ culinary }: Props) {
    const [files, setFiles] = useState<File[]>([]);
    const [existingMediaIds, setExistingMediaIds] = useState<number[]>(
        culinary.media.map((m) => m.id),
    );
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState({
        name: culinary.name,
        description: culinary.description,
        location: culinary.location ?? '',
        contact_info: culinary.contact_info ?? '',
        price_min: String(culinary.price_min ?? ''),
        price_max: String(culinary.price_max ?? ''),
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
        router.post(`/admin/culinaries/${culinary.id}`, fd, {
            forceFormData: true,
            onError: (e) => setErrors(e),
            onFinish: () => setProcessing(false),
        });
    };

    return (
        <AdminLayout title="Edit Kuliner">
            <PageHeader
                title="Edit Kuliner"
                breadcrumbs={[
                    { label: 'Dashboard', href: '/admin' },
                    { label: 'Kuliner', href: '/admin/culinaries' },
                    { label: 'Edit' },
                ]}
            />

            <form onSubmit={submit}>
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                    <div className="space-y-5 lg:col-span-2">
                        <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                            <Field
                                label="Nama Kuliner"
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
                                label="Foto/Video Kuliner"
                                maxFiles={10}
                                allowVideo
                                existingMedia={culinary.media}
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
                                    {culinary.village.name}
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

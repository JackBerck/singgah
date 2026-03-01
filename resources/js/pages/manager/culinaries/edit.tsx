import { useForm, router } from '@inertiajs/react';
import { Save } from 'lucide-react';
import { useState } from 'react';

import ManagerLayout from '@/layouts/ManagerLayout';
import PageHeader from '@/components/manager/PageHeader';
import RichEditor from '@/components/manager/RichEditor';
import MediaInput from '@/components/manager/MediaInput';

interface Village {
    id: number;
    name: string;
    slug: string;
    status: 'pending' | 'verified' | 'rejected';
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
    price_min: number | null;
    price_max: number | null;
    location: string | null;
    contact_info: string | null;
    media: Media[];
}
interface Props {
    village: Village;
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
            className={`w-full rounded-xl border px-4 py-2.5 text-sm transition-colors outline-none focus:border-(--singgah-green-500) focus:ring-2 focus:ring-(--singgah-green-100) ${hasError ? 'border-red-400' : 'border-gray-200'} ${className ?? ''}`}
        />
    );
}

export default function EditCulinary({ village, culinary }: Props) {
    const [files, setFiles] = useState<File[]>([]);
    const [existingMediaIds, setExistingMediaIds] = useState<number[]>(
        culinary.media.map((m) => m.id)
    );
    
    const { data, setData, processing, errors, setError } = useForm({
        name: culinary.name,
        description: culinary.description,
        price_min: culinary.price_min?.toString() ?? '',
        price_max: culinary.price_max?.toString() ?? '',
        location: culinary.location ?? '',
        contact_info: culinary.contact_info ?? '',
    });
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('price_min', data.price_min);
        formData.append('price_max', data.price_max);
        formData.append('location', data.location);
        formData.append('contact_info', data.contact_info);
        
        existingMediaIds.forEach((id) => {
            formData.append('existing_media_ids[]', id.toString());
        });
        
        files.forEach((file) => {
            formData.append('files[]', file);
        });

        router.post(`/manager/culinaries/${culinary.id}`, formData, {
            onError: (errors) => {
                Object.keys(errors).forEach(key => {
                    setError(key as keyof typeof data, errors[key]);
                });
            },
        });
    };

    return (
        <ManagerLayout title="Edit Kuliner" village={village}>
            <PageHeader
                title="Edit Kuliner / UMKM"
                breadcrumbs={[
                    { label: 'Dashboard', href: '/manager' },
                    { label: 'Kuliner', href: '/manager/culinaries' },
                    { label: 'Edit' },
                ]}
            />
            <form onSubmit={submit}>
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                    <div className="space-y-5 lg:col-span-2">
                        <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                            <Field label="Nama" required error={errors.name}>
                                <Input
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
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
                                    content={data.description}
                                    onChange={(html) =>
                                        setData('description', html)
                                    }
                                    error={errors.description}
                                />
                            </Field>
                            <div className="grid grid-cols-2 gap-4">
                                <Field
                                    label="Harga Min (Rp)"
                                    error={errors.price_min}
                                >
                                    <Input
                                        type="number"
                                        min="0"
                                        value={data.price_min}
                                        onChange={(e) =>
                                            setData('price_min', e.target.value)
                                        }
                                        hasError={!!errors.price_min}
                                    />
                                </Field>
                                <Field
                                    label="Harga Maks (Rp)"
                                    error={errors.price_max}
                                >
                                    <Input
                                        type="number"
                                        min="0"
                                        value={data.price_max}
                                        onChange={(e) =>
                                            setData('price_max', e.target.value)
                                        }
                                        hasError={!!errors.price_max}
                                    />
                                </Field>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Lokasi" error={errors.location}>
                                    <Input
                                        value={data.location}
                                        onChange={(e) =>
                                            setData('location', e.target.value)
                                        }
                                        hasError={!!errors.location}
                                    />
                                </Field>
                                <Field
                                    label="Info Kontak"
                                    error={errors.contact_info}
                                >
                                    <Input
                                        value={data.contact_info}
                                        onChange={(e) =>
                                            setData(
                                                'contact_info',
                                                e.target.value,
                                            )
                                        }
                                        hasError={!!errors.contact_info}
                                    />
                                </Field>
                            </div>
                        </div>
                        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                            <MediaInput
                                label="Foto/Video Kuliner / UMKM"
                                maxFiles={15}
                                existingMedia={culinary.media}
                                onChange={(selectedFiles, selectedExistingIds) => {
                                    setFiles(selectedFiles);
                                    setExistingMediaIds(selectedExistingIds);
                                }}
                            />
                        </div>
                    </div>
                    <div>
                        <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                            <p className="text-sm font-bold tracking-wide text-gray-500 uppercase">
                                Simpan
                            </p>
                            <button
                                type="submit"
                                disabled={processing}
                                className="btn-primary w-full justify-center"
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
        </ManagerLayout>
    );
}

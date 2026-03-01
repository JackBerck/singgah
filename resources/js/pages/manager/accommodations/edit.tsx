import { useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';

import ManagerLayout from '@/layouts/ManagerLayout';
import PageHeader from '@/components/manager/PageHeader';
import RichEditor from '@/components/manager/RichEditor';
import MediaUploader from '@/components/manager/MediaUploader';

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
interface Accommodation {
    id: number;
    name: string;
    description: string;
    price_min: number | null;
    price_max: number | null;
    location: string | null;
    contact_info: string | null;
    operating_hours: string | null;
    media: Media[];
}
interface Props {
    village: Village;
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
            className={`w-full rounded-xl border px-4 py-2.5 text-sm transition-colors outline-none focus:border-(--singgah-green-500) focus:ring-2 focus:ring-(--singgah-green-100) ${hasError ? 'border-red-400' : 'border-gray-200'} ${className ?? ''}`}
        />
    );
}

export default function EditAccommodation({ village, accommodation }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: accommodation.name,
        description: accommodation.description,
        price_min: accommodation.price_min?.toString() ?? '',
        price_max: accommodation.price_max?.toString() ?? '',
        location: accommodation.location ?? '',
        contact_info: accommodation.contact_info ?? '',
        operating_hours: accommodation.operating_hours ?? '',
        media_ids: [] as number[],
    });
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/manager/accommodations/${accommodation.id}`);
    };

    return (
        <ManagerLayout title="Edit Akomodasi" village={village}>
            <PageHeader
                title="Edit Akomodasi"
                breadcrumbs={[
                    { label: 'Dashboard', href: '/manager' },
                    { label: 'Akomodasi', href: '/manager/accommodations' },
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
                                    label="Harga Min/malam (Rp)"
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
                                    label="Harga Maks/malam (Rp)"
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
                                    label="Check-in / Check-out"
                                    error={errors.operating_hours}
                                >
                                    <Input
                                        value={data.operating_hours}
                                        onChange={(e) =>
                                            setData(
                                                'operating_hours',
                                                e.target.value,
                                            )
                                        }
                                        hasError={!!errors.operating_hours}
                                    />
                                </Field>
                            </div>
                            <Field
                                label="Info Kontak"
                                error={errors.contact_info}
                            >
                                <Input
                                    value={data.contact_info}
                                    onChange={(e) =>
                                        setData('contact_info', e.target.value)
                                    }
                                    hasError={!!errors.contact_info}
                                />
                            </Field>
                        </div>
                        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                            <MediaUploader
                                existing={accommodation.media}
                                uploadRoute="/manager/village/media"
                                deleteRoute={(id) => `/manager/media/${id}`}
                                label="Foto Akomodasi"
                                maxFiles={10}
                                onMediaChange={(ids) =>
                                    setData('media_ids', ids)
                                }
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

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
interface Props {
    village: Village;
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

export default function CreateAccommodation({ village }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        price_min: '',
        price_max: '',
        location: '',
        contact_info: '',
        operating_hours: '',
        media_ids: [] as number[],
    });
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/manager/accommodations');
    };

    return (
        <ManagerLayout title="Tambah Akomodasi" village={village}>
            <PageHeader
                title="Tambah Akomodasi"
                breadcrumbs={[
                    { label: 'Dashboard', href: '/manager' },
                    { label: 'Akomodasi', href: '/manager/accommodations' },
                    { label: 'Tambah' },
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
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    placeholder="Homestay Pak Slamet"
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
                                        placeholder="150000"
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
                                        placeholder="350000"
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
                                        placeholder="RT 03 / RW 07"
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
                                        placeholder="14.00 / 12.00"
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
                                    placeholder="0812-xxxx-xxxx / WA"
                                    hasError={!!errors.contact_info}
                                />
                            </Field>
                        </div>
                        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                            <MediaUploader
                                uploadRoute="/manager/village/media"
                                deleteRoute={(id) =>
                                    `/manager/village/media/${id}`
                                }
                                label="Foto Akomodasi"
                                maxFiles={10}
                                maxSizeMB={5}
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
                            <p className="text-xs text-gray-500">
                                Pastikan informasi lengkap dan akurat.
                            </p>
                            <button
                                type="submit"
                                disabled={processing}
                                className="btn-primary w-full justify-center"
                            >
                                <Save className="h-4 w-4" />
                                {processing
                                    ? 'Menyimpan...'
                                    : 'Simpan Akomodasi'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </ManagerLayout>
    );
}

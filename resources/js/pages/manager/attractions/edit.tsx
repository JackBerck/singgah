import { useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';

import ManagerLayout from '@/layouts/ManagerLayout';
import PageHeader from '@/components/manager/PageHeader';
import RichEditor from '@/components/manager/RichEditor';

interface Village {
    id: number;
    name: string;
    slug: string;
    status: 'pending' | 'verified' | 'rejected';
}
interface Attraction {
    id: number;
    name: string;
    description: string;
    price_min: number | null;
    price_max: number | null;
    location: string | null;
    contact_info: string | null;
    operating_hours: string | null;
}
interface Props {
    village: Village;
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
            className={`w-full rounded-xl border px-4 py-2.5 text-sm transition-colors outline-none focus:border-[var(--singgah-green-500)] focus:ring-2 focus:ring-[var(--singgah-green-100)] ${hasError ? 'border-red-400' : 'border-gray-200'} ${className ?? ''}`}
        />
    );
}

export default function EditAttraction({ village, attraction }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: attraction.name,
        description: attraction.description,
        price_min: attraction.price_min?.toString() ?? '',
        price_max: attraction.price_max?.toString() ?? '',
        location: attraction.location ?? '',
        contact_info: attraction.contact_info ?? '',
        operating_hours: attraction.operating_hours ?? '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/manager/attractions/${attraction.id}`);
    };

    return (
        <ManagerLayout title="Edit Wisata" village={village}>
            <PageHeader
                title="Edit Wisata / Atraksi"
                breadcrumbs={[
                    { label: 'Dashboard', href: '/manager' },
                    { label: 'Wisata', href: '/manager/attractions' },
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
                                    label="Jam Operasional"
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

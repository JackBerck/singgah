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

export default function CreateCulinary({ village }: Props) {
    const [files, setFiles] = useState<File[]>([]);
    const { data, setData, processing, errors, setError } = useForm({
        name: '',
        description: '',
        price_min: '',
        price_max: '',
        location: '',
        contact_info: '',
    });
    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('price_min', data.price_min);
        formData.append('price_max', data.price_max);
        formData.append('location', data.location);
        formData.append('contact_info', data.contact_info);
        
        files.forEach((file) => {
            formData.append('files[]', file);
        });

        router.post('/manager/culinaries', formData, {
            onError: (errors) => {
                Object.keys(errors).forEach(key => {
                    setError(key as keyof typeof data, errors[key]);
                });
            },
        });
    };

    return (
        <ManagerLayout title="Tambah Kuliner" village={village}>
            <PageHeader
                title="Tambah Kuliner / UMKM"
                breadcrumbs={[
                    { label: 'Dashboard', href: '/manager' },
                    { label: 'Kuliner', href: '/manager/culinaries' },
                    { label: 'Tambah' },
                ]}
            />
            <form onSubmit={submit}>
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                    <div className="space-y-5 lg:col-span-2">
                        <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                            <Field
                                label="Nama Kuliner / Usaha"
                                required
                                error={errors.name}
                            >
                                <Input
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    placeholder="Gudeg Bu Sari"
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
                                    label="Harga Minimum (Rp)"
                                    error={errors.price_min}
                                >
                                    <Input
                                        type="number"
                                        min="0"
                                        value={data.price_min}
                                        onChange={(e) =>
                                            setData('price_min', e.target.value)
                                        }
                                        placeholder="5000"
                                        hasError={!!errors.price_min}
                                    />
                                </Field>
                                <Field
                                    label="Harga Maksimum (Rp)"
                                    error={errors.price_max}
                                >
                                    <Input
                                        type="number"
                                        min="0"
                                        value={data.price_max}
                                        onChange={(e) =>
                                            setData('price_max', e.target.value)
                                        }
                                        placeholder="25000"
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
                                        placeholder="Depan Balai Desa"
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
                                        placeholder="0812-xxxx-xxxx / WA"
                                        hasError={!!errors.contact_info}
                                    />
                                </Field>
                            </div>
                        </div>
                        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                            <MediaInput
                                label="Foto/Video Kuliner / UMKM"
                                maxFiles={15}
                                onChange={(selectedFiles) => setFiles(selectedFiles)}
                            />
                        </div>
                    </div>
                    <div>
                        <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                            <p className="text-sm font-bold tracking-wide text-gray-500 uppercase">
                                Simpan
                            </p>
                            <p className="text-xs text-gray-500">
                                Foto menarik dapat meningkatkan minat
                                pengunjung.
                            </p>
                            <button
                                type="submit"
                                disabled={processing}
                                className="btn-primary w-full justify-center"
                            >
                                <Save className="h-4 w-4" />
                                {processing ? 'Menyimpan...' : 'Simpan Kuliner'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </ManagerLayout>
    );
}

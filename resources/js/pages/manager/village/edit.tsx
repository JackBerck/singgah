import { useForm } from '@inertiajs/react';
import { CheckCircle2, Save } from 'lucide-react';

import ManagerLayout from '@/layouts/ManagerLayout';
import PageHeader from '@/components/manager/PageHeader';
import RichEditor from '@/components/manager/RichEditor';
import MediaUploader from '@/components/manager/MediaUploader';

interface Village {
    id: number;
    name: string;
    slug: string;
    short_description: string | null;
    description: string;
    address: string | null;
    latitude: number | null;
    longitude: number | null;
    map_url: string | null;
    status: 'pending' | 'verified' | 'rejected';
    media: {
        id: number;
        file_path: string;
        type: 'image' | 'video';
        alt_text?: string;
    }[];
}

interface Props {
    village: Village;
}

const statusInfo = {
    verified: {
        label: 'Terverifikasi',
        cls: 'bg-emerald-100 text-emerald-700',
    },
    pending: {
        label: 'Menunggu Verifikasi',
        cls: 'bg-amber-100 text-amber-700',
    },
    rejected: { label: 'Ditolak', cls: 'bg-red-100 text-red-700' },
};

function InputField({
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

function Input({
    className,
    ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
    const { error, ...rest } = props as any;
    return (
        <input
            {...rest}
            className={`w-full rounded-xl border px-4 py-2.5 text-sm transition-colors outline-none focus:border-[var(--singgah-green-500)] focus:ring-2 focus:ring-[var(--singgah-green-100)] ${error ? 'border-red-400' : 'border-gray-200'} ${className ?? ''}`}
        />
    );
}

function Textarea({
    className,
    ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string }) {
    const { error, ...rest } = props as any;
    return (
        <textarea
            {...rest}
            rows={3}
            className={`w-full resize-none rounded-xl border px-4 py-2.5 text-sm transition-colors outline-none focus:border-[var(--singgah-green-500)] focus:ring-2 focus:ring-[var(--singgah-green-100)] ${error ? 'border-red-400' : 'border-gray-200'} ${className ?? ''}`}
        />
    );
}

export default function EditVillage({ village }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: village.name,
        short_description: village.short_description ?? '',
        description: village.description,
        address: village.address ?? '',
        latitude: village.latitude?.toString() ?? '',
        longitude: village.longitude?.toString() ?? '',
        map_url: village.map_url ?? '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/manager/village');
    };

    const status = statusInfo[village.status];

    return (
        <ManagerLayout title="Profil Desa" village={village}>
            <PageHeader
                title="Profil Desa"
                subtitle="Kelola informasi lengkap tentang desa wisata Anda"
                breadcrumbs={[
                    { label: 'Dashboard', href: '/manager' },
                    { label: 'Profil Desa' },
                ]}
                action={
                    <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${status.cls}`}
                    >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {status.label}
                    </span>
                }
            />

            <form onSubmit={submit}>
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                    {/* Main Column */}
                    <div className="space-y-5 lg:col-span-2">
                        {/* Basic Info Card */}
                        <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                            <p className="text-sm font-bold tracking-wide text-gray-500 uppercase">
                                Informasi Dasar
                            </p>

                            <InputField
                                label="Nama Desa"
                                required
                                error={errors.name}
                            >
                                <Input
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    placeholder="Desa Wisata Nusantara"
                                    error={errors.name}
                                />
                            </InputField>

                            <InputField
                                label="Deskripsi Singkat"
                                error={errors.short_description}
                            >
                                <Textarea
                                    value={data.short_description}
                                    onChange={(e) =>
                                        setData(
                                            'short_description',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Ringkasan singkat tentang desa (max 500 karakter)..."
                                    error={errors.short_description}
                                    maxLength={500}
                                />
                                <p className="mt-1 text-right text-xs text-gray-400">
                                    {data.short_description.length}/500
                                </p>
                            </InputField>

                            <InputField
                                label="Deskripsi Lengkap"
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
                            </InputField>
                        </div>

                        {/* Location Card */}
                        <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                            <p className="text-sm font-bold tracking-wide text-gray-500 uppercase">
                                Lokasi & Peta
                            </p>

                            <InputField
                                label="Alamat Lengkap"
                                error={errors.address}
                            >
                                <Textarea
                                    value={data.address}
                                    onChange={(e) =>
                                        setData('address', e.target.value)
                                    }
                                    placeholder="Jl. Desa Wisata No. 1, Kec. ..."
                                    error={errors.address}
                                />
                            </InputField>

                            <div className="grid grid-cols-2 gap-4">
                                <InputField
                                    label="Latitude"
                                    error={errors.latitude}
                                >
                                    <Input
                                        type="number"
                                        step="any"
                                        value={data.latitude}
                                        onChange={(e) =>
                                            setData('latitude', e.target.value)
                                        }
                                        placeholder="-7.123456"
                                        error={errors.latitude}
                                    />
                                </InputField>
                                <InputField
                                    label="Longitude"
                                    error={errors.longitude}
                                >
                                    <Input
                                        type="number"
                                        step="any"
                                        value={data.longitude}
                                        onChange={(e) =>
                                            setData('longitude', e.target.value)
                                        }
                                        placeholder="110.123456"
                                        error={errors.longitude}
                                    />
                                </InputField>
                            </div>

                            <InputField
                                label="URL Google Maps / Embed"
                                error={errors.map_url}
                            >
                                <Input
                                    type="url"
                                    value={data.map_url}
                                    onChange={(e) =>
                                        setData('map_url', e.target.value)
                                    }
                                    placeholder="https://maps.google.com/..."
                                    error={errors.map_url}
                                />
                            </InputField>
                        </div>

                        {/* Media Gallery Card */}
                        <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                            <p className="text-sm font-bold tracking-wide text-gray-500 uppercase">
                                Galeri Foto/Video Desa
                            </p>
                            <MediaUploader
                                existing={village.media}
                                uploadRoute="/manager/village/media"
                                deleteRoute={(id) => `/manager/media/${id}`}
                                label="Upload Foto/Video"
                                maxFiles={15}
                                maxSizeMB={10}
                                allowVideo={true}
                            />
                        </div>
                    </div>

                    {/* Sidebar Action */}
                    <div className="space-y-5">
                        <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                            <p className="text-sm font-bold tracking-wide text-gray-500 uppercase">
                                Publikasi
                            </p>
                            <div className="space-y-2 text-xs text-gray-500">
                                <div className="flex justify-between">
                                    <span>Slug</span>
                                    <span className="max-w-[140px] truncate font-mono text-gray-700">
                                        {village.slug}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Status</span>
                                    <span
                                        className={`rounded-full px-2 py-0.5 font-semibold ${status.cls}`}
                                    >
                                        {status.label}
                                    </span>
                                </div>
                            </div>
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

                        {/* Tips */}
                        <div
                            className="rounded-2xl border border-[var(--singgah-green-100)] p-4 text-xs text-gray-500"
                            style={{ background: 'var(--singgah-green-50)' }}
                        >
                            <p className="mb-2 font-semibold text-[var(--singgah-green-700)]">
                                💡 Tips
                            </p>
                            <ul className="list-disc space-y-1.5 pl-4">
                                <li>
                                    Tulis deskripsi yang menarik dan informatif.
                                </li>
                                <li>
                                    Tambahkan koordinat GPS agar mudah ditemukan
                                    di peta.
                                </li>
                                <li>
                                    Gunakan foto berkualitas tinggi untuk
                                    menarik pengunjung.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </form>
        </ManagerLayout>
    );
}

import { router } from '@inertiajs/react';
import { Save } from 'lucide-react';
import { useState } from 'react';

import AdminLayout from '@/layouts/AdminLayout';
import PageHeader from '@/components/manager/PageHeader';
import RichEditor from '@/components/manager/RichEditor';
import MediaInput from '@/components/manager/MediaInput';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/dropdown-menu';

interface Media {
    id: number;
    file_path: string;
    type: 'image' | 'video';
    alt_text?: string;
}
interface Village {
    id: number;
    name: string;
    slug: string;
    short_description: string | null;
    description: string | null;
    category: string | null;
    address: string | null;
    latitude: number | null;
    longitude: number | null;
    map_url: string | null;
    status: string;
    is_featured: boolean;
    rejected_reason: string | null;
    manager: { name: string; email: string } | null;
    media: Media[];
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
            className={`w-full rounded-xl border px-4 py-2.5 text-sm transition-colors outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 ${hasError ? 'border-red-400' : 'border-gray-200'} ${className ?? ''}`}
        />
    );
}

const statusOptions = [
    { value: 'pending', label: 'Menunggu Verifikasi' },
    { value: 'verified', label: 'Terverifikasi' },
    { value: 'rejected', label: 'Ditolak' },
];

const categoryOptions = [
    { value: '', label: 'Belum Dipilih' },
    { value: 'pesisir_bahari', label: 'Pesisir & Bahari' },
    { value: 'agrowisata', label: 'Agrowisata' },
    { value: 'kuliner_lokal', label: 'Kuliner Lokal' },
    { value: 'budaya_tradisi', label: 'Budaya & Tradisi' },
    { value: 'wisata_alam', label: 'Wisata Alam' },
];

export default function VillageEdit({ village }: Props) {
    const [statusOpen, setStatusOpen] = useState(false);
    const [files, setFiles] = useState<File[]>([]);
    const [existingMediaIds, setExistingMediaIds] = useState<number[]>(
        village.media.map((m) => m.id),
    );
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState({
        name: village.name,
        slug: village.slug,
        short_description: village.short_description ?? '',
        description: village.description ?? '',
        category: village.category ?? '',
        address: village.address ?? '',
        latitude: String(village.latitude ?? ''),
        longitude: String(village.longitude ?? ''),
        map_url: village.map_url ?? '',
        status: village.status,
        is_featured: village.is_featured,
        rejected_reason: village.rejected_reason ?? '',
    });

    const set = (key: keyof typeof formData, value: string | boolean) =>
        setFormData((prev) => ({ ...prev, [key]: value }));

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        const fd = new FormData();
        fd.append('_method', 'PUT');
        Object.entries(formData).forEach(([k, v]) => fd.append(k, String(v)));

        existingMediaIds.forEach((id) =>
            fd.append('existing_media_ids[]', String(id)),
        );
        files.forEach((file) => fd.append('files[]', file));

        setProcessing(true);
        router.post(`/admin/villages/${village.id}`, fd, {
            onError: (e) => setErrors(e),
            onFinish: () => setProcessing(false),
        });
    };

    const selectedStatus = statusOptions.find(
        (s) => s.value === formData.status,
    );

    return (
        <AdminLayout title={`Edit: ${village.name}`}>
            <PageHeader
                title="Edit Desa"
                breadcrumbs={[
                    { label: 'Dashboard', href: '/admin' },
                    { label: 'Desa', href: '/admin/villages' },
                    { label: village.name },
                ]}
            />

            <form onSubmit={submit}>
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                    <div className="space-y-5 lg:col-span-2">
                        {/* Basic Info */}
                        <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                            <h3 className="text-sm font-bold tracking-wide text-gray-500 uppercase">
                                Informasi Dasar
                            </h3>
                            <Field
                                label="Nama Desa"
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
                            <Field label="Slug (URL)" error={errors.slug}>
                                <Input
                                    value={formData.slug}
                                    onChange={(e) =>
                                        set('slug', e.target.value)
                                    }
                                    hasError={!!errors.slug}
                                />
                            </Field>
                            <Field
                                label="Deskripsi Singkat"
                                error={errors.short_description}
                            >
                                <textarea
                                    value={formData.short_description}
                                    onChange={(e) =>
                                        set('short_description', e.target.value)
                                    }
                                    rows={2}
                                    placeholder="Deskripsi singkat yang menarik..."
                                    className="w-full resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                                />
                            </Field>
                            <Field
                                label="Deskripsi Lengkap"
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

                            <Field
                                label="Kategori Desa"
                                error={errors.category}
                            >
                                <select
                                    value={formData.category}
                                    onChange={(e) =>
                                        set('category', e.target.value)
                                    }
                                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                                >
                                    {categoryOptions.map((opt) => (
                                        <option
                                            key={opt.value}
                                            value={opt.value}
                                        >
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                                <p className="mt-1 text-xs text-gray-500">
                                    Pilih kategori yang paling sesuai dengan
                                    keunggulan desa
                                </p>
                            </Field>

                            <Field label="Alamat" error={errors.address}>
                                <Input
                                    value={formData.address}
                                    onChange={(e) =>
                                        set('address', e.target.value)
                                    }
                                    hasError={!!errors.address}
                                    placeholder="Alamat lengkap desa"
                                />
                            </Field>
                        </div>

                        {/* Location */}
                        <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                            <h3 className="text-sm font-bold tracking-wide text-gray-500 uppercase">
                                Lokasi
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Latitude" error={errors.latitude}>
                                    <Input
                                        type="number"
                                        step="any"
                                        value={formData.latitude}
                                        onChange={(e) =>
                                            set('latitude', e.target.value)
                                        }
                                        hasError={!!errors.latitude}
                                        placeholder="-7.123456"
                                    />
                                </Field>
                                <Field
                                    label="Longitude"
                                    error={errors.longitude}
                                >
                                    <Input
                                        type="number"
                                        step="any"
                                        value={formData.longitude}
                                        onChange={(e) =>
                                            set('longitude', e.target.value)
                                        }
                                        hasError={!!errors.longitude}
                                        placeholder="110.123456"
                                    />
                                </Field>
                            </div>
                            <Field
                                label="URL Peta (Google Maps)"
                                error={errors.map_url}
                            >
                                <Input
                                    value={formData.map_url}
                                    onChange={(e) =>
                                        set('map_url', e.target.value)
                                    }
                                    hasError={!!errors.map_url}
                                    placeholder="https://maps.google.com/..."
                                />
                            </Field>
                        </div>

                        {/* Media */}
                        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                            <MediaInput
                                label="Foto Desa"
                                maxFiles={10}
                                existingMedia={village.media}
                                onChange={(selectedFiles, selectedIds) => {
                                    setFiles(selectedFiles);
                                    setExistingMediaIds(selectedIds);
                                }}
                                error={errors['files.0']}
                            />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-5">
                        <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                            <p className="text-xs font-bold tracking-wide text-gray-500 uppercase">
                                Status & Visibilitas
                            </p>

                            <Field
                                label="Status Verifikasi"
                                error={errors.status}
                            >
                                <DropdownMenu
                                    open={statusOpen}
                                    onOpenChange={setStatusOpen}
                                >
                                    <DropdownMenuTrigger asChild>
                                        <button
                                            type="button"
                                            className="flex w-full items-center justify-between rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none hover:border-gray-300"
                                        >
                                            <span>
                                                {selectedStatus?.label ??
                                                    'Pilih status'}
                                            </span>
                                            <svg
                                                className="h-4 w-4 text-gray-400"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 9l-7 7-7-7"
                                                />
                                            </svg>
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                                        {statusOptions.map((o) => (
                                            <DropdownMenuItem
                                                key={o.value}
                                                onSelect={() => {
                                                    set('status', o.value);
                                                    setStatusOpen(false);
                                                }}
                                                className={
                                                    formData.status === o.value
                                                        ? 'font-semibold text-red-600'
                                                        : ''
                                                }
                                            >
                                                {o.label}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </Field>

                            {formData.status === 'rejected' && (
                                <Field
                                    label="Alasan Penolakan"
                                    error={errors.rejected_reason}
                                >
                                    <textarea
                                        value={formData.rejected_reason}
                                        onChange={(e) =>
                                            set(
                                                'rejected_reason',
                                                e.target.value,
                                            )
                                        }
                                        rows={3}
                                        placeholder="Jelaskan alasan penolakan..."
                                        className="w-full resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
                                    />
                                </Field>
                            )}

                            <label className="flex cursor-pointer items-center gap-3">
                                <div
                                    className={`relative h-5 w-9 rounded-full transition-colors ${formData.is_featured ? 'bg-yellow-400' : 'bg-gray-200'}`}
                                >
                                    <div
                                        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${formData.is_featured ? 'translate-x-4' : 'translate-x-0.5'}`}
                                    />
                                </div>
                                <input
                                    type="checkbox"
                                    checked={formData.is_featured}
                                    onChange={(e) =>
                                        set('is_featured', e.target.checked)
                                    }
                                    className="sr-only"
                                />
                                <span className="text-sm font-medium text-gray-700">
                                    Desa Unggulan ⭐
                                </span>
                            </label>
                        </div>

                        {village.manager && (
                            <div className="space-y-2 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                                <p className="text-xs font-bold tracking-wide text-gray-500 uppercase">
                                    Pengelola
                                </p>
                                <p className="font-semibold text-gray-800">
                                    {village.manager.name}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {village.manager.email}
                                </p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={processing}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
                        >
                            <Save className="h-4 w-4" />
                            {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}

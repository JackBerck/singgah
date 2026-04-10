import { useForm, router } from '@inertiajs/react';
import { Save } from 'lucide-react';
import { useState } from 'react';

import ManagerLayout from '@/layouts/ManagerLayout';
import PageHeader from '@/components/manager/PageHeader';
import RichEditor from '@/components/manager/RichEditor';
import DatePicker from '@/components/manager/DatePicker';
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
interface Event {
    id: number;
    name: string;
    description: string;
    event_date: string;
    end_date: string | null;
    location: string | null;
    contact_info: string | null;
    map_url: string | null;
    is_featured: boolean;
    media: Media[];
}
interface Props {
    village: Village;
    event: Event;
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

// ISO → datetime-local format
const toISO = (s: string | null) => {
    if (!s) return '';
    try {
        return new Date(s).toISOString().slice(0, 16);
    } catch {
        return '';
    }
};

export default function EditEvent({ village, event }: Props) {
    const [files, setFiles] = useState<File[]>([]);
    const [existingMediaIds, setExistingMediaIds] = useState<number[]>(
        event.media.map((m) => m.id),
    );

    const { data, setData, processing, errors, setError } = useForm({
        name: event.name,
        description: event.description,
        event_date: toISO(event.event_date),
        end_date: toISO(event.end_date),
        location: event.location ?? '',
        contact_info: event.contact_info ?? '',
        map_url: event.map_url ?? '',
        is_featured: event.is_featured,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('event_date', data.event_date);
        formData.append('end_date', data.end_date);
        formData.append('location', data.location);
        formData.append('contact_info', data.contact_info);
        if (data.map_url) formData.append('map_url', data.map_url);
        formData.append('is_featured', data.is_featured ? '1' : '0');

        existingMediaIds.forEach((id) => {
            formData.append('existing_media_ids[]', id.toString());
        });

        files.forEach((file) => {
            formData.append('files[]', file);
        });

        router.post(`/manager/events/${event.id}`, formData, {
            forceFormData: true,
            onError: (errors) => {
                Object.keys(errors).forEach((key) => {
                    setError(key as keyof typeof data, errors[key]);
                });
            },
        });
    };

    return (
        <ManagerLayout title="Edit Acara" village={village}>
            <PageHeader
                title="Edit Acara"
                breadcrumbs={[
                    { label: 'Dashboard', href: '/manager' },
                    { label: 'Acara', href: '/manager/events' },
                    { label: 'Edit' },
                ]}
            />
            <form onSubmit={submit}>
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                    <div className="space-y-5 lg:col-span-2">
                        <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                            <Field
                                label="Nama Acara"
                                required
                                error={errors.name}
                            >
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
                                    label="Tanggal Mulai"
                                    required
                                    error={errors.event_date}
                                >
                                    <DatePicker
                                        value={data.event_date}
                                        onChange={(val) =>
                                            setData('event_date', val)
                                        }
                                        withTime
                                        placeholder="Pilih tanggal mulai"
                                        error={errors.event_date}
                                    />
                                </Field>
                                <Field
                                    label="Tanggal Selesai"
                                    error={errors.end_date}
                                >
                                    <DatePicker
                                        value={data.end_date}
                                        onChange={(val) =>
                                            setData('end_date', val)
                                        }
                                        withTime
                                        placeholder="Pilih tanggal selesai"
                                        error={errors.end_date}
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
                                    label="Info Kontak (Nomor HP)"
                                    error={errors.contact_info}
                                >
                                    <Input
                                        type="tel"
                                        value={data.contact_info}
                                        onChange={(e) =>
                                            setData('contact_info', e.target.value.replace(/\D/g, ''))
                                        }
                                        placeholder="0812xxxxxxxx"
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
                                        value={data.map_url}
                                        onChange={(e) =>
                                            setData('map_url', e.target.value)
                                        }
                                        placeholder="https://maps.app.goo.gl/..."
                                        hasError={!!errors.map_url}
                                    />
                                </Field>
                            </div>
                        </div>

                        {/* Media */}
                        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                            <MediaInput
                                label="Foto/Video Acara"
                                maxFiles={10}
                                existingMedia={event.media}
                                onChange={(
                                    selectedFiles,
                                    selectedExistingIds,
                                ) => {
                                    setFiles(selectedFiles);
                                    setExistingMediaIds(selectedExistingIds);
                                }}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                            <p className="text-sm font-bold tracking-wide text-gray-500 uppercase">
                                Pengaturan
                            </p>
                            <label className="flex cursor-pointer items-center gap-3">
                                <input
                                    type="checkbox"
                                    checked={data.is_featured}
                                    onChange={(e) =>
                                        setData('is_featured', e.target.checked)
                                    }
                                    className="h-4 w-4 rounded accent-(--singgah-green-600)"
                                />
                                <span className="text-sm font-medium text-gray-700">
                                    Acara Unggulan
                                </span>
                            </label>
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

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
interface Event {
    id: number;
    name: string;
    description: string;
    event_date: string;
    end_date: string | null;
    location: string | null;
    contact_info: string | null;
    is_featured: boolean;
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
            className={`w-full rounded-xl border px-4 py-2.5 text-sm transition-colors outline-none focus:border-[var(--singgah-green-500)] focus:ring-2 focus:ring-[var(--singgah-green-100)] ${hasError ? 'border-red-400' : 'border-gray-200'} ${className ?? ''}`}
        />
    );
}

// Format datetime for input[type=datetime-local]
const toDatetimeLocal = (s: string | null) => {
    if (!s) return '';
    return new Date(s).toISOString().slice(0, 16);
};

export default function EditEvent({ village, event }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: event.name,
        description: event.description,
        event_date: toDatetimeLocal(event.event_date),
        end_date: toDatetimeLocal(event.end_date),
        location: event.location ?? '',
        contact_info: event.contact_info ?? '',
        is_featured: event.is_featured,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/manager/events/${event.id}`);
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
                                    <Input
                                        type="datetime-local"
                                        value={data.event_date}
                                        onChange={(e) =>
                                            setData(
                                                'event_date',
                                                e.target.value,
                                            )
                                        }
                                        hasError={!!errors.event_date}
                                    />
                                </Field>
                                <Field
                                    label="Tanggal Selesai"
                                    error={errors.end_date}
                                >
                                    <Input
                                        type="datetime-local"
                                        value={data.end_date}
                                        onChange={(e) =>
                                            setData('end_date', e.target.value)
                                        }
                                        hasError={!!errors.end_date}
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
                                    className="h-4 w-4 rounded accent-[var(--singgah-green-600)]"
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

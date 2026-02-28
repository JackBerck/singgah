import { Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';

import ManagerLayout from '@/layouts/ManagerLayout';
import PageHeader from '@/components/manager/PageHeader';
import DataTable, { Column } from '@/components/manager/DataTable';

interface Event {
    id: number;
    name: string;
    event_date: string;
    end_date: string | null;
    location: string | null;
    is_featured: boolean;
}

interface Village {
    id: number;
    name: string;
    slug: string;
    status: 'pending' | 'verified' | 'rejected';
}

interface Props {
    village: Village;
    events: { data: Event[]; current_page: number; last_page: number };
}

const columns: Column<Event>[] = [
    {
        key: 'name',
        label: 'Nama Acara',
        render: (row) => (
            <span className="font-medium text-gray-800">{row.name}</span>
        ),
    },
    {
        key: 'event_date',
        label: 'Tanggal',
        render: (row) =>
            new Date(row.event_date).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
            }),
    },
    {
        key: 'location',
        label: 'Lokasi',
        render: (row) =>
            row.location ?? <span className="text-gray-400 italic">—</span>,
    },
    {
        key: 'is_featured',
        label: 'Unggulan',
        render: (row) =>
            row.is_featured ? (
                <span className="rounded-full bg-[var(--singgah-green-100)] px-2 py-0.5 text-xs font-semibold text-[var(--singgah-green-700)]">
                    Ya
                </span>
            ) : (
                <span className="text-xs text-gray-400">—</span>
            ),
    },
];

export default function EventsIndex({ village, events }: Props) {
    return (
        <ManagerLayout title="Acara Desa" village={village}>
            <PageHeader
                title="Acara Desa"
                subtitle="Kelola acara dan event yang diselenggarakan desa"
                breadcrumbs={[
                    { label: 'Dashboard', href: '/manager' },
                    { label: 'Acara' },
                ]}
                action={
                    <Link href="/manager/events/create" className="btn-primary">
                        <Plus className="h-4 w-4" /> Tambah Acara
                    </Link>
                }
            />
            <DataTable
                columns={columns}
                data={events.data}
                editHref={(row) => `/manager/events/${row.id}/edit`}
                deleteRoute={(row) => `/manager/events/${row.id}`}
                deleteConfirmMessage={(row) =>
                    `Hapus acara "${row.name}"? Tindakan ini tidak bisa dibatalkan.`
                }
                emptyMessage="Belum ada acara. Tambahkan acara pertama desa Anda!"
            />
        </ManagerLayout>
    );
}

import { Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';

import ManagerLayout from '@/layouts/ManagerLayout';
import PageHeader from '@/components/manager/PageHeader';
import DataTable, {
    Column,
    PaginationMeta,
} from '@/components/manager/DataTable';

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
    events: {
        data: Event[];
        current_page: number;
        last_page: number;
        from: number | null;
        to: number | null;
        total: number;
        path: string;
    };
}

const columns: Column<Event>[] = [
    {
        key: 'name',
        label: 'Nama Acara',
        render: (r) => (
            <span className="font-medium text-gray-800">{r.name}</span>
        ),
    },
    {
        key: 'event_date',
        label: 'Tanggal',
        render: (r) =>
            new Date(r.event_date).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
            }),
    },
    {
        key: 'location',
        label: 'Lokasi',
        render: (r) =>
            r.location ?? <span className="text-gray-400 italic">—</span>,
    },
    {
        key: 'is_featured',
        label: 'Unggulan',
        render: (r) =>
            r.is_featured ? (
                <span className="rounded-full bg-(--singgah-green-100) px-2 py-0.5 text-xs font-semibold text-(--singgah-green-700)">
                    Ya
                </span>
            ) : (
                <span className="text-xs text-gray-400">—</span>
            ),
    },
];

export default function EventsIndex({ village, events }: Props) {
    const pagination: PaginationMeta = {
        current_page: events.current_page,
        last_page: events.last_page,
        from: events.from,
        to: events.to,
        total: events.total,
        path: events.path,
    };

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
                        <Plus className="h-4 w-4" />
                        Tambah Acara
                    </Link>
                }
            />
            <DataTable
                columns={columns}
                data={events.data}
                pagination={pagination}
                editHref={(r) => `/manager/events/${r.id}/edit`}
                deleteRoute={(r) => `/manager/events/${r.id}`}
                deleteConfirmMessage={(r) => `Hapus acara "${r.name}"?`}
                emptyMessage="Belum ada acara. Tambahkan acara pertama desa Anda!"
            />
        </ManagerLayout>
    );
}

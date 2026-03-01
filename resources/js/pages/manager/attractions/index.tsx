import { Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';

import ManagerLayout from '@/layouts/ManagerLayout';
import PageHeader from '@/components/manager/PageHeader';
import DataTable, {
    Column,
    PaginationMeta,
} from '@/components/manager/DataTable';

interface Attraction {
    id: number;
    name: string;
    price_min: number | null;
    price_max: number | null;
    location: string | null;
    operating_hours: string | null;
}
interface Village {
    id: number;
    name: string;
    slug: string;
    status: 'pending' | 'verified' | 'rejected';
}
interface Props {
    village: Village;
    attractions: {
        data: Attraction[];
        current_page: number;
        last_page: number;
        from: number | null;
        to: number | null;
        total: number;
        path: string;
    };
}

const fmt = (n: number | null) =>
    n != null ? `Rp ${n.toLocaleString('id-ID')}` : null;

const columns: Column<Attraction>[] = [
    {
        key: 'name',
        label: 'Nama Wisata',
        render: (r) => (
            <span className="font-medium text-gray-800">{r.name}</span>
        ),
    },
    {
        key: 'price',
        label: 'Harga',
        render: (r) => {
            const min = fmt(r.price_min),
                max = fmt(r.price_max);
            if (!min && !max)
                return <span className="text-gray-400 italic">Gratis / —</span>;
            return (
                <span>
                    {min ?? '?'}
                    {max && max !== min ? ` – ${max}` : ''}
                </span>
            );
        },
    },
    {
        key: 'operating_hours',
        label: 'Jam Operasional',
        render: (r) =>
            r.operating_hours ?? (
                <span className="text-gray-400 italic">—</span>
            ),
    },
    {
        key: 'location',
        label: 'Lokasi',
        render: (r) =>
            r.location ?? <span className="text-gray-400 italic">—</span>,
    },
];

export default function AttractionsIndex({ village, attractions }: Props) {
    const pagination: PaginationMeta = {
        current_page: attractions.current_page,
        last_page: attractions.last_page,
        from: attractions.from,
        to: attractions.to,
        total: attractions.total,
        path: attractions.path,
    };

    return (
        <ManagerLayout title="Wisata & Atraksi" village={village}>
            <PageHeader
                title="Wisata & Atraksi"
                subtitle="Kelola tempat wisata dan atraksi menarik di desa"
                breadcrumbs={[
                    { label: 'Dashboard', href: '/manager' },
                    { label: 'Wisata & Atraksi' },
                ]}
                action={
                    <Link
                        href="/manager/attractions/create"
                        className="btn-primary"
                    >
                        <Plus className="h-4 w-4" />
                        Tambah Wisata
                    </Link>
                }
            />
            <DataTable
                columns={columns}
                data={attractions.data}
                pagination={pagination}
                editHref={(r) => `/manager/attractions/${r.id}/edit`}
                deleteRoute={(r) => `/manager/attractions/${r.id}`}
                deleteConfirmMessage={(r) => `Hapus wisata "${r.name}"?`}
                emptyMessage="Belum ada wisata. Tambahkan atraksi desa Anda!"
            />
        </ManagerLayout>
    );
}

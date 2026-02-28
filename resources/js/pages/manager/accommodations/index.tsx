import { Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';

import ManagerLayout from '@/layouts/ManagerLayout';
import PageHeader from '@/components/manager/PageHeader';
import DataTable, { Column } from '@/components/manager/DataTable';

interface Accommodation {
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
    accommodations: { data: Accommodation[] };
}

const fmt = (n: number | null) =>
    n != null ? `Rp ${n.toLocaleString('id-ID')}` : null;

const columns: Column<Accommodation>[] = [
    {
        key: 'name',
        label: 'Nama Akomodasi',
        render: (r) => (
            <span className="font-medium text-gray-800">{r.name}</span>
        ),
    },
    {
        key: 'price',
        label: 'Harga/malam',
        render: (r) => {
            const min = fmt(r.price_min),
                max = fmt(r.price_max);
            if (!min && !max)
                return <span className="text-gray-400 italic">—</span>;
            return `${min ?? '?'}${max && max !== min ? ` - ${max}` : ''}`;
        },
    },
    {
        key: 'operating_hours',
        label: 'Check-in / Out',
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

export default function AccommodationsIndex({
    village,
    accommodations,
}: Props) {
    return (
        <ManagerLayout title="Akomodasi" village={village}>
            <PageHeader
                title="Akomodasi"
                subtitle="Kelola tempat menginap dan akomodasi di desa"
                breadcrumbs={[
                    { label: 'Dashboard', href: '/manager' },
                    { label: 'Akomodasi' },
                ]}
                action={
                    <Link
                        href="/manager/accommodations/create"
                        className="btn-primary"
                    >
                        <Plus className="h-4 w-4" />
                        Tambah Akomodasi
                    </Link>
                }
            />
            <DataTable
                columns={columns}
                data={accommodations.data}
                editHref={(r) => `/manager/accommodations/${r.id}/edit`}
                deleteRoute={(r) => `/manager/accommodations/${r.id}`}
                deleteConfirmMessage={(r) => `Hapus akomodasi "${r.name}"?`}
                emptyMessage="Belum ada akomodasi. Tambahkan penginapan di desa Anda!"
            />
        </ManagerLayout>
    );
}

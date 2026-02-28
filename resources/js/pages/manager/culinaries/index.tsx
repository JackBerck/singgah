import { Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';

import ManagerLayout from '@/layouts/ManagerLayout';
import PageHeader from '@/components/manager/PageHeader';
import DataTable, { Column } from '@/components/manager/DataTable';

interface Culinary {
    id: number;
    name: string;
    price_min: number | null;
    price_max: number | null;
    location: string | null;
}
interface Village {
    id: number;
    name: string;
    slug: string;
    status: 'pending' | 'verified' | 'rejected';
}
interface Props {
    village: Village;
    culinaries: { data: Culinary[] };
}

const fmt = (n: number | null) =>
    n != null ? `Rp ${n.toLocaleString('id-ID')}` : null;

const columns: Column<Culinary>[] = [
    {
        key: 'name',
        label: 'Nama Kuliner',
        render: (r) => (
            <span className="font-medium text-gray-800">{r.name}</span>
        ),
    },
    {
        key: 'price',
        label: 'Kisaran Harga',
        render: (r) => {
            const min = fmt(r.price_min),
                max = fmt(r.price_max);
            if (!min && !max)
                return <span className="text-gray-400 italic">—</span>;
            return `${min ?? '?'}${max && max !== min ? ` - ${max}` : ''}`;
        },
    },
    {
        key: 'location',
        label: 'Lokasi',
        render: (r) =>
            r.location ?? <span className="text-gray-400 italic">—</span>,
    },
];

export default function CulinarysIndex({ village, culinaries }: Props) {
    return (
        <ManagerLayout title="Kuliner & UMKM" village={village}>
            <PageHeader
                title="Kuliner & UMKM"
                subtitle="Kelola kuliner khas dan usaha mikro di desa"
                breadcrumbs={[
                    { label: 'Dashboard', href: '/manager' },
                    { label: 'Kuliner' },
                ]}
                action={
                    <Link
                        href="/manager/culinaries/create"
                        className="btn-primary"
                    >
                        <Plus className="h-4 w-4" />
                        Tambah Kuliner
                    </Link>
                }
            />
            <DataTable
                columns={columns}
                data={culinaries.data}
                editHref={(r) => `/manager/culinaries/${r.id}/edit`}
                deleteRoute={(r) => `/manager/culinaries/${r.id}`}
                deleteConfirmMessage={(r) => `Hapus kuliner "${r.name}"?`}
                emptyMessage="Belum ada kuliner. Perkenalkan cita rasa desa Anda!"
            />
        </ManagerLayout>
    );
}

import { Link } from '@inertiajs/react';
import {
    AlertTriangle,
    BedDouble,
    CalendarDays,
    CheckCircle2,
    Clock,
    MapPin,
    Package,
    Star,
    UtensilsCrossed,
} from 'lucide-react';

import ManagerLayout from '@/layouts/ManagerLayout';
import PageHeader from '@/components/manager/PageHeader';
import StatCard from '@/components/manager/StatCard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Village {
    id: number;
    name: string;
    slug: string;
    status: 'pending' | 'verified' | 'rejected';
    rejected_reason?: string;
}

interface Stats {
    total_content: number;
    events_count: number;
    attractions_count: number;
    culinaries_count: number;
    accommodations_count: number;
    reviews_count: number;
    avg_rating: number;
    status: string;
    rejected_reason?: string;
}

interface RecentItem {
    id: number;
    name: string;
    [key: string]: any;
}

interface Props {
    village: Village;
    stats: Stats;
    recentEvents: RecentItem[];
    recentAttractions: RecentItem[];
    recentCulinaries: RecentItem[];
    recentAccommodations: RecentItem[];
}

const statusBadge = {
    verified: (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
            <CheckCircle2 className="h-3 w-3" />
            Terverifikasi
        </span>
    ),
    pending: (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
            <Clock className="h-3 w-3" />
            Menunggu Verifikasi
        </span>
    ),
    rejected: (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
            <AlertTriangle className="h-3 w-3" />
            Ditolak
        </span>
    ),
};

function RecentList({
    title,
    items,
    createHref,
    viewHref,
    icon: Icon,
}: {
    title: string;
    items: RecentItem[];
    createHref: string;
    viewHref: string;
    icon: React.ComponentType<any>;
}) {
    return (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-50 px-5 py-4">
                <div className="flex items-center gap-2.5">
                    <div
                        className="flex h-7 w-7 items-center justify-center rounded-lg"
                        style={{ background: 'var(--singgah-green-50)' }}
                    >
                        <Icon
                            className="h-3.5 w-3.5"
                            style={{ color: 'var(--singgah-green-600)' }}
                        />
                    </div>
                    <p className="text-sm font-semibold text-gray-800">
                        {title}
                    </p>
                </div>
                <Link
                    href={viewHref}
                    className="text-xs font-semibold transition-colors"
                    style={{ color: 'var(--singgah-green-600)' }}
                >
                    Lihat semua
                </Link>
            </div>
            <div className="divide-y divide-gray-50">
                {items.length === 0 ? (
                    <p className="py-8 text-center text-xs text-gray-400">
                        Belum ada data
                    </p>
                ) : (
                    items.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between px-5 py-3"
                        >
                            <p className="flex-1 truncate text-sm text-gray-700">
                                {item.name}
                            </p>
                        </div>
                    ))
                )}
            </div>
            <div className="border-t border-gray-50 px-5 py-3">
                <Link
                    href={createHref}
                    className="text-xs font-semibold transition-colors"
                    style={{ color: 'var(--singgah-green-600)' }}
                >
                    + Tambah baru
                </Link>
            </div>
        </div>
    );
}

export default function Dashboard({
    village,
    stats,
    recentEvents,
    recentAttractions,
    recentCulinaries,
    recentAccommodations,
}: Props) {
    return (
        <ManagerLayout title="Dashboard" village={village}>
            <PageHeader
                title={`Selamat datang! 👋`}
                subtitle={`Kelola konten untuk ${village.name}`}
            />

            {/* Rejection Alert — Shadcn */}
            {stats.status === 'rejected' && stats.rejected_reason && (
                <Alert variant="destructive" className="mb-6">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Desa Ditolak</AlertTitle>
                    <AlertDescription>
                        {stats.rejected_reason}{' '}
                        <Link
                            href="/manager/village/edit"
                            className="font-semibold underline underline-offset-2"
                        >
                            Perbarui profil desa →
                        </Link>
                    </AlertDescription>
                </Alert>
            )}

            {/* Pending Notice — Shadcn */}
            {stats.status === 'pending' && (
                <Alert className="mb-6 border-amber-200 bg-amber-50 text-amber-800 [&>svg]:text-amber-600">
                    <Clock className="h-4 w-4" />
                    <AlertTitle>Menunggu Verifikasi</AlertTitle>
                    <AlertDescription>
                        Profil desa Anda sedang ditinjau oleh tim Singgah.
                        Biasanya membutuhkan 1–3 hari kerja.
                    </AlertDescription>
                </Alert>
            )}

            {/* Stats Grid */}
            <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
                <StatCard
                    icon={Package}
                    label="Total Konten"
                    value={stats.total_content}
                    sub={`${stats.events_count} acara · ${stats.attractions_count} atraksi`}
                />
                <StatCard
                    icon={Star}
                    label="Rata-rata Rating"
                    value={stats.avg_rating > 0 ? `${stats.avg_rating} ★` : '—'}
                    sub={`${stats.reviews_count} ulasan masuk`}
                    color="var(--singgah-earth-500)"
                    bgColor="var(--singgah-earth-50)"
                />
                <StatCard
                    icon={UtensilsCrossed}
                    label="Kuliner & UMKM"
                    value={stats.culinaries_count}
                    color="var(--singgah-teal-600)"
                    bgColor="var(--singgah-teal-50)"
                />
                <StatCard
                    icon={BedDouble}
                    label="Akomodasi"
                    value={stats.accommodations_count}
                    color="#7c3aed"
                    bgColor="#f3f0ff"
                />
            </div>

            {/* Village Status Summary */}
            <div className="mb-8 flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                <div className="flex-1">
                    <p className="mb-1 text-xs font-semibold tracking-wide text-gray-400 uppercase">
                        Status Desa
                    </p>
                    <div className="flex items-center gap-2">
                        <p className="font-bold text-gray-800">
                            {village.name}
                        </p>
                        {(statusBadge as any)[village.status]}
                    </div>
                </div>
                <Link
                    href="/manager/village/edit"
                    className="shrink-0 text-sm font-semibold transition-colors hover:underline"
                    style={{ color: 'var(--singgah-green-600)' }}
                >
                    Edit Profil →
                </Link>
            </div>

            {/* Recent Content */}
            <p className="mb-4 text-sm font-bold tracking-wider text-gray-500 uppercase">
                Konten Terbaru
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <RecentList
                    title="Acara"
                    items={recentEvents}
                    createHref="/manager/events/create"
                    viewHref="/manager/events"
                    icon={CalendarDays}
                />
                <RecentList
                    title="Wisata & Atraksi"
                    items={recentAttractions}
                    createHref="/manager/attractions/create"
                    viewHref="/manager/attractions"
                    icon={MapPin}
                />
                <RecentList
                    title="Kuliner & UMKM"
                    items={recentCulinaries}
                    createHref="/manager/culinaries/create"
                    viewHref="/manager/culinaries"
                    icon={UtensilsCrossed}
                />
                <RecentList
                    title="Akomodasi"
                    items={recentAccommodations}
                    createHref="/manager/accommodations/create"
                    viewHref="/manager/accommodations"
                    icon={BedDouble}
                />
            </div>
        </ManagerLayout>
    );
}

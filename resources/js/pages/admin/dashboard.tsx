import { Link, router } from '@inertiajs/react';
import {
    BedDouble,
    Building2,
    CalendarDays,
    CheckCircle2,
    Clock,
    MapPin,
    MessageSquare,
    ShieldAlert,
    Star,
    TrendingUp,
    Users,
    UtensilsCrossed,
    XCircle,
} from 'lucide-react';

import AdminLayout from '@/layouts/AdminLayout';
import PageHeader from '@/components/manager/PageHeader';

interface Props {
    userStats: {
        total: number;
        admins: number;
        managers: number;
        users: number;
    };
    villageStats: {
        total: number;
        verified: number;
        pending: number;
        rejected: number;
        featured: number;
    };
    contentStats: {
        events: number;
        attractions: number;
        culinaries: number;
        accommodations: number;
        reviews: number;
    };
    pendingVillages: {
        id: number;
        name: string;
        slug: string;
        manager: { name: string; email: string } | null;
        created_at: string;
    }[];
    recentUsers: {
        id: number;
        name: string;
        email: string;
        role: string;
        created_at: string;
    }[];
}

function StatCard({
    icon: Icon,
    label,
    value,
    sub,
    color,
}: {
    icon: any;
    label: string;
    value: number;
    sub?: string;
    color: string;
}) {
    return (
        <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${color}`}
            >
                <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
                <p className="truncate text-xs font-medium text-gray-500">
                    {label}
                </p>
                <p className="text-2xl font-bold text-gray-800">
                    {value.toLocaleString('id-ID')}
                </p>
                {sub && <p className="mt-0.5 text-xs text-gray-400">{sub}</p>}
            </div>
        </div>
    );
}

const roleBadge: Record<string, string> = {
    admin: 'bg-red-100 text-red-700',
    manager: 'bg-emerald-100 text-emerald-700',
    user: 'bg-blue-100 text-blue-700',
};

const roleLabel: Record<string, string> = {
    admin: 'Admin',
    manager: 'Pengelola',
    user: 'Pengguna',
};

export default function AdminDashboard({
    userStats,
    villageStats,
    contentStats,
    pendingVillages,
    recentUsers,
}: Props) {
    const handleVerify = (id: number) => {
        router.patch(`/admin/villages/${id}/verify`);
    };

    return (
        <AdminLayout title="Dashboard">
            <PageHeader
                title="Dashboard Admin"
                breadcrumbs={[{ label: 'Dashboard' }]}
            />

            {/* User Stats */}
            <section className="mb-8 space-y-4">
                <h2 className="text-xs font-bold tracking-wider text-gray-400 uppercase">
                    Pengguna Platform
                </h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <StatCard
                        icon={Users}
                        label="Total Pengguna"
                        value={userStats.total}
                        color="bg-blue-50 text-blue-600"
                    />
                    <StatCard
                        icon={ShieldAlert}
                        label="Administrator"
                        value={userStats.admins}
                        color="bg-red-50 text-red-600"
                    />
                    <StatCard
                        icon={Building2}
                        label="Pengelola Desa"
                        value={userStats.managers}
                        color="bg-emerald-50 text-emerald-600"
                    />
                    <StatCard
                        icon={Users}
                        label="Pengguna Biasa"
                        value={userStats.users}
                        color="bg-purple-50 text-purple-600"
                    />
                </div>
            </section>

            {/* Village Stats */}
            <section className="mb-8 space-y-4">
                <h2 className="text-xs font-bold tracking-wider text-gray-400 uppercase">
                    Status Desa
                </h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                    <StatCard
                        icon={Building2}
                        label="Total Desa"
                        value={villageStats.total}
                        color="bg-gray-100 text-gray-600"
                    />
                    <StatCard
                        icon={CheckCircle2}
                        label="Terverifikasi"
                        value={villageStats.verified}
                        color="bg-emerald-50 text-emerald-600"
                    />
                    <StatCard
                        icon={Clock}
                        label="Menunggu"
                        value={villageStats.pending}
                        color="bg-amber-50 text-amber-600"
                    />
                    <StatCard
                        icon={XCircle}
                        label="Ditolak"
                        value={villageStats.rejected}
                        color="bg-red-50 text-red-600"
                    />
                    <StatCard
                        icon={Star}
                        label="Unggulan"
                        value={villageStats.featured}
                        color="bg-yellow-50 text-yellow-600"
                    />
                </div>
            </section>

            {/* Content Stats */}
            <section className="mb-8 space-y-4">
                <h2 className="text-xs font-bold tracking-wider text-gray-400 uppercase">
                    Total Konten
                </h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                    <StatCard
                        icon={CalendarDays}
                        label="Acara"
                        value={contentStats.events}
                        color="bg-indigo-50 text-indigo-600"
                    />
                    <StatCard
                        icon={MapPin}
                        label="Wisata & Atraksi"
                        value={contentStats.attractions}
                        color="bg-teal-50 text-teal-600"
                    />
                    <StatCard
                        icon={UtensilsCrossed}
                        label="Kuliner & UMKM"
                        value={contentStats.culinaries}
                        color="bg-orange-50 text-orange-600"
                    />
                    <StatCard
                        icon={BedDouble}
                        label="Akomodasi"
                        value={contentStats.accommodations}
                        color="bg-sky-50 text-sky-600"
                    />
                    <StatCard
                        icon={MessageSquare}
                        label="Ulasan"
                        value={contentStats.reviews}
                        color="bg-pink-50 text-pink-600"
                    />
                </div>
            </section>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Pending Villages */}
                <div className="rounded-2xl border border-amber-100 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-amber-500" />
                            <h3 className="text-sm font-bold text-gray-800">
                                Desa Menunggu Verifikasi
                            </h3>
                            {villageStats.pending > 0 && (
                                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">
                                    {villageStats.pending}
                                </span>
                            )}
                        </div>
                        <Link
                            href="/admin/villages?status=pending"
                            className="text-xs font-semibold text-red-600 hover:underline"
                        >
                            Lihat semua
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {pendingVillages.length === 0 ? (
                            <p className="py-8 text-center text-sm text-gray-400">
                                Tidak ada desa yang menunggu verifikasi.
                            </p>
                        ) : (
                            pendingVillages.map((v) => (
                                <div
                                    key={v.id}
                                    className="flex items-center gap-3 px-5 py-3"
                                >
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold text-gray-800">
                                            {v.name}
                                        </p>
                                        <p className="truncate text-xs text-gray-400">
                                            {v.manager?.name ?? '—'}
                                        </p>
                                    </div>
                                    <div className="flex shrink-0 gap-1.5">
                                        <button
                                            onClick={() => handleVerify(v.id)}
                                            className="rounded-lg bg-emerald-500 px-2.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-emerald-600"
                                        >
                                            Verifikasi
                                        </button>
                                        <Link
                                            href={`/admin/villages/${v.id}/edit`}
                                            className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-semibold text-gray-600 transition-colors hover:bg-gray-50"
                                        >
                                            Detail
                                        </Link>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Recent Users */}
                <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-blue-500" />
                            <h3 className="text-sm font-bold text-gray-800">
                                Pengguna Terbaru
                            </h3>
                        </div>
                        <Link
                            href="/admin/users"
                            className="text-xs font-semibold text-red-600 hover:underline"
                        >
                            Lihat semua
                        </Link>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {recentUsers.map((u) => (
                            <div
                                key={u.id}
                                className="flex items-center gap-3 px-5 py-3"
                            >
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-600">
                                    {u.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-gray-800">
                                        {u.name}
                                    </p>
                                    <p className="truncate text-xs text-gray-400">
                                        {u.email}
                                    </p>
                                </div>
                                <span
                                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${roleBadge[u.role]}`}
                                >
                                    {roleLabel[u.role]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

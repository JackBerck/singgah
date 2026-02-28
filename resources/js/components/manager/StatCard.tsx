import { type LucideIcon } from 'lucide-react';
import { type ReactNode } from 'react';

interface StatCardProps {
    icon: LucideIcon;
    label: string;
    value: string | number;
    sub?: string;
    color?: string;
    bgColor?: string;
}

export default function StatCard({
    icon: Icon,
    label,
    value,
    sub,
    color = 'var(--singgah-green-600)',
    bgColor = 'var(--singgah-green-50)',
}: StatCardProps) {
    return (
        <div className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
            <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                style={{ background: bgColor }}
            >
                <Icon className="h-5 w-5" style={{ color }} />
            </div>
            <div className="min-w-0 flex-1">
                <p className="mb-0.5 text-xs font-semibold tracking-wider text-gray-400 uppercase">
                    {label}
                </p>
                <p
                    className="text-2xl font-extrabold text-gray-900"
                    style={{ fontFamily: 'var(--font-jakarta)' }}
                >
                    {value}
                </p>
                {sub && <p className="mt-0.5 text-xs text-gray-500">{sub}</p>}
            </div>
        </div>
    );
}

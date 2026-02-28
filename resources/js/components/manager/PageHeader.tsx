import { Link } from '@inertiajs/react';
import { ChevronRight, type LucideIcon } from 'lucide-react';
import { type ReactNode } from 'react';

interface Breadcrumb {
    label: string;
    href?: string;
}

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    breadcrumbs?: Breadcrumb[];
    action?: ReactNode;
}

export default function PageHeader({
    title,
    subtitle,
    breadcrumbs,
    action,
}: PageHeaderProps) {
    return (
        <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <div>
                {breadcrumbs && breadcrumbs.length > 0 && (
                    <nav className="mb-2 flex items-center gap-1.5 text-xs text-gray-400">
                        {breadcrumbs.map((crumb, i) => (
                            <span key={i} className="flex items-center gap-1.5">
                                {i > 0 && <ChevronRight className="h-3 w-3" />}
                                {crumb.href ? (
                                    <Link
                                        href={crumb.href}
                                        className="transition-colors hover:text-gray-700"
                                    >
                                        {crumb.label}
                                    </Link>
                                ) : (
                                    <span className="font-medium text-gray-600">
                                        {crumb.label}
                                    </span>
                                )}
                            </span>
                        ))}
                    </nav>
                )}
                <h1
                    className="text-xl leading-tight font-extrabold text-gray-900 md:text-2xl"
                    style={{ fontFamily: 'var(--font-jakarta)' }}
                >
                    {title}
                </h1>
                {subtitle && (
                    <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
                )}
            </div>
            {action && <div className="shrink-0">{action}</div>}
        </div>
    );
}

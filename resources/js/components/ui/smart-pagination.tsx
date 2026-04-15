import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface SmartPaginationProps {
    links: PaginationLink[];
    currentPage: number;
    lastPage: number;
    className?: string;
}

export default function SmartPagination({
    links,
    currentPage,
    lastPage,
    className = '',
}: SmartPaginationProps) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 640);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (links.length <= 3) return null; // Only prev, 1, next

    const prevLink = links[0];
    const nextLink = links[links.length - 1];

    if (isMobile) {
        // Mobile view: Prev [Drop down for current page/pages] Next
        // We will render Prev, a dropdown or just current page text, and Next
        return (
            <div className={`flex items-center justify-center gap-2 ${className}`}>
                {prevLink.url ? (
                    <Link
                        href={prevLink.url}
                        preserveState
                        preserveScroll
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-singgah-green-500"
                    >
                        <span className="sr-only">Previous</span>
                        <ChevronLeft className="h-5 w-5" />
                    </Link>
                ) : (
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-100 bg-gray-50 text-gray-300">
                        <ChevronLeft className="h-5 w-5" />
                    </span>
                )}

                <div className="flex h-10 px-4 items-center justify-center rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700">
                    Halaman {currentPage} dari {lastPage}
                </div>

                {nextLink.url ? (
                    <Link
                        href={nextLink.url}
                        preserveState
                        preserveScroll
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-singgah-green-500"
                    >
                        <span className="sr-only">Next</span>
                        <ChevronRight className="h-5 w-5" />
                    </Link>
                ) : (
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-100 bg-gray-50 text-gray-300">
                        <ChevronRight className="h-5 w-5" />
                    </span>
                )}
            </div>
        );
    }

    // Desktop View
    return (
        <div className={`flex items-center justify-center gap-1 ${className}`}>
            {links.map((link, index) => {
                const isPrev = index === 0;
                const isNext = index === links.length - 1;
                const isEllipsis = link.label === '...';

                if (isPrev) {
                    return link.url ? (
                        <Link
                            key={index}
                            href={link.url}
                            preserveState
                            preserveScroll
                            className="mr-2 flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-singgah-green-500"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Link>
                    ) : (
                        <span
                            key={index}
                            className="mr-2 flex h-9 w-9 items-center justify-center rounded-lg border border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </span>
                    );
                }

                if (isNext) {
                    return link.url ? (
                        <Link
                            key={index}
                            href={link.url}
                            preserveState
                            preserveScroll
                            className="ml-2 flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-singgah-green-500"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    ) : (
                        <span
                            key={index}
                            className="ml-2 flex h-9 w-9 items-center justify-center rounded-lg border border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </span>
                    );
                }

                if (isEllipsis) {
                    return (
                        <span
                            key={index}
                            className="flex h-9 w-9 items-center justify-center text-gray-400"
                        >
                            <MoreHorizontal className="h-4 w-4" />
                        </span>
                    );
                }

                return link.url ? (
                    <Link
                        key={index}
                        href={link.url}
                        preserveState
                        preserveScroll
                        className={`flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-singgah-green-500 ${
                            link.active
                                ? 'border-singgah-green-600 bg-singgah-green-600 text-white'
                                : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ) : (
                    <span
                        key={index}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-transparent px-3 py-2 text-sm font-medium text-gray-500"
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                );
            })}
        </div>
    );
}

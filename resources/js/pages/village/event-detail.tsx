import { Head, Link, usePage } from '@inertiajs/react';
import { Calendar, MapPin, ChevronRight } from 'lucide-react';
import PublicLayout from '@/layouts/PublicLayout';
import MediaGallery from '@/components/public/MediaGallery';
import BookmarkButton from '@/components/public/BookmarkButton';
import ShareButton from '@/components/public/ShareButton';
import { ExternalLink } from 'lucide-react';

interface MediaItem {
    id: number;
    file_path: string;
    type: 'image' | 'video';
    alt_text?: string;
}

interface Event {
    id: number;
    name: string;
    event_date: string;
    location: string | null;
    contact_info: string | null;
    map_url: string | null;
    description: string | null;
    media: MediaItem[];
}

interface Props {
    village: { id: number; name: string; slug: string };
    event: Event;
    isWishlisted?: boolean;
}

const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

export default function EventDetail({ village, event, isWishlisted = false }: Props) {
    const { auth } = usePage<{ auth: { user: { id: number } | null } }>().props;
    const isLoggedIn = !!auth?.user;
    return (
        <PublicLayout>
            <Head title={`${event.name} — ${village.name} — Singgah`} />

            {/* Breadcrumb */}
            <div className="section-padding-x border-b border-gray-100 bg-white pt-20 pb-3">
                <div className="container max-w-4xl">
                    <nav className="flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
                        <Link href="/" className="hover:text-gray-700">
                            Beranda
                        </Link>
                        <ChevronRight className="h-3 w-3" />
                        <Link href="/explore" className="hover:text-gray-700">
                            Jelajahi
                        </Link>
                        <ChevronRight className="h-3 w-3" />
                        <Link
                            href={`/desa/${village.slug}`}
                            className="hover:text-gray-700"
                        >
                            {village.name}
                        </Link>
                        <ChevronRight className="h-3 w-3" />
                        <span className="font-medium text-gray-800">
                            {event.name}
                        </span>
                    </nav>
                </div>
            </div>

            <section className="section-padding-x py-10">
                <div className="container max-w-3xl">
                    {/* Event badge */}
                    <span
                        className="mb-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white"
                        style={{ background: 'var(--singgah-green-600)' }}
                    >
                        📅 Event Desa
                    </span>

                    <div className="flex items-start justify-between gap-4">
                        <h1
                            className="mb-4 text-3xl leading-tight font-extrabold text-gray-900"
                            style={{ fontFamily: 'var(--font-jakarta)' }}
                        >
                            {event.name}
                        </h1>
                        <div className="flex shrink-0 gap-1 -mt-2 -mr-2">
                            <ShareButton
                                url={typeof window !== 'undefined' ? window.location.href : ''}
                                title={`${event.name} - Singgah`}
                            />
                            <BookmarkButton
                                type="event"
                                id={event.id}
                                initialWishlisted={isWishlisted}
                                isLoggedIn={isLoggedIn}
                            />
                        </div>
                    </div>

                    {/* Meta info */}
                    <div className="mb-6 flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar
                                className="h-4 w-4"
                                style={{ color: 'var(--singgah-green-600)' }}
                            />
                            {fmtDate(event.event_date)}
                        </div>
                        {event.location && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin
                                    className="h-4 w-4"
                                    style={{
                                        color: 'var(--singgah-green-600)',
                                    }}
                                />
                                {event.location}
                            </div>
                        )}
                    </div>

                    {/* Gallery */}
                    {event.media.length > 0 && (
                        <div className="mb-8">
                            <MediaGallery media={event.media} maxVisible={5} />
                        </div>
                    )}

                    {/* Description */}
                    {event.description && (
                        <div
                            className="prose mb-8 leading-relaxed text-gray-600"
                            dangerouslySetInnerHTML={{
                                __html: event.description,
                            }}
                        />
                    )}

                    {/* Contact info and Maps */}
                    {(event.contact_info || event.map_url) && (
                        <div className="mb-8 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                            {event.contact_info && (
                                <div className="mb-4">
                                    <p className="mb-1 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                                        Kontak
                                    </p>
                                    <p className="text-sm text-gray-800">
                                        <a href={`https://wa.me/${event.contact_info.replace(/^0/, '62')}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                            {event.contact_info}
                                        </a>
                                    </p>
                                </div>
                            )}
                            {event.map_url && (
                                <div>
                                    <p className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">
                                        Google Maps
                                    </p>
                                    <a
                                        href={event.map_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:border-(--singgah-green-400) hover:bg-(--singgah-green-50)"
                                        style={{ color: 'var(--singgah-green-700)' }}
                                    >
                                        <span>Buka Peta Lokasi</span>
                                        <ExternalLink className="h-3 w-3" />
                                    </a>
                                </div>
                            )}
                        </div>
                    )}

                    <Link
                        href={`/desa/${village.slug}`}
                        className="flex items-center gap-2 rounded-2xl border border-gray-100 bg-white p-4 text-sm font-medium transition-shadow hover:shadow-md"
                        style={{ color: 'var(--singgah-green-700)' }}
                    >
                        <ChevronRight className="h-4 w-4 rotate-180" />
                        Kembali ke {village.name}
                    </Link>
                </div>
            </section>
        </PublicLayout>
    );
}

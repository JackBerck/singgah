import { useState, useRef, useEffect } from 'react';
import { Share2, Link as LinkIcon, Twitter, Facebook, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ShareButtonProps {
    url: string;
    title: string;
    description?: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export default function ShareButton({
    url,
    title,
    description = '',
    size = 'md',
    className = '',
}: ShareButtonProps) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open]);

    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const encodedDesc = encodeURIComponent(description);

    const shareLinks = {
        whatsapp: `https://wa.me/?text=${encodedTitle}%0A${encodedUrl}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    };

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(url);
            toast.success('Tautan disalin ke clipboard!');
            setOpen(false);
        } catch (err) {
            toast.error('Gagal menyalin tautan');
        }
    };

    const handleWebShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: description,
                    url: url,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            setOpen(!open);
        }
    };

    const iconSizes = {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6',
    };

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            <button
                onClick={handleWebShare}
                title="Bagikan"
                className={`flex items-center justify-center rounded-full p-2.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 ${open ? 'bg-gray-100 text-gray-900' : ''} ${className}`}
                aria-label="Bagikan"
            >
                <Share2 className={`${iconSizes[size]}`} />
            </button>

            {open && (
                <div className="absolute right-0 top-full z-50 mt-2 w-48 origin-top-right rounded-xl border border-gray-100 bg-white p-2 shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="grid gap-1">
                        <a
                            href={shareLinks.whatsapp}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setOpen(false)}
                        >
                            <MessageCircle className="h-4 w-4 text-[#25D366]" />
                            WhatsApp
                        </a>
                        <a
                            href={shareLinks.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setOpen(false)}
                        >
                            <Facebook className="h-4 w-4 text-[#1877F2]" />
                            Facebook
                        </a>
                        <a
                            href={shareLinks.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setOpen(false)}
                        >
                            <Twitter className="h-4 w-4 text-[#1DA1F2]" />
                            Twitter / X
                        </a>
                        <a
                            href={shareLinks.telegram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setOpen(false)}
                        >
                            {/* Simple Telegram icon since lucide doesn't have a perfect brand icon */}
                            <svg className="h-4 w-4 text-[#0088cc]" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.21-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.62-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
                            </svg>
                            Telegram
                        </a>
                        <div className="my-1 h-px bg-gray-100"></div>
                        <button
                            onClick={copyLink}
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                        >
                            <LinkIcon className="h-4 w-4 text-gray-500" />
                            Salin Link
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

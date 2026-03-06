import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, ChevronDown, Loader2, Send, Sparkles, X } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
    id: number;
    role: 'user' | 'assistant';
    content: string;
    error?: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const GREETING: Message = {
    id: 0,
    role: 'assistant',
    content:
        `Halo! Saya Asisten Wisata Singgah 🌿\n\nSaya bisa membantu kamu menemukan rekomendasi desa wisata, kuliner lokal, akomodasi, dan event menarik. Coba tanya sesuatu seperti:\n\n• "Ada desa wisata alam di daerah mana?"\n\n• "Rekomendasikan kuliner khas yang murah"\n\n• "Cari penginapan dengan pemandangan sawah"`,
};

let msgIdCounter = 1;
const nextId = () => msgIdCounter++;

// ─── Typing Indicator ─────────────────────────────────────────────────────────

function TypingIndicator() {
    return (
        <div className="flex items-end gap-2">
            {/* Bot avatar */}
            <div
                className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full"
                style={{ background: 'var(--singgah-green-600)' }}
            >
                <Bot className="h-3.5 w-3.5 text-white" />
            </div>
            <div
                className="rounded-2xl rounded-bl-sm px-4 py-3"
                style={{
                    background: 'var(--singgah-green-50)',
                    border: '1px solid var(--singgah-green-100)',
                }}
            >
                <span className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                        <span
                            key={i}
                            className="h-1.5 w-1.5 rounded-full"
                            style={{
                                background: 'var(--singgah-green-500)',
                                animation: `chatDotBounce 1.2s ${i * 0.2}s infinite ease-in-out`,
                            }}
                        />
                    ))}
                </span>
            </div>
        </div>
    );
}

// ─── Message Bubble ───────────────────────────────────────────────────────────

function MessageBubble({ msg }: { msg: Message }) {
    const isUser = msg.role === 'user';

    if (isUser) {
        return (
            <div className="flex justify-end">
                <div
                    className="max-w-[82%] rounded-2xl rounded-br-sm px-4 py-2.5 text-sm leading-relaxed text-white"
                    style={{ background: 'var(--singgah-green-600)' }}
                >
                    {msg.content}
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-end gap-2">
            {/* Bot avatar */}
            <div
                className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full"
                style={{
                    background: msg.error
                        ? '#ef4444'
                        : 'var(--singgah-green-600)',
                }}
            >
                <Bot className="h-3.5 w-3.5 text-white" />
            </div>
            <div
                className="max-w-[82%] rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm leading-relaxed"
                style={{
                    background: msg.error
                        ? '#fef2f2'
                        : 'var(--singgah-green-50)',
                    border: `1px solid ${msg.error ? '#fecaca' : 'var(--singgah-green-100)'}`,
                    color: msg.error ? '#dc2626' : '#1a2e1e',
                }}
            >
                {/* Menggunakan ReactMarkdown untuk merender balasan AI */}
                <ReactMarkdown
                    components={{
                        // Styling kustom untuk elemen Markdown agar rapi
                        p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                        strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
                        ul: ({ node, ...props }) => <ul className="mb-2 ml-4 list-disc last:mb-0" {...props} />,
                        ol: ({ node, ...props }) => <ol className="mb-2 ml-4 list-decimal last:mb-0" {...props} />,
                        li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                        a: ({ node, ...props }) => (
                            <a className="text-[var(--singgah-green-600)] underline underline-offset-2" target="_blank" rel="noreferrer" {...props} />
                        ),
                    }}
                >
                    {msg.content}
                </ReactMarkdown>
            </div>
        </div>
    );
}

// ─── Main Widget ──────────────────────────────────────────────────────────────

export default function AiChatWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([GREETING]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [unread, setUnread] = useState(false);

    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        if (open) {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, loading, open]);

    // Focus input when panel opens
    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 150);
            setUnread(false);
        }
    }, [open]);

    const sendMessage = async () => {
        const text = input.trim();
        if (!text || loading) return;

        const userMsg: Message = { id: nextId(), role: 'user', content: text };
        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const { data } = await axios.post('/ai/chat', { message: text });

            if (data.error) {
                throw new Error(data.error);
            }

            const aiMsg: Message = {
                id: nextId(),
                role: 'assistant',
                content: data.reply,
            };
            setMessages((prev) => [...prev, aiMsg]);

            if (!open) setUnread(true);
        } catch (err: any) {
            const errText =
                err?.response?.data?.error ||
                err?.message ||
                'Gagal menghubungi asisten AI. Silakan coba lagi.';

            // Show toast if the panel is closed
            if (!open) {
                toast.error(errText);
            }

            setMessages((prev) => [
                ...prev,
                {
                    id: nextId(),
                    role: 'assistant',
                    content: errText,
                    error: true,
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            {/* CSS keyframes injected inline */}
            <style>{`
                @keyframes chatDotBounce {
                    0%, 80%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-6px); }
                }
                @keyframes chatSlideUp {
                    from { opacity: 0; transform: translateY(16px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes chatFabPop {
                    0%   { transform: scale(0.8); opacity: 0; }
                    70%  { transform: scale(1.08); }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>

            {/* ── Panel ──────────────────────────────────────────────────────── */}
            {open && (
                <div
                    ref={panelRef}
                    className="fixed right-4 bottom-24 z-200 flex w-[360px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-3xl shadow-2xl min-h-[400px]"
                    style={{
                        animation: 'chatSlideUp 0.22s ease',
                        border: '1.5px solid var(--singgah-green-200)',
                        background: 'white',
                    }}
                >
                    {/* Header */}
                    <div
                        className="flex items-center gap-3 px-4 py-3"
                        style={{ background: 'var(--singgah-green-700)' }}
                    >
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                            <Sparkles className="h-4.5 w-4.5 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm leading-tight font-bold text-white">
                                Asisten Wisata Singgah
                            </p>
                            <span
                                className="flex items-center gap-1 text-xs"
                                style={{ color: 'rgba(255,255,255,0.75)' }}
                            >
                                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />
                                Online — siap membantu
                            </span>
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            className="flex h-7 w-7 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/15 hover:text-white"
                            aria-label="Tutup chat"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Message list */}
                    <div
                        className="flex flex-col gap-3 overflow-y-auto p-4"
                        style={{ flex: '1 1 0', minHeight: 0 }}
                    >
                        {messages.map((msg) => (
                            <MessageBubble key={msg.id} msg={msg} />
                        ))}
                        {loading && <TypingIndicator />}
                        <div ref={bottomRef} />
                    </div>

                    {/* Input bar */}
                    <div
                        className="flex items-end gap-2 border-t px-3 py-2.5"
                        style={{ borderColor: 'var(--singgah-green-100)' }}
                    >
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Tanyakan rekomendasi wisata…"
                            disabled={loading}
                            rows={1}
                            maxLength={500}
                            className="flex-1 resize-none rounded-2xl border border-gray-200 bg-gray-50 px-3.5 py-2 text-sm transition-all outline-none placeholder:text-gray-400 focus:border-[var(--singgah-green-400)] focus:bg-white disabled:opacity-60"
                            style={{ maxHeight: '100px', lineHeight: '1.5' }}
                            onInput={(e) => {
                                // auto-resize
                                const el = e.currentTarget;
                                el.style.height = 'auto';
                                el.style.height = `${Math.min(el.scrollHeight, 100)}px`;
                            }}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={loading || !input.trim()}
                            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full transition-all duration-150 disabled:opacity-40"
                            style={{ background: 'var(--singgah-green-600)' }}
                            aria-label="Kirim pesan"
                        >
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin text-white" />
                            ) : (
                                <Send className="h-4 w-4 text-white" />
                            )}
                        </button>
                    </div>

                    {/* Footer hint */}
                    <p
                        className="pb-2 text-center text-[10px]"
                        style={{ color: 'var(--singgah-green-400)' }}
                    >
                        Enter untuk kirim · Shift+Enter untuk baris baru
                    </p>
                </div>
            )}

            {/* ── FAB Button ─────────────────────────────────────────────────── */}
            <button
                onClick={() => {
                    setOpen((v) => !v);
                    setUnread(false);
                }}
                aria-label={open ? 'Tutup chat' : 'Buka Asisten Wisata'}
                className="fixed right-4 bottom-5 z-[200] flex h-14 w-14 items-center justify-center rounded-full shadow-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xl focus:ring-4 focus:ring-[var(--singgah-green-200)] focus:outline-none"
                style={{
                    background: open ? '#374151' : 'var(--singgah-green-700)',
                    animation: 'chatFabPop 0.3s ease',
                }}
            >
                {open ? (
                    <ChevronDown className="h-6 w-6 text-white" />
                ) : (
                    <Bot className="h-6 w-6 text-white" />
                )}

                {/* Unread badge */}
                {unread && !open && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                        !
                    </span>
                )}
            </button>
        </>
    );
}

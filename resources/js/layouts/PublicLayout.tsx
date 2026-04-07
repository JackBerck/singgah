import type { ReactNode } from 'react';

import Footer from '@/components/public/footer';
import Navbar from '@/components/public/navbar';
import AiChatWidget from '@/components/public/AiChatWidget';
import { Toaster } from '@/components/sooner';

interface PublicLayoutProps {
    children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
    return (
        <div className="flex min-h-screen w-full flex-col overflow-x-hidden">
            <Toaster richColors />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <AiChatWidget />
        </div>
    );
}

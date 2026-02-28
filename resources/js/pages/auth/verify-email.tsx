import { Form, Head } from '@inertiajs/react';
import { MailCheck } from 'lucide-react';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { logout } from '@/routes';
import { send } from '@/routes/verification';

export default function VerifyEmail({ status }: { status?: string }) {
    return (
        <AuthLayout
            title="Verifikasi Email Anda"
            description="Kami telah mengirimkan tautan verifikasi ke email Anda. Klik tautan tersebut untuk mengaktifkan akun."
        >
            <Head title="Verifikasi Email" />

            {status === 'verification-link-sent' && (
                <div
                    className="mb-5 flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium"
                    style={{
                        background: 'var(--singgah-green-50)',
                        color: 'var(--singgah-green-700)',
                        border: '1px solid var(--singgah-green-200)',
                    }}
                >
                    <MailCheck className="h-4 w-4 shrink-0" />
                    Tautan verifikasi baru telah dikirim ke alamat email yang
                    Anda daftarkan.
                </div>
            )}

            {/* Illustration */}
            <div
                className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl"
                style={{ background: 'var(--singgah-green-100)' }}
            >
                <MailCheck
                    className="h-8 w-8"
                    style={{ color: 'var(--singgah-green-600)' }}
                />
            </div>

            <Form {...send.form()} className="space-y-4">
                {({ processing }) => (
                    <>
                        <Button
                            className="w-full rounded-full font-semibold text-white"
                            style={{ background: 'var(--singgah-green-600)' }}
                            disabled={processing}
                        >
                            {processing && <Spinner />}
                            Kirim Ulang Email Verifikasi
                        </Button>

                        <div className="text-center">
                            <TextLink
                                href={logout()}
                                className="text-sm font-medium transition-colors"
                                style={{ color: 'var(--singgah-green-600)' }}
                            >
                                Keluar dari akun
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}

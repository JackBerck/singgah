import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { email } from '@/routes/password';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <AuthLayout
            title="Lupa Kata Sandi?"
            description="Masukkan alamat email Anda dan kami akan mengirimkan tautan untuk mereset kata sandi"
        >
            <Head title="Lupa Kata Sandi" />

            {status && (
                <div
                    className="mb-5 rounded-xl px-4 py-3 text-sm font-medium"
                    style={{
                        background: 'var(--singgah-green-50)',
                        color: 'var(--singgah-green-700)',
                        border: '1px solid var(--singgah-green-200)',
                    }}
                >
                    {status}
                </div>
            )}

            <div className="space-y-5">
                <Form {...email.form()}>
                    {({ processing, errors }) => (
                        <div className="space-y-5">
                            <div className="grid gap-1.5">
                                <Label
                                    htmlFor="email"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Alamat Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="off"
                                    autoFocus
                                    placeholder="contoh@email.com"
                                    className="focus-visible:ring-[var(--singgah-green-600)]"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <Button
                                className="w-full rounded-full font-semibold text-white"
                                style={{
                                    background: 'var(--singgah-green-600)',
                                }}
                                disabled={processing}
                                data-test="email-password-reset-link-button"
                            >
                                {processing && <Spinner />}
                                Kirim Tautan Reset
                            </Button>
                        </div>
                    )}
                </Form>

                <div className="text-center text-sm text-gray-500">
                    Ingat kata sandi?{' '}
                    <TextLink
                        href={login()}
                        className="font-semibold transition-colors"
                        style={{ color: 'var(--singgah-green-600)' }}
                    >
                        Kembali masuk
                    </TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}

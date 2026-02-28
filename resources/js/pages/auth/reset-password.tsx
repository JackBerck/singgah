import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { update } from '@/routes/password';

type Props = {
    token: string;
    email: string;
};

export default function ResetPassword({ token, email }: Props) {
    return (
        <AuthLayout
            title="Buat Kata Sandi Baru"
            description="Masukkan kata sandi baru Anda di bawah ini"
        >
            <Head title="Reset Kata Sandi" />

            <Form
                {...update.form()}
                transform={(data) => ({ ...data, token, email })}
                resetOnSuccess={['password', 'password_confirmation']}
            >
                {({ processing, errors }) => (
                    <div className="grid gap-5">
                        {/* Email (read-only) */}
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
                                autoComplete="email"
                                value={email}
                                readOnly
                                className="bg-gray-50 text-gray-500 focus-visible:ring-[var(--singgah-green-600)]"
                            />
                            <InputError message={errors.email} />
                        </div>

                        {/* Kata sandi baru */}
                        <div className="grid gap-1.5">
                            <Label
                                htmlFor="password"
                                className="text-sm font-medium text-gray-700"
                            >
                                Kata Sandi Baru
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                autoComplete="new-password"
                                autoFocus
                                placeholder="Minimal 8 karakter"
                                className="focus-visible:ring-[var(--singgah-green-600)]"
                            />
                            <InputError message={errors.password} />
                        </div>

                        {/* Konfirmasi */}
                        <div className="grid gap-1.5">
                            <Label
                                htmlFor="password_confirmation"
                                className="text-sm font-medium text-gray-700"
                            >
                                Konfirmasi Kata Sandi
                            </Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                autoComplete="new-password"
                                placeholder="Ulangi kata sandi baru"
                                className="focus-visible:ring-[var(--singgah-green-600)]"
                            />
                            <InputError
                                message={errors.password_confirmation}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="mt-1 w-full rounded-full font-semibold text-white"
                            style={{ background: 'var(--singgah-green-600)' }}
                            disabled={processing}
                            data-test="reset-password-button"
                        >
                            {processing && <Spinner />}
                            Simpan Kata Sandi
                        </Button>
                    </div>
                )}
            </Form>
        </AuthLayout>
    );
}

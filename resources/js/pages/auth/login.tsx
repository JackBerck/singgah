import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
};

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: Props) {
    return (
        <AuthLayout
            title="Masuk ke Akun Anda"
            description="Masukkan email dan kata sandi Anda untuk melanjutkan"
        >
            <Head title="Masuk" />

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

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-5"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-5">
                            {/* Email */}
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
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="contoh@email.com"
                                    className="focus-visible:ring-[var(--singgah-green-600)]"
                                />
                                <InputError message={errors.email} />
                            </div>

                            {/* Password */}
                            <div className="grid gap-1.5">
                                <div className="flex items-center justify-between">
                                    <Label
                                        htmlFor="password"
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        Kata Sandi
                                    </Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="text-xs font-medium transition-colors"
                                            style={{
                                                color: 'var(--singgah-green-600)',
                                            }}
                                            tabIndex={5}
                                        >
                                            Lupa kata sandi?
                                        </TextLink>
                                    )}
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Kata sandi Anda"
                                    className="focus-visible:ring-[var(--singgah-green-600)]"
                                />
                                <InputError message={errors.password} />
                            </div>

                            {/* Remember me */}
                            <div className="flex items-center space-x-2.5">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                    className="data-[state=checked]:border-[var(--singgah-green-600)] data-[state=checked]:bg-[var(--singgah-green-600)]"
                                />
                                <Label
                                    htmlFor="remember"
                                    className="cursor-pointer text-sm text-gray-600"
                                >
                                    Ingat saya
                                </Label>
                            </div>

                            {/* Submit */}
                            <Button
                                type="submit"
                                className="mt-1 w-full rounded-full font-semibold text-white"
                                style={{
                                    background: 'var(--singgah-green-600)',
                                }}
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner />}
                                Masuk
                            </Button>
                        </div>

                        {canRegister && (
                            <div className="text-center text-sm text-gray-500">
                                Belum punya akun?{' '}
                                <TextLink
                                    href={register()}
                                    tabIndex={5}
                                    className="font-semibold transition-colors"
                                    style={{
                                        color: 'var(--singgah-green-600)',
                                    }}
                                >
                                    Daftar sekarang
                                </TextLink>
                            </div>
                        )}
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}

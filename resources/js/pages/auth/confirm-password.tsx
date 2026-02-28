import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { store } from '@/routes/password/confirm';

export default function ConfirmPassword() {
    return (
        <AuthLayout
            title="Konfirmasi Kata Sandi"
            description="Ini adalah area aman. Harap konfirmasi kata sandi Anda sebelum melanjutkan."
        >
            <Head title="Konfirmasi Kata Sandi" />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-5"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-1.5">
                            <Label
                                htmlFor="password"
                                className="text-sm font-medium text-gray-700"
                            >
                                Kata Sandi
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                placeholder="Kata sandi Anda"
                                autoComplete="current-password"
                                autoFocus
                                className="focus-visible:ring-[var(--singgah-green-600)]"
                            />
                            <InputError message={errors.password} />
                        </div>

                        <Button
                            className="w-full rounded-full font-semibold text-white"
                            style={{ background: 'var(--singgah-green-600)' }}
                            disabled={processing}
                            data-test="confirm-password-button"
                        >
                            {processing && <Spinner />}
                            Konfirmasi
                        </Button>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}

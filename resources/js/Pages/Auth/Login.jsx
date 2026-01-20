import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Log in" />
            <section
                className="relative flex min-h-screen items-center justify-center bg-black/70 px-4 py-6 text-white"
                style={{
                    backgroundImage:
                        'url(https://images.pexels.com/photos/34441449/pexels-photo-34441449.jpeg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div
                    className="absolute inset-0 bg-black/70"
                    aria-hidden="true"
                />
                <div className="relative z-10 w-full max-w-[480px]">
                    <div className="relative p-[2px] rounded-2xl bg-gradient-to-br from-neon-blue via-neon-purple to-neon-pink shadow-[0_0_20px_rgba(0,243,255,0.3)]">
                        <div className="rounded-[14px] bg-white/10 dark:bg-black/40 backdrop-blur-xl p-6 text-white shadow-2xl sm:p-8">
                            <h1 className="text-center text-3xl font-bold tracking-tight text-white drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]">
                                Sign in
                            </h1>
                            {status && (
                                <div className="mt-4 text-center text-sm font-medium text-neon-blue">
                                    {status}
                                </div>
                            )}
                            <form onSubmit={submit} className="mt-8 space-y-6">
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="mb-2 block text-sm font-medium text-gray-200"
                                    >
                                        Email
                                    </label>
                                    <div className="relative flex items-center">
                                        <TextInput
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            className="w-full border border-white/20 bg-white/5 px-4 py-3 pr-10 text-sm text-white placeholder-gray-400 backdrop-blur-md transition-all focus:border-neon-blue focus:ring-1 focus:ring-neon-blue"
                                            autoComplete="username"
                                            isFocused={true}
                                            onChange={(e) =>
                                                setData('email', e.target.value)
                                            }
                                            placeholder="Enter email"
                                            required
                                        />
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            className="absolute right-4 h-4 w-4 text-gray-400"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle cx="10" cy="7" r="6" />
                                            <path d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z" />
                                        </svg>
                                    </div>
                                    <InputError
                                        message={errors.email}
                                        className="mt-2 text-neon-pink"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="mb-2 block text-sm font-medium text-gray-200"
                                    >
                                        Password
                                    </label>
                                    <div className="relative flex items-center">
                                        <TextInput
                                            id="password"
                                            type="password"
                                            name="password"
                                            value={data.password}
                                            className="w-full border border-white/20 bg-white/5 px-4 py-3 pr-10 text-sm text-white placeholder-gray-400 backdrop-blur-md transition-all focus:border-neon-purple focus:ring-1 focus:ring-neon-purple"
                                            autoComplete="current-password"
                                            onChange={(e) =>
                                                setData('password', e.target.value)
                                            }
                                            placeholder="Enter password"
                                            required
                                        />
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            className="absolute right-4 h-4 w-4 cursor-pointer text-gray-400"
                                            viewBox="0 0 128 128"
                                        >
                                            <path d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z" />
                                        </svg>
                                    </div>
                                    <InputError
                                        message={errors.password}
                                        className="mt-2 text-neon-pink"
                                    />
                                </div>
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    <label className="flex items-center">
                                        <Checkbox
                                            id="remember-me"
                                            name="remember"
                                            checked={data.remember}
                                            onChange={(e) =>
                                                setData(
                                                    'remember',
                                                    e.target.checked,
                                                )
                                            }
                                            className="h-4 w-4 shrink-0 border-white/20 bg-white/5 text-neon-blue focus:ring-neon-blue"
                                        />
                                        <span className="ml-3 text-sm text-gray-200">
                                            Remember me
                                        </span>
                                    </label>
                                    {canResetPassword && (
                                        <div className="text-sm">
                                            <Link
                                                href={route('password.request')}
                                                className="font-semibold text-neon-blue hover:text-neon-purple transition-colors"
                                            >
                                                Forgot your password?
                                            </Link>
                                        </div>
                                    )}
                                </div>
                                <div className="!mt-12">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full cursor-pointer rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple px-4 py-3 text-[15px] font-bold tracking-wide text-white shadow-[0_0_15px_rgba(0,243,255,0.4)] transition-all hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(0,243,255,0.6)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
                                    >
                                        Sign in
                                    </button>
                                </div>
                                <p className="!mt-6 text-center text-sm text-gray-300">
                                    Don&apos;t have an account?
                                    <Link
                                        href={route('register')}
                                        className="ml-1 whitespace-nowrap font-bold text-neon-blue hover:text-neon-pink transition-colors"
                                    >
                                        Register here
                                    </Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

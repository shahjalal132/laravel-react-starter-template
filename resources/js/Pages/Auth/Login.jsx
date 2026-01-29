import GuestLayout from '@/Layouts/GuestLayout';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function Login({ status, canResetPassword }) {
    const { t } = useTranslation('auth');

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
        <GuestLayout>
            <Head title={t('login.title')} />
            <h1 className="text-center text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {t('login.heading')}
            </h1>
            {status && (
                <div className="mt-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-4 py-3 text-center text-sm font-medium text-green-700 dark:text-green-400">
                    {status}
                </div>
            )}
            <form onSubmit={submit} className="mt-8 space-y-5">
                <div>
                    <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200"
                    >
                        {t('login.email')}
                    </label>
                    <div className="relative flex items-center">
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 px-4 py-3 pr-10 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-colors"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) =>
                                setData('email', e.target.value)
                            }
                            placeholder={t('login.email_placeholder')}
                            required
                        />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="absolute right-4 h-5 w-5 text-gray-400 dark:text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                        </svg>
                    </div>
                    <InputError
                        message={errors.email}
                        className="mt-2"
                    />
                </div>
                <div>
                    <label
                        htmlFor="password"
                        className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200"
                    >
                        {t('login.password')}
                    </label>
                    <div className="relative flex items-center">
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 px-4 py-3 pr-10 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-colors"
                            autoComplete="current-password"
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            placeholder={t('login.password_placeholder')}
                            required
                        />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="absolute right-4 h-5 w-5 text-gray-400 dark:text-gray-500 cursor-pointer"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                        </svg>
                    </div>
                    <InputError
                        message={errors.password}
                        className="mt-2"
                    />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <label className="flex items-center group cursor-pointer">
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
                            className="h-4 w-4 shrink-0 border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-500 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700"
                        />
                        <span className="ml-3 text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                            {t('login.remember_me')}
                        </span>
                    </label>
                    {canResetPassword && (
                        <div className="text-sm">
                            <Link
                                href={route('password.request')}
                                className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                            >
                                {t('login.forgot_password')}
                            </Link>
                        </div>
                    )}
                </div>
                <div className="!mt-10">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full cursor-pointer rounded-lg bg-blue-600 dark:bg-blue-500 px-4 py-3 text-sm font-semibold tracking-wide text-white shadow-md hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-blue-600 dark:disabled:hover:bg-blue-500 transition-all"
                    >
                        {t('login.sign_in')}
                    </button>
                </div>
                <p className="!mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    {t('login.no_account')}{' '}
                    <Link
                        href={route('register')}
                        className="whitespace-nowrap font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                        {t('login.register_link')}
                    </Link>
                </p>
            </form>
        </GuestLayout>
    );
}

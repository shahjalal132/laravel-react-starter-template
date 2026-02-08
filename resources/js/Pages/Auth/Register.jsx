import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function Register() {
    const { t } = useTranslation('auth');

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title={t('register.title')} />
            <h1 className="text-center text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {t('register.heading')}
            </h1>
            <form onSubmit={submit} className="mt-8 space-y-5">
                <div>
                    <label
                        htmlFor="name"
                        className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200"
                    >
                        {t('register.name')}
                    </label>
                    <div className="relative flex items-center">
                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 px-4 py-3 pr-10 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-colors"
                            autoComplete="name"
                            isFocused={true}
                            onChange={(e) =>
                                setData('name', e.target.value)
                            }
                            placeholder={t('register.name_placeholder')}
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
                        message={errors.name}
                        className="mt-2"
                    />
                </div>
                <div>
                    <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200"
                    >
                        {t('register.email')}
                    </label>
                    <div className="relative flex items-center">
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 px-4 py-3 pr-10 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-colors"
                            autoComplete="username"
                            onChange={(e) =>
                                setData('email', e.target.value)
                            }
                            placeholder={t('register.email_placeholder')}
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
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
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
                        {t('register.password')}
                    </label>
                    <div className="relative flex items-center">
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 px-4 py-3 pr-10 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-colors"
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            placeholder={t('register.password_placeholder')}
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
                <div>
                    <label
                        htmlFor="password_confirmation"
                        className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200"
                    >
                        {t('register.confirm_password')}
                    </label>
                    <div className="relative flex items-center">
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700/50 px-4 py-3 pr-10 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 transition-colors"
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData(
                                    'password_confirmation',
                                    e.target.value,
                                )
                            }
                            placeholder={t('register.confirm_password_placeholder')}
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
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>
                <div className="!mt-10">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full cursor-pointer rounded-lg bg-blue-600 dark:bg-blue-500 px-4 py-3 text-sm font-semibold tracking-wide text-white shadow-md hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:bg-blue-600 dark:disabled:hover:bg-blue-500 transition-all"
                    >
                        {t('register.register_button')}
                    </button>
                </div>
                <p className="!mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                    {t('register.already_registered')}{' '}
                    <Link
                        href={route('login')}
                        className="whitespace-nowrap font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    >
                        {t('login.sign_in')}
                    </Link>
                </p>
            </form>
        </GuestLayout>
    );
}

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
            <h1 className="text-center text-3xl font-semibold">
                {t('register.heading')}
            </h1>
            <form onSubmit={submit} className="mt-8 space-y-6">
                <div>
                    <label
                        htmlFor="name"
                        className="mb-2 block text-sm font-medium text-slate-900 dark:text-gray-100"
                    >
                        {t('register.name')}
                    </label>
                    <div className="relative flex items-center">
                        <TextInput
                            id="name"
                            name="name"
                            value={data.name}
                            className="w-full border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 pr-10 text-sm text-slate-900 dark:text-gray-100 outline-blue-600 dark:outline-blue-400"
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
                            fill="#bbb"
                            stroke="#bbb"
                            className="absolute right-4 h-4 w-4"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                cx="10"
                                cy="7"
                                r="6"
                                data-original="#000000"
                            />
                            <path
                                d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                                data-original="#000000"
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
                        className="mb-2 block text-sm font-medium text-slate-900 dark:text-gray-100"
                    >
                        {t('register.email')}
                    </label>
                    <div className="relative flex items-center">
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="w-full border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 pr-10 text-sm text-slate-900 dark:text-gray-100 outline-blue-600 dark:outline-blue-400"
                            autoComplete="username"
                            onChange={(e) =>
                                setData('email', e.target.value)
                            }
                            placeholder={t('register.email_placeholder')}
                            required
                        />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="#bbb"
                            stroke="#bbb"
                            className="absolute right-4 h-4 w-4"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                cx="10"
                                cy="7"
                                r="6"
                                data-original="#000000"
                            />
                            <path
                                d="M14 15H6a5 5 0 0 0-5 5 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 5 5 0 0 0-5-5zm8-4h-2.59l.3-.29a1 1 0 0 0-1.42-1.42l-2 2a1 1 0 0 0 0 1.42l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29H22a1 1 0 0 0 0-2z"
                                data-original="#000000"
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
                        className="mb-2 block text-sm font-medium text-slate-900 dark:text-gray-100"
                    >
                        {t('register.password')}
                    </label>
                    <div className="relative flex items-center">
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="w-full border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 pr-10 text-sm text-slate-900 dark:text-gray-100 outline-blue-600 dark:outline-blue-400"
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            placeholder={t('register.password_placeholder')}
                            required
                        />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="#bbb"
                            stroke="#bbb"
                            className="absolute right-4 h-4 w-4 cursor-pointer"
                            viewBox="0 0 128 128"
                        >
                            <path
                                d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
                                data-original="#000000"
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
                        className="mb-2 block text-sm font-medium text-slate-900 dark:text-gray-100"
                    >
                        {t('register.confirm_password')}
                    </label>
                    <div className="relative flex items-center">
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="w-full border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 pr-10 text-sm text-slate-900 dark:text-gray-100 outline-blue-600 dark:outline-blue-400"
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
                            fill="#bbb"
                            stroke="#bbb"
                            className="absolute right-4 h-4 w-4 cursor-pointer"
                            viewBox="0 0 128 128"
                        >
                            <path
                                d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z"
                                data-original="#000000"
                            />
                        </svg>
                    </div>
                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>
                <div className="!mt-12">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full cursor-pointer rounded-md bg-blue-600 dark:bg-blue-500 px-4 py-3 text-[15px] font-medium tracking-wide text-white transition hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {t('register.register_button')}
                    </button>
                </div>
                <p className="!mt-6 text-center text-sm text-slate-900 dark:text-gray-100">
                    {t('register.already_registered')}
                    <Link
                        href={route('login')}
                        className="ml-1 whitespace-nowrap font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                        {t('login.sign_in')}
                    </Link>
                </p>
            </form>
        </GuestLayout>
    );
}

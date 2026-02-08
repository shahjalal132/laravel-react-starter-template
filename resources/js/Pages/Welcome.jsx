import { Head, Link, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function Welcome({ auth }) {
    const { t } = useTranslation('welcome');
    const { settings, flash } = usePage().props;
    const isLoggedIn = Boolean(auth?.user);
    const user = auth?.user;
    const isSuspended = user?.suspended_until && new Date(user.suspended_until) > new Date();
    const backgroundImage = settings?.general?.background_image
        ? `/storage/${settings.general.background_image}`
        : null;

    return (
        <>
            <Head title="Welcome" />
            <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gray-900">
                {/* Background Image & Overlay */}
                {backgroundImage && (
                    <div
                        className="absolute inset-0 z-0"
                        style={{
                            backgroundImage: `url(${backgroundImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
                    </div>
                )}

                {/* Content */}
                <div className="relative z-10 w-full max-w-4xl px-6 text-center">
                    {isLoggedIn && isSuspended && (
                        <div className="mb-6 mx-auto max-w-2xl rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm font-medium text-red-700 dark:text-red-400">
                            <p className="font-semibold mb-2">Your account has been suspended.</p>
                            {user.suspension_reason && (
                                <p className="text-red-600 dark:text-red-300 whitespace-pre-wrap">
                                    {user.suspension_reason}
                                </p>
                            )}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-6 mx-auto max-w-2xl rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm font-medium text-red-700 dark:text-red-400">
                            <p className="font-semibold mb-2">{flash.error}</p>
                            {flash.suspension_reason && (
                                <p className="text-red-600 dark:text-red-300 whitespace-pre-wrap">
                                    {flash.suspension_reason}
                                </p>
                            )}
                        </div>
                    )}
                    <p className="mb-6 text-sm sm:text-base font-medium uppercase tracking-[0.4em] text-blue-400 animate-fade-in-up">
                        {t('label')}
                    </p>

                    <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-8 animate-fade-in-up delay-100">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-blue-200 drop-shadow-lg">
                            {t('title.line1')}
                        </span>
                        <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 drop-shadow-lg">
                            {t('title.line2')}
                        </span>
                    </h1>

                    <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-200">
                        {t('tagline')}
                    </p>

                    <div className="mt-12 flex flex-wrap items-center justify-center gap-6 animate-fade-in-up delay-300">
                        {isLoggedIn ? (
                            <Link
                                href="/admin/dashboard"
                                className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-semibold text-lg transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.5)] hover:shadow-[0_0_30px_rgba(37,99,235,0.7)] hover:-translate-y-1"
                            >
                                <span className="relative z-10">{t('buttons.dashboard')}</span>
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="group relative px-8 py-4 bg-white text-gray-900 rounded-full font-bold text-lg transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:-translate-y-1 hover:bg-gray-50"
                                >
                                    {t('buttons.login')}
                                </Link>
                                <Link
                                    href="/register"
                                    className="group relative px-8 py-4 bg-transparent border-2 border-white/30 text-white rounded-full font-bold text-lg transition-all duration-300 hover:bg-white/10 hover:border-white/50 hover:-translate-y-1 backdrop-blur-sm"
                                >
                                    {t('buttons.register')}
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

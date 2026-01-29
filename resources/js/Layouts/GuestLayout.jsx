import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    const { settings } = usePage().props;
    const logoUrl = settings?.general?.logo ? `/storage/${settings.general.logo}` : null;
    const backgroundImage = settings?.general?.background_image
        ? `/storage/${settings.general.background_image}`
        : null;

    return (
        <div className="relative flex min-h-screen flex-col items-center pt-6 sm:justify-center sm:pt-0 bg-gray-100 dark:bg-gray-900">
            {backgroundImage && (
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: `url(${backgroundImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <div className="absolute inset-0 bg-black/70" />
                </div>
            )}

            <div className="relative z-10 w-full flex flex-col items-center">
                <Link href="/">
                    <ApplicationLogo
                        url={logoUrl}
                        className="h-20 w-20 fill-current text-gray-500 dark:text-gray-400"
                    />
                </Link>
            </div>

            <div className="relative z-10 mt-6 w-full overflow-hidden bg-transparent px-6 py-4 sm:max-w-md">
                {children}
            </div>
        </div>
    );
}

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useRouter } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import PermissionForm from '@/Components/PermissionForm';
import PrimaryButton from '@/Components/PrimaryButton';
import { ArrowLeft } from 'lucide-react';

export default function CreatePermission() {
    const { t } = useTranslation('administration');
    const router = useRouter();

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-100">
                        {t('permissions.create')}
                    </h2>
                    <Link href={route('admin.administration.permissions.index')}>
                        <PrimaryButton>
                            <ArrowLeft size={16} className="mr-2" />
                            {t('common.back')}
                        </PrimaryButton>
                    </Link>
                </div>
            }
        >
            <Head title={t('permissions.create')} />

            <div className="py-12">
                <div className="sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <PermissionForm
                                onSubmit={() => {
                                    router.visit(route('admin.administration.permissions.index'));
                                }}
                                onCancel={() => {
                                    router.visit(route('admin.administration.permissions.index'));
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}


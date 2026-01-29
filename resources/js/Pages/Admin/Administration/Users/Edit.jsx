import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import UserForm from '@/Components/UserForm';
import PrimaryButton from '@/Components/PrimaryButton';
import { ArrowLeft } from 'lucide-react';

export default function EditUser({ user, roles }) {
    const { t } = useTranslation('administration');

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-100">
                        {t('users.edit')}
                    </h2>
                    <Link href={route('admin.administration.users.index')}>
                        <PrimaryButton>
                            <ArrowLeft size={16} className="mr-2" />
                            {t('common.back')}
                        </PrimaryButton>
                    </Link>
                </div>
            }
        >
            <Head title={t('users.edit')} />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <UserForm
                                user={user}
                                roles={roles}
                                onSubmit={() => {
                                    window.location.href = route('admin.administration.users.index');
                                }}
                                onCancel={() => {
                                    window.location.href = route('admin.administration.users.index');
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}


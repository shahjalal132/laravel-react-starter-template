import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DataTable from '@/Components/DataTable';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import Modal from '@/Components/Modal';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';

export default function PermissionsIndex({ permissions, filters }) {
    const { t } = useTranslation('administration');
    const { flash, auth } = usePage().props;
    const userPermissions = auth?.user?.permissions || [];
    const [search, setSearch] = useState(filters?.search || '');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [permissionToDelete, setPermissionToDelete] = useState(null);

    // Debounced search effect
    useEffect(() => {
        const timer = setTimeout(() => {
            router.get(
                route('admin.administration.permissions.index'),
                { search },
                {
                    preserveState: true,
                    replace: true,
                    preserveScroll: true,
                }
            );
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);

    const handleDelete = (permission) => {
        setPermissionToDelete(permission);
        setDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (permissionToDelete) {
            router.delete(route('admin.administration.permissions.destroy', permissionToDelete.id), {
                onSuccess: () => {
                    setDeleteModalOpen(false);
                    setPermissionToDelete(null);
                },
            });
        }
    };

    const columns = [
        {
            header: t('permissions.name'),
            accessor: 'name',
        },
    ];

    const actions = (permission) => (
        <div className="flex items-center gap-2">
            <Link
                href={route('admin.administration.permissions.edit', permission.id)}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
            >
                <Edit size={16} />
            </Link>
            <button
                onClick={() => handleDelete(permission)}
                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
            >
                <Trash2 size={16} />
            </button>
        </div>
    );

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-100">
                        {t('permissions.title')}
                    </h2>
                    {userPermissions.includes('create-permissions') && (
                        <PrimaryButton
                            onClick={() => router.visit(route('admin.administration.permissions.create'))}
                        >
                            <Plus size={16} className="mr-2" />
                            {t('permissions.createPermission')}
                        </PrimaryButton>
                    )}
                </div>
            }
        >
            <Head title={t('permissions.title')} />

            {flash?.success && (
                <div className="mb-4 bg-green-100 dark:bg-green-800 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-200 px-4 py-3 rounded relative">
                    {flash.success}
                </div>
            )}

            {flash?.error && (
                <div className="mb-4 bg-red-100 dark:bg-red-800 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 px-4 py-3 rounded relative">
                    {flash.error}
                </div>
            )}

            <div className="py-12">
                <div className="sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-6 flex gap-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                        <TextInput
                                            type="text"
                                            placeholder={t('permissions.search')}
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                            </div>

                            <DataTable
                                columns={columns}
                                data={permissions.data}
                                actions={actions}
                                emptyMessage={t('permissions.noPermissions')}
                            />

                            {permissions.links && permissions.links.length > 3 && (
                                <div className="mt-4 flex justify-center">
                                    <nav className="flex gap-2">
                                        {permissions.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`px-3 py-2 text-sm rounded-md ${link.active
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                    }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </nav>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                show={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setPermissionToDelete(null);
                }}
                title={t('permissions.deletePermission')}
            >
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {t('permissions.confirmDelete')}
                </p>
                <div className="flex items-center justify-end gap-4">
                    <SecondaryButton
                        onClick={() => {
                            setDeleteModalOpen(false);
                            setPermissionToDelete(null);
                        }}
                    >
                        {t('common.cancel')}
                    </SecondaryButton>
                    <DangerButton onClick={confirmDelete}>
                        {t('common.delete')}
                    </DangerButton>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}


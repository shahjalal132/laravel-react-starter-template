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

export default function RolesIndex({ roles, filters }) {
    const { t } = useTranslation('administration');
    const { flash, auth } = usePage().props;
    const permissions = auth?.user?.permissions || [];
    const [search, setSearch] = useState(filters?.search || '');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            router.get(
                route('admin.administration.roles.index'),
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

    const handleDelete = (role) => {
        setRoleToDelete(role);
        setDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (roleToDelete) {
            router.delete(route('admin.administration.roles.destroy', roleToDelete.id), {
                onSuccess: () => {
                    setDeleteModalOpen(false);
                    setRoleToDelete(null);
                },
            });
        }
    };

    const columns = [
        {
            header: t('roles.name'),
            accessor: 'name',
        },
        {
            header: t('roles.permissionsCount'),
            accessor: 'permissions_count',
        },
    ];

    const actions = (role) => (
        <div className="flex items-center gap-2">
            {permissions.includes('edit-roles') && (
                <Link
                    href={route('admin.administration.roles.edit', role.id)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                >
                    <Edit size={16} />
                </Link>
            )}
            {permissions.includes('delete-roles') && (
                <button
                    onClick={() => handleDelete(role)}
                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
                >
                    <Trash2 size={16} />
                </button>
            )}
        </div>
    );

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-100">
                        {t('roles.title')}
                    </h2>
                    {permissions.includes('create-roles') && (
                        <Link href={route('admin.administration.roles.create')}>
                            <PrimaryButton>
                                <Plus size={16} className="mr-2" />
                                {t('roles.createRole')}
                            </PrimaryButton>
                        </Link>
                    )}
                </div>
            }
        >
            <Head title={t('roles.title')} />

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
                                            placeholder={t('roles.search')}
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                            </div>

                            <DataTable
                                columns={columns}
                                data={roles.data}
                                actions={actions}
                                emptyMessage={t('roles.noRoles')}
                            />

                            {roles.links && roles.links.length > 3 && (
                                <div className="mt-4 flex justify-center">
                                    <nav className="flex gap-2">
                                        {roles.links.map((link, index) => (
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
                    setRoleToDelete(null);
                }}
                title={t('roles.deleteRole')}
            >
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {t('roles.confirmDelete')}
                </p>
                <div className="flex items-center justify-end gap-4">
                    <SecondaryButton
                        onClick={() => {
                            setDeleteModalOpen(false);
                            setRoleToDelete(null);
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


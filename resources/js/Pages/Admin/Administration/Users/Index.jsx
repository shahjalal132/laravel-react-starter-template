import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DataTable from '@/Components/DataTable';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import Select from '@/Components/Select';
import SuspendModal from '@/Components/SuspendModal';
import Modal from '@/Components/Modal';
import { Search, Plus, Edit, Trash2, Ban, UserCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function UsersIndex({ users, roles, filters }) {
    const { t } = useTranslation('administration');
    const { flash, auth } = usePage().props;
    const permissions = auth?.user?.permissions || [];
    const [search, setSearch] = useState(filters?.search || '');
    const [roleFilter, setRoleFilter] = useState(filters?.role || '');
    const [suspendedFilter, setSuspendedFilter] = useState(filters?.suspended ?? '');
    const [suspendModalOpen, setSuspendModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    // Filter effect
    useEffect(() => {
        const fetchUsers = () => {
            router.get(
                route('admin.administration.users.index'),
                {
                    search,
                    role: roleFilter || null,
                    suspended: suspendedFilter !== '' ? suspendedFilter : null,
                },
                {
                    preserveState: true,
                    replace: true,
                    preserveScroll: true,
                }
            );
        };

        const timer = setTimeout(() => {
            fetchUsers();
        }, 300);

        return () => clearTimeout(timer);
    }, [search, roleFilter, suspendedFilter]);

    const handleDelete = (user) => {
        setUserToDelete(user);
        setDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (userToDelete) {
            router.delete(route('admin.administration.users.destroy', userToDelete.id), {
                onSuccess: () => {
                    toast.success(t('users.userDeleted'));
                    setDeleteModalOpen(false);
                    setUserToDelete(null);
                },
            });
        }
    };

    const openSuspendModal = (user) => {
        setSelectedUser(user);
        setSuspendModalOpen(true);
    };

    const columns = [
        {
            header: t('users.name'),
            accessor: 'name',
        },
        {
            header: t('users.email'),
            accessor: 'email',
        },
        {
            header: t('users.roles'),
            accessor: 'roles',
            render: (user) => (
                <div className="flex flex-wrap gap-1">
                    {user.roles?.map((role) => (
                        <span
                            key={role.id}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                        >
                            {role.name}
                        </span>
                    ))}
                </div>
            ),
        },
        {
            header: t('users.suspended'),
            accessor: 'suspended',
            render: (user) => {
                const isSuspended = user.suspended_until && new Date(user.suspended_until) > new Date();
                return isSuspended ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                        {t('users.suspended')}
                    </span>
                ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                        {t('users.active')}
                    </span>
                );
            },
        },
    ];

    const actions = (user) => (
        <div className="flex items-center gap-2">
            {permissions.includes('edit-users') && (
                <Link
                    href={route('admin.administration.users.edit', user.id)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                >
                    <Edit size={16} />
                </Link>
            )}
            {permissions.includes('suspend-users') && (
                <button
                    onClick={() => openSuspendModal(user)}
                    className="text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-200"
                >
                    {user.suspended_until && new Date(user.suspended_until) > new Date() ? (
                        <UserCheck size={16} />
                    ) : (
                        <Ban size={16} />
                    )}
                </button>
            )}
            {permissions.includes('delete-users') && (
                <button
                    onClick={() => handleDelete(user)}
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
                        {t('users.title')}
                    </h2>
                    {permissions.includes('create-users') && (
                        <PrimaryButton
                            onClick={() => router.visit(route('admin.administration.users.create'))}
                        >
                            <Plus size={16} className="mr-2" />
                            {t('users.createUser')}
                        </PrimaryButton>
                    )}
                </div>
            }
        >
            <Head title={t('users.title')} />

            <div className="py-12">
                <div className="sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-6 flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                        <TextInput
                                            type="text"
                                            placeholder={t('users.search')}
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                                <div className="w-full sm:w-48">
                                    <Select
                                        value={roleFilter}
                                        onChange={(e) => setRoleFilter(e.target.value)}
                                    >
                                        <option value="">{t('users.filterByRole')}</option>
                                        {roles.map((role) => (
                                            <option key={role.id} value={role.id}>
                                                {role.name}
                                            </option>
                                        ))}
                                    </Select>
                                </div>
                                <div className="w-full sm:w-48">
                                    <Select
                                        value={suspendedFilter}
                                        onChange={(e) => setSuspendedFilter(e.target.value)}
                                    >
                                        <option value="">{t('users.filterByStatus')}</option>
                                        <option value="0">{t('users.active')}</option>
                                        <option value="1">{t('users.suspended')}</option>
                                    </Select>
                                </div>
                            </div>

                            <DataTable
                                columns={columns}
                                data={users.data}
                                actions={actions}
                                emptyMessage={t('users.noUsers')}
                            />

                            {users.links && users.links.length > 3 && (
                                <div className="mt-4 flex justify-center">
                                    <nav className="flex gap-2">
                                        {users.links.map((link, index) => (
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

            <SuspendModal
                show={suspendModalOpen}
                onClose={() => {
                    setSuspendModalOpen(false);
                    setSelectedUser(null);
                }}
                user={selectedUser}
            />

            <Modal
                show={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setUserToDelete(null);
                }}
                title={t('users.deleteUser')}
            >
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {t('users.confirmDelete')}
                </p>
                <div className="flex items-center justify-end gap-4">
                    <SecondaryButton
                        onClick={() => {
                            setDeleteModalOpen(false);
                            setUserToDelete(null);
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


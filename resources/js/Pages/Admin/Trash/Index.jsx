import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import DataTable from '@/Components/DataTable';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Modal from '@/Components/Modal';
import { RotateCcw, Trash2, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function TrashIndex({ data, tab, counts }) {
    const { auth } = usePage().props;
    const permissions = auth?.user?.permissions || [];
    
    // Modal states
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [actionType, setActionType] = useState(null); // 'restore' or 'force-delete'
    const [selectedItem, setSelectedItem] = useState(null);

    const tabs = [
        { id: 'users', label: 'Users', permission: 'view-users' },
        { id: 'roles', label: 'Roles', permission: 'view-roles' },
        { id: 'permissions', label: 'Permissions', permission: 'view-permissions' },
    ];

    const handleAction = (item, type) => {
        setSelectedItem(item);
        setActionType(type);
        setConfirmModalOpen(true);
    };

    const confirmAction = () => {
        if (!selectedItem || !actionType) return;

        const routes = {
            users: {
                restore: 'admin.trash.users.restore',
                forceDelete: 'admin.trash.users.force-delete',
            },
            roles: {
                restore: 'admin.trash.roles.restore',
                forceDelete: 'admin.trash.roles.force-delete',
            },
            permissions: {
                restore: 'admin.trash.permissions.restore',
                forceDelete: 'admin.trash.permissions.force-delete',
            },
        };

        const routeName = actionType === 'restore' 
            ? routes[tab].restore 
            : routes[tab].forceDelete;

        const method = actionType === 'restore' ? 'post' : 'delete';

        router.visit(route(routeName, selectedItem.id), {
            method: method,
            onSuccess: () => {
                setConfirmModalOpen(false);
                setSelectedItem(null);
                setActionType(null);
            },
            onError: () => {
                toast.error('An error occurred');
                setConfirmModalOpen(false);
            }
        });
    };

    const getColumns = () => {
        switch (tab) {
            case 'users':
                return [
                    { header: 'Name', accessor: 'name' },
                    { header: 'Email', accessor: 'email' },
                    { 
                        header: 'Deleted At', 
                        accessor: 'deleted_at',
                        render: (item) => new Date(item.deleted_at).toLocaleDateString() 
                    },
                ];
            case 'roles':
                return [
                    { header: 'Name', accessor: 'name' },
                    { header: 'Guard', accessor: 'guard_name' },
                    { 
                        header: 'Deleted At', 
                        accessor: 'deleted_at',
                        render: (item) => new Date(item.deleted_at).toLocaleDateString() 
                    },
                ];
            case 'permissions':
                return [
                    { header: 'Name', accessor: 'name' },
                    { header: 'Guard', accessor: 'guard_name' },
                    { 
                        header: 'Deleted At', 
                        accessor: 'deleted_at',
                        render: (item) => new Date(item.deleted_at).toLocaleDateString() 
                    },
                ];
            default:
                return [];
        }
    };

    const actions = (item) => (
        <div className="flex items-center gap-2">
            {permissions.includes(`edit-${tab}`) && (
                <button
                    onClick={() => handleAction(item, 'restore')}
                    className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
                    title="Restore"
                >
                    <RotateCcw size={18} />
                </button>
            )}
            {permissions.includes(`delete-${tab}`) && (
                <button
                    onClick={() => handleAction(item, 'force-delete')}
                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
                    title="Delete Permanently"
                >
                    <Trash2 size={18} />
                </button>
            )}
        </div>
    );

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-100">
                    Trash
                </h2>
            }
        >
            <Head title="Trash" />

            <div className="py-12">
                <div className="sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="border-b border-gray-200 dark:border-gray-700">
                            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
                                {tabs.map((t) => (
                                    permissions.includes(t.permission) && (
                                        <Link
                                            key={t.id}
                                            href={route('admin.trash.index', { tab: t.id })}
                                            className={`
                                                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2
                                                ${tab === t.id
                                                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300'}
                                            `}
                                        >
                                            {t.label}
                                            {counts[t.id] > 0 && (
                                                <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-blue-500 rounded-full">
                                                    {counts[t.id]}
                                                </span>
                                            )}
                                        </Link>
                                    )
                                ))}
                            </nav>
                        </div>

                        <div className="p-6">
                            <DataTable
                                columns={getColumns()}
                                data={data.data}
                                actions={actions}
                                emptyMessage={`No deleted ${tab} found.`}
                                actionLabel="Actions"
                            />

                            {data.links && data.links.length > 3 && (
                                <div className="mt-4 flex justify-center">
                                    <nav className="flex gap-2">
                                        {data.links.map((link, index) => (
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
                show={confirmModalOpen}
                onClose={() => {
                    setConfirmModalOpen(false);
                    setSelectedItem(null);
                    setActionType(null);
                }}
                title={actionType === 'restore' ? 'Confirm Restore' : 'Confirm Permanent Delete'}
            >
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <AlertTriangle className={`w-10 h-10 ${actionType === 'restore' ? 'text-green-500' : 'text-red-500'}`} />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            {actionType === 'restore' ? 'Restore Item?' : 'Permanently Delete Item?'}
                        </h3>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                        {actionType === 'restore' 
                            ? `Are you sure you want to restore this ${tab.slice(0, -1)}? It will be moved back to the active list.`
                            : `Are you sure you want to permanently delete this ${tab.slice(0, -1)}? This action CANNOT be undone.`
                        }
                    </p>

                    <div className="flex items-center justify-end gap-4">
                        <SecondaryButton
                            onClick={() => {
                                setConfirmModalOpen(false);
                                setSelectedItem(null);
                                setActionType(null);
                            }}
                        >
                            Cancel
                        </SecondaryButton>
                        {actionType === 'restore' ? (
                            <PrimaryButton onClick={confirmAction}>
                                Restore
                            </PrimaryButton>
                        ) : (
                            <DangerButton onClick={confirmAction}>
                                Delete Permanently
                            </DangerButton>
                        )}
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}

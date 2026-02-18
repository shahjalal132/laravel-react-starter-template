import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import DataTable from '@/Components/DataTable';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Modal from '@/Components/Modal';
import { RotateCcw, Trash2, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

export default function TrashIndex({ data, tab, counts }) {
    const { t } = useTranslation('administration');
    const { auth } = usePage().props;
    const permissions = auth?.user?.permissions || [];
    
    // Modal states
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [actionType, setActionType] = useState(null); // 'restore', 'force-delete', 'bulk-restore', 'bulk-force-delete'
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);

    // Reset selection when tab changes
    useEffect(() => {
        setSelectedIds([]);
    }, [tab]);

    const tabs = [
        { id: 'users', label: t('trash.users'), permission: 'view-users' },
        { id: 'roles', label: t('trash.roles'), permission: 'view-roles' },
        { id: 'permissions', label: t('trash.permissions'), permission: 'view-permissions' },
    ];

    const handleAction = (item, type) => {
        setSelectedItem(item);
        setActionType(type);
        setConfirmModalOpen(true);
    };

    const handleBulkAction = (type) => {
        if (selectedIds.length === 0) return;
        setActionType(type);
        setConfirmModalOpen(true);
    };

    const handleSelectToggle = (id) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleSelectAllToggle = () => {
        if (data.data.length > 0 && selectedIds.length === data.data.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(data.data.map(item => item.id));
        }
    };

    const confirmAction = () => {
        const isBulk = actionType?.startsWith('bulk-');
        if (!isBulk && (!selectedItem || !actionType)) return;
        if (isBulk && selectedIds.length === 0) return;

        const routes = {
            users: {
                restore: 'admin.trash.users.restore',
                forceDelete: 'admin.trash.users.force-delete',
                bulkRestore: 'admin.trash.users.bulk-restore',
                bulkForceDelete: 'admin.trash.users.bulk-force-delete',
            },
            roles: {
                restore: 'admin.trash.roles.restore',
                forceDelete: 'admin.trash.roles.force-delete',
                bulkRestore: 'admin.trash.roles.bulk-restore',
                bulkForceDelete: 'admin.trash.roles.bulk-force-delete',
            },
            permissions: {
                restore: 'admin.trash.permissions.restore',
                forceDelete: 'admin.trash.permissions.force-delete',
                bulkRestore: 'admin.trash.permissions.bulk-restore',
                bulkForceDelete: 'admin.trash.permissions.bulk-force-delete',
            },
        };

        const currentRoutes = routes[tab];
        let routeName, method, dataParams;

        if (isBulk) {
            routeName = actionType === 'bulk-restore' ? currentRoutes.bulkRestore : currentRoutes.bulkForceDelete;
            method = actionType === 'bulk-restore' ? 'post' : 'delete';
            dataParams = { ids: selectedIds };
        } else {
            routeName = actionType === 'restore' ? currentRoutes.restore : currentRoutes.forceDelete;
            method = actionType === 'restore' ? 'post' : 'delete';
            dataParams = {};
        }

        router.visit(route(routeName, isBulk ? null : selectedItem.id), {
            method: method,
            data: dataParams,
            onSuccess: () => {
                setConfirmModalOpen(false);
                setSelectedItem(null);
                setActionType(null);
                setSelectedIds([]);
            },
            onError: () => {
                toast.error(t('trash.errorOccurred'));
                setConfirmModalOpen(false);
            }
        });
    };

    const getColumns = () => {
        switch (tab) {
            case 'users':
                return [
                    { header: t('trash.name'), accessor: 'name' },
                    { header: t('trash.email'), accessor: 'email' },
                    { 
                        header: t('trash.deletedAt'), 
                        accessor: 'deleted_at',
                        render: (item) => new Date(item.deleted_at).toLocaleDateString() 
                    },
                ];
            case 'roles':
                return [
                    { header: t('trash.name'), accessor: 'name' },
                    { header: t('trash.guard'), accessor: 'guard_name' },
                    { 
                        header: t('trash.deletedAt'), 
                        accessor: 'deleted_at',
                        render: (item) => new Date(item.deleted_at).toLocaleDateString() 
                    },
                ];
            case 'permissions':
                return [
                    { header: t('trash.name'), accessor: 'name' },
                    { header: t('trash.guard'), accessor: 'guard_name' },
                    { 
                        header: t('trash.deletedAt'), 
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
                    title={t('trash.restore')}
                >
                    <RotateCcw size={18} />
                </button>
            )}
            {permissions.includes(`delete-${tab}`) && (
                <button
                    onClick={() => handleAction(item, 'force-delete')}
                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
                    title={t('trash.deletePermanently')}
                >
                    <Trash2 size={18} />
                </button>
            )}
        </div>
    );

    const isBulk = actionType?.startsWith('bulk-');
    const isRestore = actionType === 'restore' || actionType === 'bulk-restore';

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-100">
                    {t('trash.title')}
                </h2>
            }
        >
            <Head title={t('trash.title')} />

            <div className="py-12">
                <div className="sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6">
                            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                                {tabs.map((t_item) => (
                                    permissions.includes(t_item.permission) && (
                                        <Link
                                            key={t_item.id}
                                            href={route('admin.trash.index', { tab: t_item.id })}
                                            className={`
                                                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2
                                                ${tab === t_item.id
                                                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300'}
                                            `}
                                        >
                                            {t_item.label}
                                            {counts[t_item.id] > 0 && (
                                                <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-blue-500 rounded-full">
                                                    {counts[t_item.id]}
                                                </span>
                                            )}
                                        </Link>
                                    )
                                ))}
                            </nav>

                            {selectedIds.length > 0 && (
                                <div className="flex items-center gap-3 py-4 border-t sm:border-t-0 border-gray-100 dark:border-gray-700">
                                    <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">
                                        {selectedIds.length} {t('common.selected')}
                                    </span>
                                    {permissions.includes(`edit-${tab}`) && (
                                        <button
                                            onClick={() => handleBulkAction('bulk-restore')}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-md hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                                        >
                                            <RotateCcw size={16} />
                                            {t('trash.restoreSelected')}
                                        </button>
                                    )}
                                    {permissions.includes(`delete-${tab}`) && (
                                        <button
                                            onClick={() => handleBulkAction('bulk-force-delete')}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                            {t('trash.deleteSelected')}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="p-6">
                            <DataTable
                                columns={getColumns()}
                                data={data.data}
                                actions={actions}
                                emptyMessage={t('trash.emptyMessage', { tab: t(`trash.${tab}`).toLowerCase() })}
                                actionLabel={t('trash.actions')}
                                selectable={true}
                                selectedIds={selectedIds}
                                onSelectToggle={handleSelectToggle}
                                onSelectAllToggle={handleSelectAllToggle}
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
                title={
                    isBulk 
                        ? (isRestore ? t('trash.confirmBulkRestoreTitle') : t('trash.confirmBulkDeleteTitle'))
                        : (isRestore ? t('trash.confirmRestoreTitle') : t('trash.confirmDeleteTitle'))
                }
            >
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <AlertTriangle className={`w-10 h-10 ${isRestore ? 'text-green-500' : 'text-red-500'}`} />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            {isBulk 
                                ? (isRestore ? t('trash.restoreItemsQuestion') : t('trash.deleteItemsQuestion'))
                                : (isRestore ? t('trash.restoreItemQuestion') : t('trash.deleteItemQuestion'))
                            }
                        </h3>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                        {isBulk 
                            ? (isRestore 
                                ? t('trash.restoreBulkConfirmMessage', { count: selectedIds.length, items: t(`trash.${tab}_plural`).toLowerCase() })
                                : t('trash.deleteBulkConfirmMessage', { count: selectedIds.length, items: t(`trash.${tab}_plural`).toLowerCase() })
                              )
                            : (isRestore 
                                ? t('trash.restoreConfirmMessage', { item: t(`trash.${tab.slice(0, -1)}`).toLowerCase() })
                                : t('trash.deleteConfirmMessage', { item: t(`trash.${tab.slice(0, -1)}`).toLowerCase() })
                              )
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
                            {t('common.cancel')}
                        </SecondaryButton>
                        {isRestore ? (
                            <PrimaryButton onClick={confirmAction}>
                                {t('trash.restore')}
                            </PrimaryButton>
                        ) : (
                            <DangerButton onClick={confirmAction}>
                                {isBulk ? t('trash.deletePermanently') : t('trash.deletePermanently')}
                            </DangerButton>
                        )}
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}

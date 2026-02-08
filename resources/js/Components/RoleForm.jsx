import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import Checkbox from '@/Components/Checkbox';
import { useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function RoleForm({ role = null, permissions = [], onSubmit, onCancel }) {
    const { t } = useTranslation('administration');
    const isEdit = !!role;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: role?.name || '',
        permissions: role?.permissions?.map(p => p.id) || [],
    });

    const submit = (e) => {
        e.preventDefault();

        if (isEdit) {
            put(route('admin.administration.roles.update', role.id), {
                onSuccess: () => {
                    reset();
                    if (onSubmit) onSubmit();
                },
            });
        } else {
            post(route('admin.administration.roles.store'), {
                onSuccess: () => {
                    reset();
                    if (onSubmit) onSubmit();
                },
            });
        }
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div>
                <InputLabel htmlFor="name" value={t('roles.name')} />
                <TextInput
                    id="name"
                    type="text"
                    className="mt-1 block w-full"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    required
                    autoFocus
                />
                <InputError message={errors.name} className="mt-2" />
            </div>

            <div>
                <InputLabel value={t('roles.permissions')} />
                <div className="mt-2 space-y-2 max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    {permissions.map((permission) => (
                        <label key={permission.id} className="flex items-center py-1">
                            <Checkbox
                                checked={data.permissions.includes(permission.id)}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setData('permissions', [...data.permissions, permission.id]);
                                    } else {
                                        setData('permissions', data.permissions.filter(id => id !== permission.id));
                                    }
                                }}
                            />
                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                {permission.name}
                            </span>
                        </label>
                    ))}
                </div>
                <InputError message={errors.permissions} className="mt-2" />
            </div>

            <div className="flex items-center justify-end gap-4">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                    >
                        {t('common.cancel')}
                    </button>
                )}
                <PrimaryButton disabled={processing}>
                    {processing ? t('common.loading') : t('common.save')}
                </PrimaryButton>
            </div>
        </form>
    );
}


import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function PermissionForm({ permission = null, onSubmit, onCancel }) {
    const { t } = useTranslation('administration');
    const isEdit = !!permission;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: permission?.name || '',
    });

    const submit = (e) => {
        e.preventDefault();

        if (isEdit) {
            put(route('admin.administration.permissions.update', permission.id), {
                onSuccess: () => {
                    reset();
                    if (onSubmit) onSubmit();
                },
            });
        } else {
            post(route('admin.administration.permissions.store'), {
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
                <InputLabel htmlFor="name" value={t('permissions.name')} />
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


import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import Select from '@/Components/Select';
import Checkbox from '@/Components/Checkbox';
import { useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function UserForm({ user = null, roles = [], onSubmit, onCancel }) {
    const { t } = useTranslation('administration');
    const isEdit = !!user;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        password_confirmation: '',
        roles: user?.roles?.map(r => r.id) || [],
    });

    const submit = (e) => {
        e.preventDefault();

        if (isEdit) {
            put(route('admin.administration.users.update', user.id), {
                onSuccess: () => {
                    reset();
                    if (onSubmit) onSubmit();
                },
            });
        } else {
            post(route('admin.administration.users.store'), {
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
                <InputLabel htmlFor="name" value={t('users.name')} />
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
                <InputLabel htmlFor="email" value={t('users.email')} />
                <TextInput
                    id="email"
                    type="email"
                    className="mt-1 block w-full"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    required
                />
                <InputError message={errors.email} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="password" value={t('users.password')} />
                <TextInput
                    id="password"
                    type="password"
                    className="mt-1 block w-full"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    required={!isEdit}
                />
                <InputError message={errors.password} className="mt-2" />
            </div>

            {!isEdit && (
                <div>
                    <InputLabel htmlFor="password_confirmation" value={t('users.passwordConfirmation')} />
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        className="mt-1 block w-full"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                    />
                    <InputError message={errors.password_confirmation} className="mt-2" />
            </div>
            )}

            <div>
                <InputLabel value={t('users.roles')} />
                <div className="mt-2 space-y-2">
                    {roles.map((role) => (
                        <label key={role.id} className="flex items-center">
                            <Checkbox
                                checked={data.roles.includes(role.id)}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setData('roles', [...data.roles, role.id]);
                                    } else {
                                        setData('roles', data.roles.filter(id => id !== role.id));
                                    }
                                }}
                            />
                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                {role.name}
                            </span>
                        </label>
                    ))}
                </div>
                <InputError message={errors.roles} className="mt-2" />
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


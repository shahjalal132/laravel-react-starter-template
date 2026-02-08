import Modal from '@/Components/Modal';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function SuspendModal({ show, onClose, user, onUnsuspend }) {
    const { t } = useTranslation('administration');
    const isSuspended = user?.suspended_until && new Date(user.suspended_until) > new Date();

    const { data, setData, post, processing, errors, reset } = useForm({
        suspended_until: '',
    });

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleSuspend = (e) => {
        e.preventDefault();
        post(route('admin.administration.users.suspend', user.id), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    const handleUnsuspend = () => {
        post(route('admin.administration.users.unsuspend', user.id), {
            onSuccess: () => {
                onClose();
            },
        });
    };

    return (
        <Modal show={show} onClose={handleClose} title={isSuspended ? t('users.unsuspendUser') : t('users.suspendUser')}>
            {isSuspended ? (
                <div className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t('users.suspendedUntil')}: {new Date(user.suspended_until).toLocaleString()}
                    </p>
                    <div className="flex items-center justify-end gap-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                        >
                            {t('common.cancel')}
                        </button>
                        <PrimaryButton onClick={handleUnsuspend} disabled={processing}>
                            {processing ? t('common.loading') : t('users.unsuspendUser')}
                        </PrimaryButton>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSuspend} className="space-y-4">
                    <div>
                        <InputLabel htmlFor="suspended_until" value={t('users.suspendedUntil')} />
                        <TextInput
                            id="suspended_until"
                            type="datetime-local"
                            className="mt-1 block w-full"
                            value={data.suspended_until}
                            onChange={(e) => setData('suspended_until', e.target.value)}
                            required
                            min={new Date().toISOString().slice(0, 16)}
                        />
                        <InputError message={errors.suspended_until} className="mt-2" />
                    </div>

                    <div className="flex items-center justify-end gap-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                        >
                            {t('common.cancel')}
                        </button>
                        <DangerButton disabled={processing}>
                            {processing ? t('common.loading') : t('users.suspendUser')}
                        </DangerButton>
                    </div>
                </form>
            )}
        </Modal>
    );
}


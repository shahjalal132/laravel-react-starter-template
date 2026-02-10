import Modal from '@/Components/Modal';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';
import TextInput from '@/Components/TextInput';
import Textarea from '@/Components/Textarea';
import { useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-hot-toast';
import DateTimePicker from './DateTimePicker';

export default function SuspendModal({ show, onClose, user, onUnsuspend }) {
    const { t } = useTranslation('administration');
    const isSuspended = user?.suspended_until && new Date(user.suspended_until) > new Date();

    const { data, setData, post, processing, errors, reset } = useForm({
        suspended_until: '',
        suspension_reason: '',
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
                    {user.suspension_reason && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                            <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
                                {t('users.suspensionReason')}:
                            </p>
                            <p className="text-sm text-red-700 dark:text-red-300">
                                {user.suspension_reason}
                            </p>
                        </div>
                    )}
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
                    <DateTimePicker
                        label={t('users.suspendedUntil')}
                        value={data.suspended_until}
                        onChange={(date) => {
                            // Format date for Laravel backend (Y-m-d H:i:s)
                            const offset = date.getTimezoneOffset();
                            const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
                            setData('suspended_until', adjustedDate.toISOString().slice(0, 19).replace('T', ' '));
                        }}
                    />
                    <InputError message={errors.suspended_until} className="mt-2" />

                    <div>
                        <InputLabel htmlFor="suspension_reason" value={t('users.suspensionReason')} />
                        <Textarea
                            id="suspension_reason"
                            className="mt-1 block w-full"
                            rows={4}
                            value={data.suspension_reason}
                            onChange={(e) => setData('suspension_reason', e.target.value)}
                            placeholder={t('users.suspensionReasonPlaceholder')}
                        />
                        <InputError message={errors.suspension_reason} className="mt-2" />
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


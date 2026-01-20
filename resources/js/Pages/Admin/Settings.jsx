import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Settings as SettingsIcon, Upload, Globe, Mail, Phone, MapPin } from 'lucide-react';

export default function Settings() {
    const { data, setData, post, processing, errors, reset } = useForm({
        app_name: 'TailAdmin',
        app_email: 'admin@tailadmin.com',
        app_phone: '+1 (555) 000-0000',
        app_address: '123 Admin St, Tech City',
        logo: null,
    });

    const submit = (e) => {
        e.preventDefault();
        // post(route('admin.settings.update'));
        console.log('Form submitted:', data);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Application Settings
                </h2>
            }
        >
            <Head title="Settings" />

            <div className="py-12">
                <div className="space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 p-4 shadow sm:rounded-lg sm:p-8 border border-gray-200 dark:border-gray-700">
                        <section className="max-w-xl">
                            <header>
                                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                    General Information
                                </h2>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                    Update your application's general information and branding.
                                </p>
                            </header>

                            <form onSubmit={submit} className="mt-6 space-y-8">
                                <div>
                                    <InputLabel htmlFor="app_name" value="Application Name" />
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Globe className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <TextInput
                                            id="app_name"
                                            className="w-full border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-10 py-3 pr-10 text-sm text-slate-900 dark:text-gray-100 outline-blue-600 dark:outline-blue-400"
                                            value={data.app_name}
                                            onChange={(e) => setData('app_name', e.target.value)}
                                            required
                                            isFocused
                                            autoComplete="app_name"
                                        />
                                    </div>
                                    <InputError className="mt-2" message={errors.app_name} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="app_email" value="Support Email" />
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <TextInput
                                            id="app_email"
                                            type="email"
                                            className="w-full border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-10 py-3 pr-10 text-sm text-slate-900 dark:text-gray-100 outline-blue-600 dark:outline-blue-400"
                                            value={data.app_email}
                                            onChange={(e) => setData('app_email', e.target.value)}
                                            required
                                            autoComplete="email"
                                        />
                                    </div>
                                    <InputError className="mt-2" message={errors.app_email} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="app_phone" value="Support Phone" />
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Phone className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <TextInput
                                            id="app_phone"
                                            className="w-full border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-10 py-3 pr-10 text-sm text-slate-900 dark:text-gray-100 outline-blue-600 dark:outline-blue-400"
                                            value={data.app_phone}
                                            onChange={(e) => setData('app_phone', e.target.value)}
                                            autoComplete="tel"
                                        />
                                    </div>
                                    <InputError className="mt-2" message={errors.app_phone} />
                                </div>

                                <div>
                                    <InputLabel htmlFor="app_address" value="Office Address" />
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <MapPin className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <TextInput
                                            id="app_address"
                                            className="w-full border border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-10 py-3 pr-10 text-sm text-slate-900 dark:text-gray-100 outline-blue-600 dark:outline-blue-400"
                                            value={data.app_address}
                                            onChange={(e) => setData('app_address', e.target.value)}
                                            autoComplete="street-address"
                                        />
                                    </div>
                                    <InputError className="mt-2" message={errors.app_address} />
                                </div>

                                <div>
                                    <InputLabel value="Application Logo" />
                                    <div className="mt-2 flex items-center gap-4">
                                        <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
                                            <div className="flex flex-col gap-0.5">
                                                <div className="flex gap-0.5">
                                                    <div className="w-1.5 h-4 bg-white rounded-full"></div>
                                                    <div className="w-1.5 h-4 bg-white rounded-full"></div>
                                                    <div className="w-1.5 h-4 bg-white rounded-full"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <label className="cursor-pointer bg-white dark:bg-gray-700 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150">
                                            <span className="flex items-center gap-2">
                                                <Upload className="w-4 h-4" />
                                                Change Logo
                                            </span>
                                            <input
                                                type="file"
                                                className="hidden"
                                                onChange={(e) => setData('logo', e.target.files[0])}
                                            />
                                        </label>
                                    </div>
                                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                        Allowed file types: png, jpg, jpeg. Max size: 2MB.
                                    </p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <PrimaryButton disabled={processing} className="py-4 px-8hover:cursor-pointer">Save Changes</PrimaryButton>
                                </div>
                            </form>
                        </section>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

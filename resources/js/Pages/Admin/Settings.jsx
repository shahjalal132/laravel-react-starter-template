import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Settings as SettingsIcon, Upload, Globe, Mail, Phone, MapPin, CreditCard, Search, Send, Bell, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

export default function Settings() {
    const [activeTab, setActiveTab] = useState('general');

    const { data, setData, post, processing, errors, reset } = useForm({
        app_name: 'TailAdmin',
        app_email: 'admin@tailadmin.com',
        app_phone: '+1 (555) 000-0000',
        app_address: '123 Admin St, Tech City',
        logo: null,
    });

    const tabs = [
        { id: 'general', label: 'General', icon: Globe, description: 'App branding and info' },
        { id: 'payment', label: 'Payment', icon: CreditCard, description: 'Gateways and currency' },
        { id: 'seo', label: 'SEO', icon: Search, description: 'Search engine optimization' },
        { id: 'smtp', label: 'SMTP', icon: Send, description: 'Email server settings' },
        { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Email and push alerts' },
        { id: 'security', label: 'Security', icon: ShieldCheck, description: 'Password and 2FA' },
    ];

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
                <div className="sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Sidebar Tabs */}
                        <div className="w-full md:w-64 shrink-0">
                            <nav className="space-y-1">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`w-full flex items-start gap-3 px-4 py-3 text-left rounded-xl transition-all duration-200 ${isActive
                                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none'
                                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                                }`}
                                        >
                                            <Icon className={`h-5 w-5 mt-0.5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                                            <div>
                                                <div className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
                                                    {tab.label}
                                                </div>
                                                <div className={`text-xs mt-0.5 ${isActive ? 'text-blue-100' : 'text-gray-500'}`}>
                                                    {tab.description}
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1">
                            <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                <div className="p-6 sm:p-8">
                                    {activeTab === 'general' && (
                                        <section className="max-w-2xl">
                                            <header>
                                                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                                    General Information
                                                </h2>
                                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                                    Update your application's general information and branding.
                                                </p>
                                            </header>

                                            <form onSubmit={submit} className="mt-8 space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <InputLabel htmlFor="app_name" value="Application Name" />
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                <Globe className="h-4 w-4 text-gray-400" />
                                                            </div>
                                                            <TextInput
                                                                id="app_name"
                                                                className="w-full pl-10"
                                                                value={data.app_name}
                                                                onChange={(e) => setData('app_name', e.target.value)}
                                                                required
                                                                isFocused
                                                            />
                                                        </div>
                                                        <InputError message={errors.app_name} />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <InputLabel htmlFor="app_email" value="Support Email" />
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                <Mail className="h-4 w-4 text-gray-400" />
                                                            </div>
                                                            <TextInput
                                                                id="app_email"
                                                                type="email"
                                                                className="w-full pl-10"
                                                                value={data.app_email}
                                                                onChange={(e) => setData('app_email', e.target.value)}
                                                                required
                                                            />
                                                        </div>
                                                        <InputError message={errors.app_email} />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <InputLabel htmlFor="app_phone" value="Support Phone" />
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                <Phone className="h-4 w-4 text-gray-400" />
                                                            </div>
                                                            <TextInput
                                                                id="app_phone"
                                                                className="w-full pl-10"
                                                                value={data.app_phone}
                                                                onChange={(e) => setData('app_phone', e.target.value)}
                                                            />
                                                        </div>
                                                        <InputError message={errors.app_phone} />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <InputLabel htmlFor="app_address" value="Office Address" />
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                <MapPin className="h-4 w-4 text-gray-400" />
                                                            </div>
                                                            <TextInput
                                                                id="app_address"
                                                                className="w-full pl-10"
                                                                value={data.app_address}
                                                                onChange={(e) => setData('app_address', e.target.value)}
                                                            />
                                                        </div>
                                                        <InputError message={errors.app_address} />
                                                    </div>
                                                </div>

                                                <div className="pt-4">
                                                    <InputLabel value="Application Logo" />
                                                    <div className="mt-3 flex items-center gap-6">
                                                        <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                                                            <div className="flex gap-1">
                                                                <div className="w-2 h-6 bg-white/90 rounded-full"></div>
                                                                <div className="w-2 h-6 bg-white/90 rounded-full"></div>
                                                                <div className="w-2 h-6 bg-white/90 rounded-full"></div>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-3">
                                                            <label className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all">
                                                                <Upload className="w-4 h-4" />
                                                                Change Logo
                                                                <input
                                                                    type="file"
                                                                    className="hidden"
                                                                    onChange={(e) => setData('logo', e.target.files[0])}
                                                                />
                                                            </label>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                PNG, JPG up to 2MB
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4 pt-6 border-t border-gray-100 dark:border-gray-700">
                                                    <PrimaryButton disabled={processing} className="px-8 py-4 rounded-md hover:cursor-pointer ">
                                                        Save Changes
                                                    </PrimaryButton>
                                                </div>
                                            </form>
                                        </section>
                                    )}

                                    {activeTab !== 'general' && (
                                        <div className="flex flex-col items-center justify-center py-20 text-center">
                                            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                                                {(() => {
                                                    const Icon = tabs.find(t => t.id === activeTab)?.icon || SettingsIcon;
                                                    return <Icon className="w-10 h-10 text-gray-400" />;
                                                })()}
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                {tabs.find(t => t.id === activeTab)?.label} Settings
                                            </h3>
                                            <p className="text-gray-500 dark:text-gray-400 max-w-xs mt-2">
                                                This section is currently under development. Stay tuned for updates!
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import Select from '@/Components/Select';
import Toggle from '@/Components/Toggle';
import Textarea from '@/Components/Textarea';
import { Settings as SettingsIcon, Upload, Globe, Mail, Phone, MapPin, CreditCard, Search, Send, Bell, ShieldCheck, Lock, Eye, EyeOff, Image as ImageIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import Button from '@/Components/Button';
import { toast } from 'react-hot-toast';

const CURRENCY_SYMBOLS = {
    'BDT': '৳',
    'INR': '₹',
    'USD': '$',
};

export default function Settings({ settings = {}, flash }) {
    const [activeTab, setActiveTab] = useState('general');
    const [logoPreview, setLogoPreview] = useState(null);
    const [ogImagePreview, setOgImagePreview] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    // Initialize form data from settings
    const initializeFormData = () => {
        const general = settings.general || {};
        const payment = settings.payment || {};
        const seo = settings.seo || {};
        const smtp = settings.smtp || {};
        const notifications = settings.notifications || {};
        const security = settings.security || {};

        return {
            group: 'general',
            // General
            app_name: general.app_name || '',
            app_email: general.app_email || '',
            app_phone: general.app_phone || '',
            app_address: general.app_address || '',
            logo: null,
            // Payment
            payment_gateway: payment.payment_gateway || 'none',
            currency: payment.currency || 'USD',
            currency_symbol: payment.currency_symbol || '$',
            stripe_public_key: payment.stripe_public_key || '',
            stripe_secret_key: payment.stripe_secret_key || '',
            stripe_webhook_secret: payment.stripe_webhook_secret || '',
            paypal_client_id: payment.paypal_client_id || '',
            paypal_secret: payment.paypal_secret || '',
            sslcommerz_store_id: payment.sslcommerz_store_id || '',
            sslcommerz_store_password: payment.sslcommerz_store_password || '',
            payment_mode: payment.payment_mode || 'sandbox',
            // SEO
            meta_title: seo.meta_title || '',
            meta_description: seo.meta_description || '',
            meta_keywords: seo.meta_keywords || '',
            og_image: null,
            google_analytics_id: seo.google_analytics_id || '',
            google_search_console_verification: seo.google_search_console_verification || '',
            // SMTP
            smtp_host: smtp.smtp_host || '',
            smtp_port: smtp.smtp_port || '',
            smtp_username: smtp.smtp_username || '',
            smtp_password: smtp.smtp_password || '',
            smtp_encryption: smtp.smtp_encryption || 'tls',
            smtp_from_address: smtp.smtp_from_address || '',
            smtp_from_name: smtp.smtp_from_name || '',
            // Notifications
            email_notifications_enabled: notifications.email_notifications_enabled || false,
            push_notifications_enabled: notifications.push_notifications_enabled || false,
            notification_email: notifications.notification_email || '',
            low_stock_threshold: notifications.low_stock_threshold || '',
            order_notification_enabled: notifications.order_notification_enabled || false,
            // Security
            password_min_length: security.password_min_length || 8,
            password_require_uppercase: security.password_require_uppercase || false,
            password_require_lowercase: security.password_require_lowercase || false,
            password_require_numbers: security.password_require_numbers || false,
            password_require_symbols: security.password_require_symbols || false,
            two_factor_enabled: security.two_factor_enabled || false,
            session_timeout: security.session_timeout || 120,
        };
    };

    const { data, setData, post, processing, errors, reset } = useForm(initializeFormData());

    // Update form data when tab changes
    useEffect(() => {
        setData('group', activeTab);
    }, [activeTab]);

    // Handle deep-linking to tabs
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const tab = params.get('tab');
        if (tab && tabs.find(t => t.id === tab)) {
            setActiveTab(tab);
        }
    }, []);

    // Set logo preview if logo exists in settings
    useEffect(() => {
        if (settings.general?.logo) {
            setLogoPreview(`/storage/${settings.general.logo}`);
        }
    }, [settings.general?.logo]);

    // Set OG image preview if og_image exists in settings
    useEffect(() => {
        if (settings.seo?.og_image) {
            setOgImagePreview(`/storage/${settings.seo.og_image}`);
        }
    }, [settings.seo?.og_image]);

    // Handle logo preview
    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('logo', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle OG image preview
    const handleOgImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('og_image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setOgImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

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
        post(route('admin.settings.update'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Settings updated successfully');
                // Reset file inputs after successful submission
                if (activeTab === 'general') {
                    setLogoPreview(null);
                }
                if (activeTab === 'seo') {
                    setOgImagePreview(null);
                }
            },
            onError: () => {
                toast.error('Failed to update settings');
            },
        });
    };

    const renderGeneralTab = () => (
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
                                placeholder="Application Name"
                            />
                        </div>
                        <InputError message={errors.app_name} />
                    </div>

                    <div className="space-y-2">
                        <InputLabel htmlFor="app_email" value="Email" />
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
                                placeholder="Email"
                            />
                        </div>
                        <InputError message={errors.app_email} />
                    </div>

                    <div className="space-y-2">
                        <InputLabel htmlFor="app_phone" value="Phone" />
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Phone className="h-4 w-4 text-gray-400" />
                            </div>
                            <TextInput
                                id="app_phone"
                                className="w-full pl-10"
                                value={data.app_phone}
                                onChange={(e) => setData('app_phone', e.target.value)}
                                placeholder="Phone"
                            />
                        </div>
                        <InputError message={errors.app_phone} />
                    </div>

                    <div className="space-y-2">
                        <InputLabel htmlFor="app_address" value="Address" />
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MapPin className="h-4 w-4 text-gray-400" />
                            </div>
                            <TextInput
                                id="app_address"
                                className="w-full pl-10"
                                value={data.app_address}
                                onChange={(e) => setData('app_address', e.target.value)}
                                placeholder="Address"
                            />
                        </div>
                        <InputError message={errors.app_address} />
                    </div>
                </div>

                <div className="pt-4">
                    <InputLabel value="Application Logo" />
                    <div className="mt-3 flex items-center gap-6">
                        <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center shrink-0 shadow-inner overflow-hidden">
                            {logoPreview ? (
                                <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex gap-1">
                                    <div className="w-2 h-6 bg-white/90 rounded-full"></div>
                                    <div className="w-2 h-6 bg-white/90 rounded-full"></div>
                                    <div className="w-2 h-6 bg-white/90 rounded-full"></div>
                                </div>
                            )}
                        </div>
                        <div className="space-y-3">
                            <label className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all">
                                <Upload className="w-4 h-4" />
                                Change Logo
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/jpeg,image/png,image/jpg"
                                    onChange={handleLogoChange}
                                />
                            </label>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                PNG, JPG up to 2MB
                            </p>
                        </div>
                    </div>
                    <InputError message={errors.logo} />
                </div>

                <div className="flex items-center gap-4 pt-6 border-t border-gray-100 dark:border-gray-700">
                    <Button disabled={processing} isActive={true} className="px-8 py-4">
                        Save Changes
                    </Button>
                </div>
            </form>
        </section>
    );

    const renderPaymentTab = () => (
        <section className="max-w-2xl">
            <header>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Payment Settings
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Configure payment gateways and currency settings.
                </p>
            </header>

            <form onSubmit={submit} className="mt-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <InputLabel htmlFor="payment_gateway" value="Payment Gateway" />
                        <Select
                            id="payment_gateway"
                            value={data.payment_gateway}
                            onChange={(e) => setData('payment_gateway', e.target.value)}
                        >
                            <option value="none">None</option>
                            <option value="sslcommerz">SSLCommerz</option>
                            <option value="stripe">Stripe</option>
                            <option value="paypal">PayPal</option>
                        </Select>
                        <InputError message={errors.payment_gateway} />
                    </div>

                    <div className="space-y-2">
                        <InputLabel htmlFor="currency" value="Currency" />
                        <Select
                            id="currency"
                            value={data.currency}
                            onChange={(e) => {
                                const val = e.target.value;
                                setData(prev => ({
                                    ...prev,
                                    currency: val,
                                    currency_symbol: CURRENCY_SYMBOLS[val] || prev.currency_symbol
                                }));
                            }}
                        >
                            <option value="BDT">BDT - Bangladeshi Taka</option>
                            <option value="INR">INR - Indian Rupee</option>
                            <option value="USD">USD - US Dollar</option>
                        </Select>
                        <InputError message={errors.currency} />
                    </div>


                    <div className="space-y-2">
                        <InputLabel htmlFor="payment_mode" value="Payment Mode" />
                        <Select
                            id="payment_mode"
                            value={data.payment_mode}
                            onChange={(e) => setData('payment_mode', e.target.value)}
                        >
                            <option value="sandbox">Sandbox</option>
                            <option value="live">Live</option>
                        </Select>
                        <InputError message={errors.payment_mode} />
                    </div>

                    {data.payment_gateway === 'stripe' && (
                        <>
                            <div className="space-y-2 mt-6 md:col-span-2">
                                <InputLabel htmlFor="stripe_public_key" value="Stripe Public Key" />
                                <TextInput
                                    id="stripe_public_key"
                                    value={data.stripe_public_key}
                                    onChange={(e) => setData('stripe_public_key', e.target.value)}
                                    placeholder="pk_test_..."
                                />
                                <InputError message={errors.stripe_public_key} />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <InputLabel htmlFor="stripe_secret_key" value="Stripe Secret Key" />
                                <TextInput
                                    id="stripe_secret_key"
                                    type="password"
                                    value={data.stripe_secret_key}
                                    onChange={(e) => setData('stripe_secret_key', e.target.value)}
                                    placeholder="sk_test_..."
                                />
                                <InputError message={errors.stripe_secret_key} />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <InputLabel htmlFor="stripe_webhook_secret" value="Stripe Webhook Secret" />
                                <TextInput
                                    id="stripe_webhook_secret"
                                    type="password"
                                    value={data.stripe_webhook_secret}
                                    onChange={(e) => setData('stripe_webhook_secret', e.target.value)}
                                    placeholder="whsec_..."
                                />
                                <InputError message={errors.stripe_webhook_secret} />
                            </div>
                        </>
                    )}

                    {data.payment_gateway === 'paypal' && (
                        <>
                            <div className="space-y-2 mt-8 md:col-span-2">
                                <InputLabel htmlFor="paypal_client_id" value="PayPal Client ID" />
                                <TextInput
                                    id="paypal_client_id"
                                    value={data.paypal_client_id}
                                    onChange={(e) => setData('paypal_client_id', e.target.value)}
                                    placeholder="PAYPAL_CLIENT_ID"
                                />
                                <InputError message={errors.paypal_client_id} />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <InputLabel htmlFor="paypal_secret" value="PayPal Secret" />
                                <TextInput
                                    id="paypal_secret"
                                    type="password"
                                    value={data.paypal_secret}
                                    onChange={(e) => setData('paypal_secret', e.target.value)}
                                    placeholder="PAYPAL_SECRET"
                                />
                                <InputError message={errors.paypal_secret} />
                            </div>
                        </>
                    )}

                    {data.payment_gateway === 'sslcommerz' && (
                        <>
                            <div className="space-y-2 mt-8 md:col-span-2">
                                <InputLabel htmlFor="sslcommerz_store_id" value="SSLCommerz Store ID" />
                                <TextInput
                                    id="sslcommerz_store_id"
                                    value={data.sslcommerz_store_id}
                                    onChange={(e) => setData('sslcommerz_store_id', e.target.value)}
                                    placeholder="STORE_ID"
                                />
                                <InputError message={errors.sslcommerz_store_id} />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <InputLabel htmlFor="sslcommerz_store_password" value="SSLCommerz Store Password" />
                                <TextInput
                                    id="sslcommerz_store_password"
                                    type="password"
                                    value={data.sslcommerz_store_password}
                                    onChange={(e) => setData('sslcommerz_store_password', e.target.value)}
                                    placeholder="STORE_PASSWORD"
                                />
                                <InputError message={errors.sslcommerz_store_password} />
                            </div>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-4 pt-6 border-t border-gray-100 dark:border-gray-700">
                    <Button disabled={processing} isActive={true} className="w-auto px-8 py-4">
                        Save Changes
                    </Button>
                </div>
            </form>
        </section>
    );

    const renderSeoTab = () => (
        <section className="max-w-2xl">
            <header>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    SEO Settings
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Configure search engine optimization settings.
                </p>
            </header>

            <form onSubmit={submit} className="mt-8 space-y-6">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <InputLabel htmlFor="meta_title" value="Meta Title" />
                        <TextInput
                            id="meta_title"
                            value={data.meta_title}
                            onChange={(e) => setData('meta_title', e.target.value)}
                            placeholder="Your site title"
                        />
                        <InputError message={errors.meta_title} />
                    </div>

                    <div className="space-y-2">
                        <InputLabel htmlFor="meta_description" value="Meta Description" />
                        <Textarea
                            id="meta_description"
                            rows={3}
                            value={data.meta_description}
                            onChange={(e) => setData('meta_description', e.target.value)}
                            placeholder="A brief description of your site"
                        />
                        <InputError message={errors.meta_description} />
                    </div>

                    <div className="space-y-2">
                        <InputLabel htmlFor="meta_keywords" value="Meta Keywords" />
                        <TextInput
                            id="meta_keywords"
                            value={data.meta_keywords}
                            onChange={(e) => setData('meta_keywords', e.target.value)}
                            placeholder="keyword1, keyword2, keyword3"
                        />
                        <InputError message={errors.meta_keywords} />
                    </div>

                    <div className="space-y-2">
                        <InputLabel value="Open Graph Image" />
                        <div className="mt-3 flex items-center gap-6">
                            {ogImagePreview && (
                                <div className="w-32 h-32 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                                    <img src={ogImagePreview} alt="OG Image preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                            <div className="space-y-3">
                                <label className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all">
                                    <ImageIcon className="w-4 h-4" />
                                    Upload Image
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/jpeg,image/png,image/jpg"
                                        onChange={handleOgImageChange}
                                    />
                                </label>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    PNG, JPG up to 2MB
                                </p>
                            </div>
                        </div>
                        <InputError message={errors.og_image} />
                    </div>

                    <div className="space-y-2">
                        <InputLabel htmlFor="google_analytics_id" value="Google Analytics ID" />
                        <TextInput
                            id="google_analytics_id"
                            value={data.google_analytics_id}
                            onChange={(e) => setData('google_analytics_id', e.target.value)}
                            placeholder="G-XXXXXXXXXX"
                        />
                        <InputError message={errors.google_analytics_id} />
                    </div>

                    <div className="space-y-2">
                        <InputLabel htmlFor="google_search_console_verification" value="Google Search Console Verification" />
                        <TextInput
                            id="google_search_console_verification"
                            value={data.google_search_console_verification}
                            onChange={(e) => setData('google_search_console_verification', e.target.value)}
                            placeholder="Verification code"
                        />
                        <InputError message={errors.google_search_console_verification} />
                    </div>
                </div>

                <div className="flex items-center gap-4 pt-6 border-t border-gray-100 dark:border-gray-700">
                    <Button disabled={processing} isActive={true} className="px-8 py-4">
                        Save Changes
                    </Button>
                </div>
            </form>
        </section>
    );

    const renderSmtpTab = () => (
        <section className="max-w-2xl">
            <header>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    SMTP Settings
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Configure email server settings for sending emails.
                </p>
            </header>

            <form onSubmit={submit} className="mt-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <InputLabel htmlFor="smtp_host" value="SMTP Host" />
                        <TextInput
                            id="smtp_host"
                            value={data.smtp_host}
                            onChange={(e) => setData('smtp_host', e.target.value)}
                            placeholder="smtp.example.com"
                        />
                        <InputError message={errors.smtp_host} />
                    </div>

                    <div className="space-y-2">
                        <InputLabel htmlFor="smtp_port" value="SMTP Port" />
                        <TextInput
                            id="smtp_port"
                            type="number"
                            value={data.smtp_port}
                            onChange={(e) => setData('smtp_port', e.target.value)}
                            placeholder="SMTP Port"
                        />
                        <InputError message={errors.smtp_port} />
                    </div>

                    <div className="space-y-2">
                        <InputLabel htmlFor="smtp_username" value="SMTP Username" />
                        <TextInput
                            id="smtp_username"
                            value={data.smtp_username}
                            onChange={(e) => setData('smtp_username', e.target.value)}
                            placeholder="SMTP Username"
                        />
                        <InputError message={errors.smtp_username} />
                    </div>

                    <div className="space-y-2">
                        <InputLabel htmlFor="smtp_password" value="SMTP Password" />
                        <div className="relative">
                            <TextInput
                                id="smtp_password"
                                type={showPassword ? 'text' : 'password'}
                                value={data.smtp_password}
                                onChange={(e) => setData('smtp_password', e.target.value)}
                                className="pr-10"
                                placeholder="SMTP Password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        <InputError message={errors.smtp_password} />
                    </div>

                    <div className="space-y-2">
                        <InputLabel htmlFor="smtp_encryption" value="Encryption" />
                        <Select
                            id="smtp_encryption"
                            value={data.smtp_encryption}
                            onChange={(e) => setData('smtp_encryption', e.target.value)}
                        >
                            <option value="tls">TLS</option>
                            <option value="ssl">SSL</option>
                            <option value="none">None</option>
                        </Select>
                        <InputError message={errors.smtp_encryption} />
                    </div>

                    <div className="space-y-2">
                        <InputLabel htmlFor="smtp_from_address" value="From Email Address" />
                        <TextInput
                            id="smtp_from_address"
                            type="email"
                            value={data.smtp_from_address}
                            onChange={(e) => setData('smtp_from_address', e.target.value)}
                            placeholder="noreply@example.com"
                        />
                        <InputError message={errors.smtp_from_address} />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <InputLabel htmlFor="smtp_from_name" value="From Name" />
                        <TextInput
                            id="smtp_from_name"
                            value={data.smtp_from_name}
                            onChange={(e) => setData('smtp_from_name', e.target.value)}
                            placeholder="Your App Name"
                        />
                        <InputError message={errors.smtp_from_name} />
                    </div>
                </div>

                <div className="flex items-center gap-4 pt-6 border-t border-gray-100 dark:border-gray-700">
                    <Button disabled={processing} isActive={true} className="px-8 py-4">
                        Save Changes
                    </Button>
                </div>
            </form>
        </section>
    );

    const renderNotificationsTab = () => (
        <section className="max-w-2xl">
            <header>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Notification Settings
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Configure email and push notification preferences.
                </p>
            </header>

            <form onSubmit={submit} className="mt-8 space-y-6">
                <div className="space-y-6">
                    <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-700">
                        <div>
                            <InputLabel value="Email Notifications" />
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Enable email notifications for important events
                            </p>
                        </div>
                        <Toggle
                            checked={data.email_notifications_enabled}
                            onChange={(e) => setData('email_notifications_enabled', e.target.checked)}
                        />
                    </div>

                    <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-700">
                        <div>
                            <InputLabel value="Push Notifications" />
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Enable push notifications in the browser
                            </p>
                        </div>
                        <Toggle
                            checked={data.push_notifications_enabled}
                            onChange={(e) => setData('push_notifications_enabled', e.target.checked)}
                        />
                    </div>

                    <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-700">
                        <div>
                            <InputLabel value="Order Notifications" />
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Receive notifications for new orders
                            </p>
                        </div>
                        <Toggle
                            checked={data.order_notification_enabled}
                            onChange={(e) => setData('order_notification_enabled', e.target.checked)}
                        />
                    </div>

                    <div className="space-y-2">
                        <InputLabel htmlFor="notification_email" value="Notification Email" />
                        <TextInput
                            id="notification_email"
                            type="email"
                            value={data.notification_email}
                            onChange={(e) => setData('notification_email', e.target.value)}
                            placeholder="notifications@example.com"
                        />
                        <InputError message={errors.notification_email} />
                    </div>

                    <div className="space-y-2">
                        <InputLabel htmlFor="low_stock_threshold" value="Low Stock Threshold" />
                        <TextInput
                            id="low_stock_threshold"
                            type="number"
                            value={data.low_stock_threshold}
                            onChange={(e) => setData('low_stock_threshold', e.target.value)}
                            placeholder="10"
                        />
                        <InputError message={errors.low_stock_threshold} />
                    </div>
                </div>

                <div className="flex items-center gap-4 pt-6 border-t border-gray-100 dark:border-gray-700">
                    <Button disabled={processing} isActive={true} className="px-8 py-4">
                        Save Changes
                    </Button>
                </div>
            </form>
        </section>
    );

    const renderSecurityTab = () => (
        <section className="max-w-2xl">
            <header>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Security Settings
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Configure password requirements and security features.
                </p>
            </header>

            <form onSubmit={submit} className="mt-8 space-y-6">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <InputLabel htmlFor="password_min_length" value="Minimum Password Length" />
                        <TextInput
                            id="password_min_length"
                            type="number"
                            value={data.password_min_length}
                            onChange={(e) => setData('password_min_length', e.target.value)}
                            min="4"
                            max="128"
                        />
                        <InputError message={errors.password_min_length} />
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            Password Requirements
                        </h3>

                        <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                            <div>
                                <InputLabel value="Require Uppercase Letters" />
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Passwords must contain at least one uppercase letter (A-Z)
                                </p>
                            </div>
                            <Toggle
                                checked={data.password_require_uppercase}
                                onChange={(e) => setData('password_require_uppercase', e.target.checked)}
                            />
                        </div>

                        <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                            <div>
                                <InputLabel value="Require Lowercase Letters" />
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Passwords must contain at least one lowercase letter (a-z)
                                </p>
                            </div>
                            <Toggle
                                checked={data.password_require_lowercase}
                                onChange={(e) => setData('password_require_lowercase', e.target.checked)}
                            />
                        </div>

                        <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                            <div>
                                <InputLabel value="Require Numbers" />
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Passwords must contain at least one number (0-9)
                                </p>
                            </div>
                            <Toggle
                                checked={data.password_require_numbers}
                                onChange={(e) => setData('password_require_numbers', e.target.checked)}
                            />
                        </div>

                        <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                            <div>
                                <InputLabel value="Require Symbols" />
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Passwords must contain at least one symbol (!@#$%^&*)
                                </p>
                            </div>
                            <Toggle
                                checked={data.password_require_symbols}
                                onChange={(e) => setData('password_require_symbols', e.target.checked)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-700">
                        <div>
                            <InputLabel value="Two-Factor Authentication" />
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                Enable two-factor authentication for enhanced security
                            </p>
                        </div>
                        <Toggle
                            checked={data.two_factor_enabled}
                            onChange={(e) => setData('two_factor_enabled', e.target.checked)}
                        />
                    </div>

                    <div className="space-y-2">
                        <InputLabel htmlFor="session_timeout" value="Session Timeout (minutes)" />
                        <TextInput
                            id="session_timeout"
                            type="number"
                            value={data.session_timeout}
                            onChange={(e) => setData('session_timeout', e.target.value)}
                            min="1"
                            max="1440"
                            placeholder="120"
                        />
                        <InputError message={errors.session_timeout} />
                    </div>
                </div>

                <div className="flex items-center gap-4 pt-6 border-t border-gray-100 dark:border-gray-700">
                    <Button disabled={processing} isActive={true} className="w-auto px-8 py-4">
                        Save Changes
                    </Button>
                </div>
            </form>
        </section>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'general':
                return renderGeneralTab();
            case 'payment':
                return renderPaymentTab();
            case 'seo':
                return renderSeoTab();
            case 'smtp':
                return renderSmtpTab();
            case 'notifications':
                return renderNotificationsTab();
            case 'security':
                return renderSecurityTab();
            default:
                return (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                            <SettingsIcon className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            Settings
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-xs mt-2">
                            Select a category to configure settings.
                        </p>
                    </div>
                );
        }
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

            {flash?.success && (
                <div className="mb-4 bg-green-100 dark:bg-green-800 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-200 px-4 py-3 rounded relative" role="alert">
                    <span className="block sm:inline">{flash.success}</span>
                </div>
            )}

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
                                    {renderTabContent()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

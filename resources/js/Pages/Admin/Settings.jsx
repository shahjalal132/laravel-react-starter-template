import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Select from '@/Components/Select';
import Toggle from '@/Components/Toggle';
import Textarea from '@/Components/Textarea';
import { Settings as SettingsIcon, Upload, Globe, Mail, Phone, MapPin, CreditCard, Search, Send, Bell, ShieldCheck, Lock, Eye, EyeOff, Image as ImageIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import Button from '@/Components/Button';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const CURRENCY_SYMBOLS = {
    'BDT': '৳',
    'INR': '₹',
    'USD': '$',
};

export default function Settings({ settings: initialSettings = {}, flash }) {
    const { t: tNav } = useTranslation('navigation');
    const { t } = useTranslation('settings');
    const { props } = usePage();
    const settings = props.settings || initialSettings;

    const [activeTab, setActiveTab] = useState('');
    const [logoPreview, setLogoPreview] = useState(null);
    const [backgroundImagePreview, setBackgroundImagePreview] = useState(null);
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
            language: general.language || 'en',
            logo: null,
            background_image: null,
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
        if (settings.general?.background_image) {
            setBackgroundImagePreview(`/storage/${settings.general.background_image}`);
        }
    }, [settings.general?.logo, settings.general?.background_image]);

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

    // Handle background image preview
    const handleBackgroundImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('background_image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setBackgroundImagePreview(reader.result);
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
        { id: 'general', label: tNav('tabs.general'), icon: Globe, description: t('tabs.general.description') },
        { id: 'payment', label: tNav('tabs.payment'), icon: CreditCard, description: t('tabs.payment.description') },
        { id: 'seo', label: tNav('tabs.seo'), icon: Search, description: t('tabs.seo.description') },
        { id: 'smtp', label: tNav('tabs.smtp'), icon: Send, description: t('tabs.smtp.description') },
        { id: 'notifications', label: tNav('tabs.notifications'), icon: Bell, description: t('tabs.notifications.description') },
        { id: 'security', label: tNav('tabs.security'), icon: ShieldCheck, description: t('tabs.security.description') },
    ];

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.settings.update'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(t('settingsUpdatedSuccess'));
                router.reload({ only: ['settings'] });
            },
            onError: () => {
                toast.error(t('settingsUpdateFailed'));
            },
        });
    };

    const renderGeneralTab = () => (
        <section className="max-w-2xl">
            <header>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {t('general.title')}
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {t('general.description')}
                </p>
            </header>

            <form onSubmit={submit} className="mt-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <InputLabel htmlFor="app_name" value={t('general.appName')} />
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
                                placeholder={t('general.appNamePlaceholder')}
                            />
                        </div>
                        <InputError message={errors.app_name} />
                    </div>

                    <div className="space-y-2">
                        <InputLabel htmlFor="app_email" value={t('general.email')} />
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
                                placeholder={t('general.emailPlaceholder')}
                            />
                        </div>
                        <InputError message={errors.app_email} />
                    </div>

                    <div className="space-y-2">
                        <InputLabel htmlFor="app_phone" value={t('general.phone')} />
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Phone className="h-4 w-4 text-gray-400" />
                            </div>
                            <TextInput
                                id="app_phone"
                                className="w-full pl-10"
                                value={data.app_phone}
                                onChange={(e) => setData('app_phone', e.target.value)}
                                placeholder={t('general.phonePlaceholder')}
                            />
                        </div>
                        <InputError message={errors.app_phone} />
                    </div>

                    <div className="space-y-2">
                        <InputLabel htmlFor="app_address" value={t('general.address')} />
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MapPin className="h-4 w-4 text-gray-400" />
                            </div>
                            <TextInput
                                id="app_address"
                                className="w-full pl-10"
                                value={data.app_address}
                                onChange={(e) => setData('app_address', e.target.value)}
                                placeholder={t('general.addressPlaceholder')}
                            />
                        </div>
                        <InputError message={errors.app_address} />
                    </div>

                    <div className="space-y-2">
                        <InputLabel htmlFor="language" value={t('general.language')} />
                        <Select
                            id="language"
                            value={data.language}
                            onChange={(e) => setData('language', e.target.value)}
                        >
                            <option value="en">{t('languages.en')}</option>
                            <option value="bn">{t('languages.bn')}</option>
                        </Select>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {t('general.languageDescription')}
                        </p>
                        <InputError message={errors.language} />
                    </div>
                </div>

                <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <InputLabel value={t('general.appLogo')} />
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
                                    {t('general.changeLogo')}
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/jpeg,image/png,image/jpg"
                                        onChange={handleLogoChange}
                                    />
                                </label>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {t('general.logoUploadHint')}
                                </p>
                            </div>
                        </div>
                        <InputError message={errors.logo} />
                    </div>

                    <div>
                        <InputLabel value={t('general.backgroundImage')} />
                        <div className="mt-3 flex items-center gap-6">
                            <div className="w-32 h-20 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center shrink-0 shadow-inner overflow-hidden border border-gray-200 dark:border-gray-700">
                                {backgroundImagePreview ? (
                                    <img src={backgroundImagePreview} alt="Background preview" className="w-full h-full object-cover" />
                                ) : (
                                    <ImageIcon className="w-8 h-8 text-gray-400" />
                                )}
                            </div>
                            <div className="space-y-3">
                                <label className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all">
                                    <Upload className="w-4 h-4" />
                                    {t('general.changeBackgroundImage')}
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/jpeg,image/png,image/jpg"
                                        onChange={handleBackgroundImageChange}
                                    />
                                </label>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {t('general.backgroundImageUploadHint')}
                                </p>
                            </div>
                        </div>
                        <InputError message={errors.background_image} />
                    </div>
                </div>

                <div className="flex items-center gap-4 pt-6 border-t border-gray-100 dark:border-gray-700">
                    <Button disabled={processing} isActive={true} className="px-8 py-4">
                        {t('saveChanges')}
                    </Button>
                </div>
            </form>
        </section>
    );

    const renderPaymentTab = () => (
        <section className="max-w-2xl">
            <header>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {t('payment.title')}
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {t('payment.description')}
                </p>
            </header>

            <form onSubmit={submit} className="mt-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <InputLabel htmlFor="payment_gateway" value={t('payment.paymentGateway')} />
                        <Select
                            id="payment_gateway"
                            value={data.payment_gateway}
                            onChange={(e) => setData('payment_gateway', e.target.value)}
                        >
                            <option value="none">{t('payment.none')}</option>
                            <option value="sslcommerz">{t('payment.sslcommerz')}</option>
                            <option value="stripe">{t('payment.stripe')}</option>
                            <option value="paypal">{t('payment.paypal')}</option>
                        </Select>
                        <InputError message={errors.payment_gateway} />
                    </div>

                    <div className="space-y-2">
                        <InputLabel htmlFor="currency" value={t('payment.currency')} />
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
                            <option value="BDT">{t('payment.bdt')}</option>
                            <option value="INR">{t('payment.inr')}</option>
                            <option value="USD">{t('payment.usd')}</option>
                        </Select>
                        <InputError message={errors.currency} />
                    </div>


                    <div className="space-y-2">
                        <InputLabel htmlFor="payment_mode" value={t('payment.paymentMode')} />
                        <Select
                            id="payment_mode"
                            value={data.payment_mode}
                            onChange={(e) => setData('payment_mode', e.target.value)}
                        >
                            <option value="sandbox">{t('payment.sandbox')}</option>
                            <option value="live">{t('payment.live')}</option>
                        </Select>
                        <InputError message={errors.payment_mode} />
                    </div>

                    {data.payment_gateway === 'stripe' && (
                        <>
                            <div className="space-y-2 mt-6 md:col-span-2">
                                <InputLabel htmlFor="stripe_public_key" value={t('payment.stripePublicKey')} />
                                <TextInput
                                    id="stripe_public_key"
                                    value={data.stripe_public_key}
                                    onChange={(e) => setData('stripe_public_key', e.target.value)}
                                    placeholder={t('payment.stripePublicKeyPlaceholder')}
                                />
                                <InputError message={errors.stripe_public_key} />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <InputLabel htmlFor="stripe_secret_key" value={t('payment.stripeSecretKey')} />
                                <TextInput
                                    id="stripe_secret_key"
                                    type="password"
                                    value={data.stripe_secret_key}
                                    onChange={(e) => setData('stripe_secret_key', e.target.value)}
                                    placeholder={t('payment.stripeSecretKeyPlaceholder')}
                                />
                                <InputError message={errors.stripe_secret_key} />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <InputLabel htmlFor="stripe_webhook_secret" value={t('payment.stripeWebhookSecret')} />
                                <TextInput
                                    id="stripe_webhook_secret"
                                    type="password"
                                    value={data.stripe_webhook_secret}
                                    onChange={(e) => setData('stripe_webhook_secret', e.target.value)}
                                    placeholder={t('payment.stripeWebhookSecretPlaceholder')}
                                />
                                <InputError message={errors.stripe_webhook_secret} />
                            </div>
                        </>
                    )}

                    {data.payment_gateway === 'paypal' && (
                        <>
                            <div className="space-y-2 mt-8 md:col-span-2">
                                <InputLabel htmlFor="paypal_client_id" value={t('payment.paypalClientId')} />
                                <TextInput
                                    id="paypal_client_id"
                                    value={data.paypal_client_id}
                                    onChange={(e) => setData('paypal_client_id', e.target.value)}
                                    placeholder={t('payment.paypalClientIdPlaceholder')}
                                />
                                <InputError message={errors.paypal_client_id} />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <InputLabel htmlFor="paypal_secret" value={t('payment.paypalSecret')} />
                                <TextInput
                                    id="paypal_secret"
                                    type="password"
                                    value={data.paypal_secret}
                                    onChange={(e) => setData('paypal_secret', e.target.value)}
                                    placeholder={t('payment.paypalSecretPlaceholder')}
                                />
                                <InputError message={errors.paypal_secret} />
                            </div>
                        </>
                    )}

                    {data.payment_gateway === 'sslcommerz' && (
                        <>
                            <div className="space-y-2 mt-8 md:col-span-2">
                                <InputLabel htmlFor="sslcommerz_store_id" value={t('payment.sslcommerzStoreId')} />
                                <TextInput
                                    id="sslcommerz_store_id"
                                    value={data.sslcommerz_store_id}
                                    onChange={(e) => setData('sslcommerz_store_id', e.target.value)}
                                    placeholder={t('payment.sslcommerzStoreIdPlaceholder')}
                                />
                                <InputError message={errors.sslcommerz_store_id} />
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <InputLabel htmlFor="sslcommerz_store_password" value={t('payment.sslcommerzStorePassword')} />
                                <TextInput
                                    id="sslcommerz_store_password"
                                    type="password"
                                    value={data.sslcommerz_store_password}
                                    onChange={(e) => setData('sslcommerz_store_password', e.target.value)}
                                    placeholder={t('payment.sslcommerzStorePasswordPlaceholder')}
                                />
                                <InputError message={errors.sslcommerz_store_password} />
                            </div>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-4 pt-6 border-t border-gray-100 dark:border-gray-700">
                    <Button disabled={processing} isActive={true} className="w-auto px-8 py-4">
                        {t('saveChanges')}
                    </Button>
                </div>
            </form>
        </section>
    );

    const renderSeoTab = () => (
        <section className="max-w-2xl">
            <header>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {t('seo.title')}
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {t('seo.description')}
                </p>
            </header>

            <form onSubmit={submit} className="mt-8 space-y-6">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <InputLabel htmlFor="meta_title" value={t('seo.metaTitle')} />
                        <TextInput
                            id="meta_title"
                            value={data.meta_title}
                            onChange={(e) => setData('meta_title', e.target.value)}
                            placeholder={t('seo.metaTitlePlaceholder')}
                        />
                        <InputError message={errors.meta_title} />
                    </div>

                    <div className="space-y-2">
                        <InputLabel htmlFor="meta_description" value={t('seo.metaDescription')} />
                        <Textarea
                            id="meta_description"
                            rows={3}
                            value={data.meta_description}
                            onChange={(e) => setData('meta_description', e.target.value)}
                            placeholder={t('seo.metaDescriptionPlaceholder')}
                        />
                        <InputError message={errors.meta_description} />
                    </div>

                    <div className="space-y-2">
                        <InputLabel htmlFor="meta_keywords" value={t('seo.metaKeywords')} />
                        <TextInput
                            id="meta_keywords"
                            value={data.meta_keywords}
                            onChange={(e) => setData('meta_keywords', e.target.value)}
                            placeholder={t('seo.metaKeywordsPlaceholder')}
                        />
                        <InputError message={errors.meta_keywords} />
                    </div>

                    <div className="space-y-2">
                        <InputLabel value={t('seo.ogImage')} />
                        <div className="mt-3 flex items-center gap-6">
                            {ogImagePreview && (
                                <div className="w-32 h-32 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                                    <img src={ogImagePreview} alt="OG Image preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                            <div className="space-y-3">
                                <label className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all">
                                    <ImageIcon className="w-4 h-4" />
                                    {t('seo.uploadImage')}
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/jpeg,image/png,image/jpg"
                                        onChange={handleOgImageChange}
                                    />
                                </label>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {t('seo.imageUploadHint')}
                                </p>
                            </div>
                        </div>
                        <InputError message={errors.og_image} />
                    </div>

                    <div className="space-y-2">
                        <InputLabel htmlFor="google_analytics_id" value={t('seo.googleAnalyticsId')} />
                        <TextInput
                            id="google_analytics_id"
                            value={data.google_analytics_id}
                            onChange={(e) => setData('google_analytics_id', e.target.value)}
                            placeholder={t('seo.googleAnalyticsIdPlaceholder')}
                        />
                        <InputError message={errors.google_analytics_id} />
                    </div>

                    <div className="space-y-2">
                        <InputLabel htmlFor="google_search_console_verification" value={t('seo.googleSearchConsoleVerification')} />
                        <TextInput
                            id="google_search_console_verification"
                            value={data.google_search_console_verification}
                            onChange={(e) => setData('google_search_console_verification', e.target.value)}
                            placeholder={t('seo.googleSearchConsoleVerificationPlaceholder')}
                        />
                        <InputError message={errors.google_search_console_verification} />
                    </div>
                </div>

                <div className="flex items-center gap-4 pt-6 border-t border-gray-100 dark:border-gray-700">
                    <Button disabled={processing} isActive={true} className="px-8 py-4">
                        {t('saveChanges')}
                    </Button>
                </div>
            </form>
        </section>
    );

    const renderSmtpTab = () => (
        <section className="max-w-2xl">
            <header>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {t('smtp.title')}
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {t('smtp.description')}
                </p>
            </header>

            <form onSubmit={submit} className="mt-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <InputLabel htmlFor="smtp_host" value={t('smtp.smtpHost')} />
                        <TextInput
                            id="smtp_host"
                            value={data.smtp_host}
                            onChange={(e) => setData('smtp_host', e.target.value)}
                            placeholder={t('smtp.smtpHostPlaceholder')}
                        />
                        <InputError message={errors.smtp_host} />
                    </div>

                    <div className="space-y-2">
                        <InputLabel htmlFor="smtp_port" value={t('smtp.smtpPort')} />
                        <TextInput
                            id="smtp_port"
                            type="number"
                            value={data.smtp_port}
                            onChange={(e) => setData('smtp_port', e.target.value)}
                            placeholder={t('smtp.smtpPortPlaceholder')}
                        />
                        <InputError message={errors.smtp_port} />
                    </div>

                    <div className="space-y-2">
                        <InputLabel htmlFor="smtp_username" value={t('smtp.smtpUsername')} />
                        <TextInput
                            id="smtp_username"
                            value={data.smtp_username}
                            onChange={(e) => setData('smtp_username', e.target.value)}
                            placeholder={t('smtp.smtpUsernamePlaceholder')}
                        />
                        <InputError message={errors.smtp_username} />
                    </div>

                    <div className="space-y-2">
                        <InputLabel htmlFor="smtp_password" value={t('smtp.smtpPassword')} />
                        <div className="relative">
                            <TextInput
                                id="smtp_password"
                                type={showPassword ? 'text' : 'password'}
                                value={data.smtp_password}
                                onChange={(e) => setData('smtp_password', e.target.value)}
                                className="pr-10"
                                placeholder={t('smtp.smtpPasswordPlaceholder')}
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
                        <InputLabel htmlFor="smtp_encryption" value={t('smtp.encryption')} />
                        <Select
                            id="smtp_encryption"
                            value={data.smtp_encryption}
                            onChange={(e) => setData('smtp_encryption', e.target.value)}
                        >
                            <option value="tls">{t('smtp.tls')}</option>
                            <option value="ssl">{t('smtp.ssl')}</option>
                            <option value="none">{t('smtp.none')}</option>
                        </Select>
                        <InputError message={errors.smtp_encryption} />
                    </div>

                    <div className="space-y-2">
                        <InputLabel htmlFor="smtp_from_address" value={t('smtp.fromEmailAddress')} />
                        <TextInput
                            id="smtp_from_address"
                            type="email"
                            value={data.smtp_from_address}
                            onChange={(e) => setData('smtp_from_address', e.target.value)}
                            placeholder={t('smtp.fromEmailAddressPlaceholder')}
                        />
                        <InputError message={errors.smtp_from_address} />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <InputLabel htmlFor="smtp_from_name" value={t('smtp.fromName')} />
                        <TextInput
                            id="smtp_from_name"
                            value={data.smtp_from_name}
                            onChange={(e) => setData('smtp_from_name', e.target.value)}
                            placeholder={t('smtp.fromNamePlaceholder')}
                        />
                        <InputError message={errors.smtp_from_name} />
                    </div>
                </div>

                <div className="flex items-center gap-4 pt-6 border-t border-gray-100 dark:border-gray-700">
                    <Button disabled={processing} isActive={true} className="px-8 py-4">
                        {t('saveChanges')}
                    </Button>
                </div>
            </form>
        </section>
    );

    const renderNotificationsTab = () => (
        <section className="max-w-2xl">
            <header>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {t('notifications.title')}
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {t('notifications.description')}
                </p>
            </header>

            <form onSubmit={submit} className="mt-8 space-y-6">
                <div className="space-y-6">
                    <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-700">
                        <div>
                            <InputLabel value={t('notifications.emailNotifications')} />
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {t('notifications.emailNotificationsDescription')}
                            </p>
                        </div>
                        <Toggle
                            checked={data.email_notifications_enabled}
                            onChange={(e) => setData('email_notifications_enabled', e.target.checked)}
                        />
                    </div>

                    <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-700">
                        <div>
                            <InputLabel value={t('notifications.pushNotifications')} />
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {t('notifications.pushNotificationsDescription')}
                            </p>
                        </div>
                        <Toggle
                            checked={data.push_notifications_enabled}
                            onChange={(e) => setData('push_notifications_enabled', e.target.checked)}
                        />
                    </div>

                    <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-700">
                        <div>
                            <InputLabel value={t('notifications.orderNotifications')} />
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {t('notifications.orderNotificationsDescription')}
                            </p>
                        </div>
                        <Toggle
                            checked={data.order_notification_enabled}
                            onChange={(e) => setData('order_notification_enabled', e.target.checked)}
                        />
                    </div>

                    <div className="space-y-2">
                        <InputLabel htmlFor="notification_email" value={t('notifications.notificationEmail')} />
                        <TextInput
                            id="notification_email"
                            type="email"
                            value={data.notification_email}
                            onChange={(e) => setData('notification_email', e.target.value)}
                            placeholder={t('notifications.notificationEmailPlaceholder')}
                        />
                        <InputError message={errors.notification_email} />
                    </div>

                    <div className="space-y-2">
                        <InputLabel htmlFor="low_stock_threshold" value={t('notifications.lowStockThreshold')} />
                        <TextInput
                            id="low_stock_threshold"
                            type="number"
                            value={data.low_stock_threshold}
                            onChange={(e) => setData('low_stock_threshold', e.target.value)}
                            placeholder={t('notifications.lowStockThresholdPlaceholder')}
                        />
                        <InputError message={errors.low_stock_threshold} />
                    </div>
                </div>

                <div className="flex items-center gap-4 pt-6 border-t border-gray-100 dark:border-gray-700">
                    <Button disabled={processing} isActive={true} className="px-8 py-4">
                        {t('saveChanges')}
                    </Button>
                </div>
            </form>
        </section>
    );

    const renderSecurityTab = () => (
        <section className="max-w-2xl">
            <header>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {t('security.title')}
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {t('security.description')}
                </p>
            </header>

            <form onSubmit={submit} className="mt-8 space-y-6">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <InputLabel htmlFor="password_min_length" value={t('security.passwordMinLength')} />
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
                            {t('security.passwordRequirements')}
                        </h3>

                        <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                            <div>
                                <InputLabel value={t('security.requireUppercase')} />
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {t('security.requireUppercaseDescription')}
                                </p>
                            </div>
                            <Toggle
                                checked={data.password_require_uppercase}
                                onChange={(e) => setData('password_require_uppercase', e.target.checked)}
                            />
                        </div>

                        <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                            <div>
                                <InputLabel value={t('security.requireLowercase')} />
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {t('security.requireLowercaseDescription')}
                                </p>
                            </div>
                            <Toggle
                                checked={data.password_require_lowercase}
                                onChange={(e) => setData('password_require_lowercase', e.target.checked)}
                            />
                        </div>

                        <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                            <div>
                                <InputLabel value={t('security.requireNumbers')} />
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {t('security.requireNumbersDescription')}
                                </p>
                            </div>
                            <Toggle
                                checked={data.password_require_numbers}
                                onChange={(e) => setData('password_require_numbers', e.target.checked)}
                            />
                        </div>

                        <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                            <div>
                                <InputLabel value={t('security.requireSymbols')} />
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {t('security.requireSymbolsDescription')}
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
                            <InputLabel value={t('security.twoFactorAuthentication')} />
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {t('security.twoFactorAuthenticationDescription')}
                            </p>
                        </div>
                        <Toggle
                            checked={data.two_factor_enabled}
                            onChange={(e) => setData('two_factor_enabled', e.target.checked)}
                        />
                    </div>

                    <div className="space-y-2">
                        <InputLabel htmlFor="session_timeout" value={t('security.sessionTimeout')} />
                        <TextInput
                            id="session_timeout"
                            type="number"
                            value={data.session_timeout}
                            onChange={(e) => setData('session_timeout', e.target.value)}
                            min="1"
                            max="1440"
                            placeholder={t('security.sessionTimeoutPlaceholder')}
                        />
                        <InputError message={errors.session_timeout} />
                    </div>
                </div>

                <div className="flex items-center gap-4 pt-6 border-t border-gray-100 dark:border-gray-700">
                    <Button disabled={processing} isActive={true} className="w-auto px-8 py-4">
                        {t('saveChanges')}
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
                            {t('headTitle')}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-xs mt-2">
                            {t('selectCategory')}
                        </p>
                    </div>
                );
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    {t('pageTitle')}
                </h2>
            }
        >
            <Head title={t('headTitle')} />

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

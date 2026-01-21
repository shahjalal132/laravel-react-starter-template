import { Link, usePage, Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    ShoppingBag,
    User,
    ChevronDown,
    ChevronRight,
    Menu,
    Search,
    MoreHorizontal,
    Grid3x3,
    LogOut,
    Download,
    Globe,
    Settings,
    ArrowLeft,
    X,
} from 'lucide-react';
import ThemeToggle from '@/Components/ThemeToggle';
import { Toaster } from 'react-hot-toast';

export default function AuthenticatedLayout({ header, children }) {
    const { auth, settings } = usePage().props;
    const user = auth.user;
    
    // Initialize sidebar state from localStorage
    const [sidebarOpen, setSidebarOpen] = useState(() => {
        const saved = localStorage.getItem('sidebar-open');
        return saved !== null ? JSON.parse(saved) : true;
    });
    
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    
    // Initialize open menus from localStorage
    const [openMenus, setOpenMenus] = useState(() => {
        const saved = localStorage.getItem('open-menus');
        return saved !== null ? JSON.parse(saved) : {
            dashboard: true,
            aiAssistant: false,
            ecommerce: false,
            task: false,
            forms: false,
            tables: false,
            pages: false,
        };
    });

    // Persist sidebar state
    useEffect(() => {
        localStorage.setItem('sidebar-open', JSON.stringify(sidebarOpen));
    }, [sidebarOpen]);

    // Persist open menus state
    useEffect(() => {
        localStorage.setItem('open-menus', JSON.stringify(openMenus));
    }, [openMenus]);

    const toggleMenu = (menu) => {
        setOpenMenus((prev) => ({
            ...prev,
            [menu]: !prev[menu],
        }));
    };

    const menuItems = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: LayoutDashboard,
            hasSubmenu: false,
            route: 'admin.dashboard',
        },
        {
            id: 'ecommerce',
            label: 'E-commerce',
            icon: ShoppingBag,
            hasSubmenu: true,
            submenu: [
                { label: 'Products', route: 'admin.dashboard' }, // Placeholder routes
                { label: 'Orders', route: 'admin.dashboard' },
                { label: 'Customers', route: 'admin.dashboard' },
            ]
        },
        {
            id: 'settings',
            label: 'Settings',
            icon: Settings,
            hasSubmenu: true,
            route: 'admin.settings',
            submenu: [
                { label: 'General', route: 'admin.settings', params: { tab: 'general' } },
                { label: 'Payment', route: 'admin.settings', params: { tab: 'payment' } },
                { label: 'SEO', route: 'admin.settings', params: { tab: 'seo' } },
                { label: 'SMTP', route: 'admin.settings', params: { tab: 'smtp' } },
                { label: 'Notifications', route: 'admin.settings', params: { tab: 'notifications' } },
                { label: 'Security', route: 'admin.settings', params: { tab: 'security' } },
            ]
        },
    ];

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                document.getElementById('main-search-input')?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        const results = [];
        const searchRecursive = (menuItems, parentPath = '') => {
            menuItems.forEach(item => {
                const currentPath = parentPath ? `${parentPath} > ${item.label}` : item.label;
                if (item.label.toLowerCase().includes(query.toLowerCase())) {
                    if (item.route) {
                        results.push({
                            ...item,
                            path: currentPath,
                            displayLabel: item.label
                        });
                    }
                }
                if (item.submenu) {
                    searchRecursive(item.submenu, currentPath);
                }
            });
        };

        searchRecursive(menuItems);
        setSearchResults(results);
    };

    const appName = settings?.general?.app_name || 'TailAdmin';
    const appLogo = settings?.general?.logo;
    const metaTitle = settings?.seo?.meta_title;

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
            {metaTitle && <Head title={metaTitle} />}
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 lg:static lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0 lg:w-20'
                }`}
            >
                <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700">
                    <Link href="/" className="flex items-center gap-2">
                        {appLogo ? (
                            <img src={`/storage/${appLogo}`} alt={appName} className="w-10 h-10 rounded-xl object-cover shrink-0" />
                        ) : (
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
                                <div className="flex flex-col gap-0.5">
                                    <div className="flex gap-0.5">
                                        <div className="w-1 h-3 bg-white rounded-full"></div>
                                        <div className="w-1 h-3 bg-white rounded-full"></div>
                                        <div className="w-1 h-3 bg-white rounded-full"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <span className={`text-xl font-bold text-gray-800 dark:text-gray-100 transition-opacity duration-300 ${
                            sidebarOpen ? 'opacity-100' : 'lg:opacity-0 lg:hidden'
                        }`}>
                            {appName}
                        </span>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="p-2 lg:hidden hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300 rotate-180" />
                    </button>
                </div>

                <div className={`px-6 py-4 transition-opacity duration-300 ${
                    sidebarOpen ? 'opacity-100' : 'lg:opacity-0 lg:hidden'
                }`}>
                    <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                        Menu
                    </span>
                </div>

                <nav className="flex-1 px-3 pb-4 overflow-y-auto custom-scrollbar">
                    {menuItems.map((item) => {
                        const isLink = item.route && (!item.hasSubmenu || !sidebarOpen);
                        const Component = isLink ? Link : 'button';
                        const componentProps = isLink
                            ? { href: route(item.route) }
                            : {
                                  onClick: () =>
                                      item.hasSubmenu && toggleMenu(item.id),
                              };

                        return (
                            <div key={item.id} className="mb-1">
                                <Component
                                    {...componentProps}
                                    className="w-full flex items-center justify-between px-3 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors group"
                                    title={!sidebarOpen ? item.label : ''}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon
                                            className={`w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 shrink-0 ${
                                                !sidebarOpen && 'lg:mx-auto'
                                            }`}
                                        />
                                        <span
                                            className={`text-sm font-medium transition-opacity duration-300 ${
                                                sidebarOpen
                                                    ? 'opacity-100'
                                                    : 'lg:opacity-0 lg:hidden'
                                            }`}
                                        >
                                            {item.label}
                                        </span>
                                        {sidebarOpen && item.badge && (
                                            <span className="px-2 py-0.5 text-xs font-semibold bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded">
                                                {item.badge}
                                            </span>
                                        )}
                                    </div>
                                    {sidebarOpen && item.hasSubmenu && (
                                        <div className="transition-transform duration-200">
                                            {openMenus[item.id] ? (
                                                <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                            ) : (
                                                <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                            )}
                                        </div>
                                    )}
                                </Component>

                                {sidebarOpen &&
                                    item.hasSubmenu &&
                                    openMenus[item.id] &&
                                    item.submenu && item.submenu.length > 0 && (
                                        <div className="ml-11 mt-1 space-y-1">
                                            {item.submenu.map((subitem, idx) => (
                                                <Link
                                                    key={`${item.id}-${idx}`}
                                                    href={route(subitem.route, subitem.params || {})}
                                                    className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors flex items-center justify-between ${
                                                        subitem.active
                                                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium'
                                                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                                    }`}
                                                >
                                                    <span>{subitem.label}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                            </div>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4 sticky top-0 z-30">
                    <div className="flex items-center justify-between gap-4">
                        {!isMobileSearchOpen ? (
                            <>
                                <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                                    <button
                                        onClick={() => setSidebarOpen(!sidebarOpen)}
                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors shrink-0"
                                    >
                                        <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                    </button>

                                    <div className="relative flex-1 max-w-md hidden md:block">
                                        <Search className="w-5 h-5 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input
                                            id="main-search-input"
                                            type="text"
                                            placeholder="Search menu..."
                                            value={searchQuery}
                                            onChange={(e) => handleSearch(e.target.value)}
                                            onFocus={() => setIsSearchFocused(true)}
                                            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                                            className="pl-10 pr-12 py-2 w-full border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                                        />
                                        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-[10px] font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded hidden sm:block">
                                            ⌘K
                                        </kbd>

                                        {isSearchFocused && searchResults.length > 0 && (
                                            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50 max-h-96 overflow-y-auto">
                                                {searchResults.map((result, index) => (
                                                    <Link
                                                        key={`${result.route}-${index}`}
                                                        href={route(result.route, result.params || {})}
                                                        className="flex flex-col px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            {result.icon ? (
                                                                <result.icon className="w-4 h-4 text-gray-400" />
                                                            ) : (
                                                                <ChevronRight className="w-4 h-4 text-gray-400" />
                                                            )}
                                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                                                {result.displayLabel}
                                                            </span>
                                                        </div>
                                                        <div className="text-[10px] text-gray-400 dark:text-gray-500 ml-7">
                                                            {result.path}
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Mobile Search Icon */}
                                    <button 
                                        onClick={() => setIsMobileSearchOpen(true)}
                                        className="p-2 md:hidden hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    >
                                        <Search className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                    </button>
                                </div>

                                <div className="flex items-center gap-1 sm:gap-3 shrink-0">
                                    <Link
                                        href="/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors hidden sm:flex"
                                        title="Go to frontend"
                                    >
                                        <Globe className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                    </Link>
                                    <ThemeToggle />
                                    
                                    <div className="relative">
                                        <button
                                            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                            className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-r-lg pr-1 sm:pr-2 py-1 transition-colors"
                                        >
                                            <img
                                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=3b82f6&color=fff`}
                                                alt={user.name}
                                                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full shrink-0"
                                            />
                                            <div className="hidden sm:flex items-center gap-2">
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate max-w-[100px]">
                                                    {user.name}
                                                </span>
                                                <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                            </div>
                                        </button>

                                        {userDropdownOpen && (
                                            <div className="absolute right-0 mt-2 w-64 sm:w-72 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                                                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                                                    <div className="font-semibold text-gray-800 dark:text-gray-100 truncate">
                                                        {user.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                                        {user.email}
                                                    </div>
                                                </div>

                                                <div className="py-2">
                                                    <Link
                                                        href={route('profile.edit')}
                                                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                                    >
                                                        <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                                            Edit profile
                                                        </span>
                                                    </Link>
                                                </div>

                                                <div className="border-t border-gray-100 dark:border-gray-700 pt-2">
                                                    <Link
                                                        href={route('logout')}
                                                        method="post"
                                                        as="button"
                                                        className="w-full text-left flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                                    >
                                                        <LogOut className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                                            Sign out
                                                        </span>
                                                    </Link>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-2 w-full">
                                <button 
                                    onClick={() => setIsMobileSearchOpen(false)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                </button>
                                <div className="relative flex-1">
                                    <Search className="w-5 h-5 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="Search menu..."
                                        value={searchQuery}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        className="pl-10 pr-10 py-2 w-full border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                                    />
                                    {searchQuery && (
                                        <button 
                                            onClick={() => handleSearch('')}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                                        >
                                            <X className="w-4 h-4 text-gray-400" />
                                        </button>
                                    )}
                                </div>
                                {searchResults.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 shadow-xl border-b border-gray-200 dark:border-gray-700 py-2 z-50 max-h-[calc(100vh-80px)] overflow-y-auto">
                                        {searchResults.map((result, index) => (
                                            <Link
                                                key={`${result.route}-${index}`}
                                                href={route(result.route, result.params || {})}
                                                onClick={() => setIsMobileSearchOpen(false)}
                                                className="flex flex-col px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-50 dark:border-gray-700 last:border-0"
                                            >
                                                <div className="flex items-center gap-3">
                                                    {result.icon ? (
                                                        <result.icon className="w-4 h-4 text-gray-400" />
                                                    ) : (
                                                        <ChevronRight className="w-4 h-4 text-gray-400" />
                                                    )}
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                                        {result.displayLabel}
                                                    </span>
                                                </div>
                                                <div className="text-[10px] text-gray-400 dark:text-gray-500 ml-7">
                                                    {result.path}
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </header>

                {header && (
                    <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                        <div className="px-4 sm:px-10 py-4 sm:py-5">
                            {header}
                        </div>
                    </div>
                )}

                <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
                    <div className="p-4 sm:p-6">{children}</div>
                </main>
            </div>
        </div>
    );
}

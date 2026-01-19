import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    LayoutDashboard,
    ShoppingBag,
    Bot,
    Package,
    User,
    CheckSquare,
    FileText,
    Table,
    File,
    ChevronDown,
    ChevronRight,
    Menu,
    Search,
    Moon,
    Bell,
    MoreHorizontal,
    Grid3x3,
    Settings,
    Info,
    LogOut,
    MessageCircle,
    Languages,
    Mail,
    Clock,
    Box,
    Download,
} from 'lucide-react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [openMenus, setOpenMenus] = useState({
        dashboard: true,
        aiAssistant: false,
        ecommerce: false,
        task: false,
        forms: false,
        tables: false,
        pages: false,
    });

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
            hasSubmenu: true,
            submenu: [
                { label: 'Ecommerce', active: true },
                { label: 'Analytics' },
                { label: 'Marketing' },
                { label: 'CRM' },
            ],
        },
        {
            id: 'apps',
            label: 'Apps',
            icon: Grid3x3,
            hasSubmenu: false,
        },
        {
            id: 'ecommerce',
            label: 'E-commerce',
            icon: ShoppingBag,
            badge: 'NEW',
            hasSubmenu: true,
            submenu: [],
        },
        {
            id: 'download',
            label: 'Download',
            icon: Download,
            hasSubmenu: false,
        },
    ];

    return (
        <div className="flex h-screen bg-gray-50">
            <aside
                className={`${sidebarOpen ? 'w-64' : 'w-20'
                    } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
            >
                <div className="h-16 flex items-center justify-center border-b border-gray-200">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                            <div className="flex flex-col gap-0.5">
                                <div className="flex gap-0.5">
                                    <div className="w-1 h-3 bg-white rounded-full"></div>
                                    <div className="w-1 h-3 bg-white rounded-full"></div>
                                    <div className="w-1 h-3 bg-white rounded-full"></div>
                                </div>
                            </div>
                        </div>
                        {sidebarOpen && (
                            <span className="text-xl font-bold text-gray-800">
                                TailAdmin
                            </span>
                        )}
                    </Link>
                </div>

                {sidebarOpen && (
                    <div className="px-6 py-4">
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                            Menu
                        </span>
                    </div>
                )}

                <nav className="flex-1 px-3 pb-4 overflow-y-auto">
                    {menuItems.map((item) => {
                        if (item.isDivider) {
                            return (
                                <div
                                    key={item.id}
                                    className="my-3 flex justify-center"
                                >
                                    <MoreHorizontal className="w-5 h-5 text-gray-300" />
                                </div>
                            );
                        }

                        return (
                            <div key={item.id} className="mb-1">
                                <button
                                    onClick={() =>
                                        item.hasSubmenu && toggleMenu(item.id)
                                    }
                                    className="w-full flex items-center justify-between px-3 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors group"
                                    title={!sidebarOpen ? item.label : ''}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon
                                            className={`w-5 h-5 text-gray-500 group-hover:text-blue-600 ${!sidebarOpen && 'mx-auto'
                                                }`}
                                        />
                                        {sidebarOpen && (
                                            <>
                                                <span className="text-sm font-medium">
                                                    {item.label}
                                                </span>
                                                {item.badge && (
                                                    <span className="px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-700 rounded">
                                                        {item.badge}
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </div>
                                    {sidebarOpen && item.hasSubmenu && (
                                        <>
                                            {openMenus[item.id] ? (
                                                <ChevronDown className="w-4 h-4 text-gray-400" />
                                            ) : (
                                                <ChevronRight className="w-4 h-4 text-gray-400" />
                                            )}
                                        </>
                                    )}
                                </button>

                                {sidebarOpen &&
                                    item.hasSubmenu &&
                                    openMenus[item.id] &&
                                    item.submenu.length > 0 && (
                                        <div className="ml-11 mt-1 space-y-1">
                                            {item.submenu.map(
                                                (subitem, idx) => (
                                                    <button
                                                        key={`${item.id}-${idx}`}
                                                        className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors flex items-center justify-between ${subitem.active
                                                            ? 'bg-blue-50 text-blue-600 font-medium'
                                                            : 'text-gray-600 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        <span>
                                                            {subitem.label}
                                                        </span>
                                                        {subitem.badge && (
                                                            <span className="px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-700 rounded">
                                                                {
                                                                    subitem.badge
                                                                }
                                                            </span>
                                                        )}
                                                    </button>
                                                ),
                                            )}
                                        </div>
                                    )}
                            </div>
                        );
                    })}
                </nav>
            </aside>

            {/* Header */}
            <div className="flex-1 flex flex-col">
                <header className="bg-white border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <Menu className="w-5 h-5 text-gray-600" />
                            </button>

                            <div className="relative">
                                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search or type command..."
                                    className="pl-10 pr-20 py-2 w-96 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-200 rounded">
                                    ⌘K
                                </kbd>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <Moon className="w-5 h-5 text-gray-600" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <Bell className="w-5 h-5 text-gray-600" />
                            </button> */}
                            <div className="relative">
                                <button
                                    onClick={() =>
                                        setUserDropdownOpen(!userDropdownOpen)
                                    }
                                    className="flex items-center gap-2 pl-3 border-l border-gray-200 hover:bg-gray-50 rounded-r-lg pr-2 py-1 transition-colors"
                                >
                                    <img
                                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                                            user.name,
                                        )}&background=3b82f6&color=fff`}
                                        alt={user.name}
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-gray-700">
                                            {user.name}
                                        </span>
                                        <ChevronDown className="w-4 h-4 text-gray-400" />
                                    </div>
                                </button>

                                {userDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <div className="font-semibold text-gray-800">
                                                {user.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {user.email}
                                            </div>
                                        </div>

                                        <div className="py-2">
                                            <Link
                                                href={route('profile.edit')}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                                            >
                                                <User className="w-5 h-5 text-gray-500" />
                                                <span className="text-sm font-medium text-gray-700">
                                                    Edit profile
                                                </span>
                                            </Link>
                                        </div>

                                        <div className="border-t border-gray-100 pt-2">
                                            <Link
                                                href={route('logout')}
                                                method="post"
                                                as="button"
                                                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors"
                                            >
                                                <LogOut className="w-5 h-5 text-gray-500" />
                                                <span className="text-sm font-medium text-gray-700">
                                                    Sign out
                                                </span>
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {header && (
                    <div className="border-b border-gray-200 bg-white">
                        <div className="mx-auto max-w-7xl px-6 py-4">
                            {header}
                        </div>
                    </div>
                )}

                <main className="flex-1 p-6 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">{children}</div>
                </main>
            </div>
        </div>
    );
}

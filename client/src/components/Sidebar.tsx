'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    CheckSquare,
    User,
    Settings,
    LogOut,
    Zap
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

export default function Sidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
        { icon: CheckSquare, label: 'Tasks', href: '/dashboard/tasks' },
        { icon: User, label: 'Profile', href: '/dashboard/profile' },
    ];

    return (
        <aside className="w-64 h-screen fixed left-0 top-0 glass border-r border-border flex flex-col z-40">
            <div className="p-6 flex items-center gap-2 mb-8">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                    <Zap className="text-white fill-white" size={18} />
                </div>
                <span className="text-xl font-bold tracking-tight">PrimeTrade</span>
            </div>

            <nav className="flex-grow px-4 space-y-2">
                {menuItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                            pathname === item.href
                                ? "bg-primary text-white shadow-lg shadow-primary/25"
                                : "text-gray-400 hover:bg-white/5 hover:text-white"
                        )}
                    >
                        <item.icon size={20} className={cn(
                            pathname === item.href ? "text-white" : "group-hover:text-primary transition-colors"
                        )} />
                        <span className="font-medium">{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-border">
                <div className="flex items-center gap-3 px-4 py-3 mb-2">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
                        {user?.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div className="flex-grow overflow-hidden">
                        <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 group"
                >
                    <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
}

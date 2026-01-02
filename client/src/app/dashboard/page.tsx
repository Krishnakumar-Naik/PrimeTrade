'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import {
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    Clock,
    AlertCircle,
    CheckCircle2,
    Trash2,
    Edit,
    Loader2
} from 'lucide-react';
import api from '@/lib/api';
import { cn, formatDate } from '@/lib/utils';

import TaskModal from '@/components/TaskModal';

interface Task {
    _id: string;
    title: string;
    description: string;
    status: 'todo' | 'in-progress' | 'completed';
    priority: 'low' | 'medium' | 'high';
    createdAt: string;
}

export default function DashboardPage() {
    const { user, loading } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isFetchingTasks, setIsFetchingTasks] = useState(true);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        setIsFetchingTasks(true);
        try {
            const response = await api.get('/tasks');
            setTasks(response.data);
        } catch (err) {
            console.error('Failed to fetch tasks', err);
        } finally {
            setIsFetchingTasks(false);
        }
    };

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const deleteTask = async (id: string) => {
        if (!confirm('Are you sure you want to delete this task?')) return;
        try {
            await api.delete(`/tasks/${id}`);
            setTasks(tasks.filter(t => t._id !== id));
        } catch (err) {
            console.error('Failed to delete task', err);
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'text-red-500 bg-red-500/10';
            case 'medium': return 'text-amber-500 bg-amber-500/10';
            case 'low': return 'text-emerald-500 bg-emerald-500/10';
            default: return 'text-gray-500 bg-gray-500/10';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return <CheckCircle2 className="text-emerald-500" size={18} />;
            case 'in-progress': return <Clock className="text-amber-500" size={18} />;
            default: return <AlertCircle className="text-gray-500" size={18} />;
        }
    };

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-background">
            <Loader2 className="animate-spin text-primary" size={48} />
        </div>
    );

    return (
        <div className="min-h-screen bg-background flex">
            <Sidebar />

            <main className="flex-grow ml-64 p-8">
                <header className="flex justify-between items-start mb-12">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Welcome Back, {user?.name}</h1>
                        <p className="text-gray-400">Here's what's happening with your tasks today.</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 w-64 text-sm"
                            />
                        </div>
                        <button
                            onClick={() => {
                                setEditingTask(null);
                                setShowTaskModal(true);
                            }}
                            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
                        >
                            <Plus size={18} /> New Task
                        </button>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'Total Tasks', value: tasks.length, color: 'primary' },
                        { label: 'Completed', value: tasks.filter(t => t.status === 'completed').length, color: 'emerald' },
                        { label: 'In Progress', value: tasks.filter(t => t.status === 'in-progress').length, color: 'amber' },
                        { label: 'Pending', value: tasks.filter(t => t.status === 'todo').length, color: 'gray' },
                    ].map((stat, i) => (
                        <div key={i} className="glass p-6 rounded-3xl">
                            <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                            <p className="text-3xl font-bold">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Tasks Section */}
                <div className="glass rounded-3xl overflow-hidden">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center">
                        <h2 className="text-xl font-bold">Recent Tasks</h2>
                        <div className="flex items-center gap-3">
                            <Filter size={18} className="text-gray-500" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="bg-transparent border-none text-gray-400 text-sm focus:ring-0 cursor-pointer outline-none hover:text-white transition-colors"
                            >
                                <option value="all" className="bg-[#121212]">All Status</option>
                                <option value="todo" className="bg-[#121212]">Todo</option>
                                <option value="in-progress" className="bg-[#121212]">In Progress</option>
                                <option value="completed" className="bg-[#121212]">Completed</option>
                            </select>
                        </div>
                    </div>

                    <div className="p-0">
                        {isFetchingTasks ? (
                            <div className="py-20 flex flex-col items-center justify-center gap-4">
                                <Loader2 className="animate-spin text-primary" size={32} />
                                <p className="text-gray-500">Syncing with blockchain...</p>
                            </div>
                        ) : filteredTasks.length > 0 ? (
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-gray-500 text-sm border-b border-white/5">
                                        <th className="px-6 py-4 font-medium">Task Details</th>
                                        <th className="px-6 py-4 font-medium">Status</th>
                                        <th className="px-6 py-4 font-medium">Priority</th>
                                        <th className="px-6 py-4 font-medium">Created</th>
                                        <th className="px-6 py-4 font-medium">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredTasks.map((task) => (
                                        <tr key={task._id} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-5">
                                                <div className="font-semibold text-white">{task.title}</div>
                                                <div className="text-gray-500 text-sm truncate max-w-xs">{task.description}</div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2 text-sm capitalize">
                                                    {getStatusIcon(task.status)}
                                                    {task.status.replace('-', ' ')}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={cn("px-2 py-1 rounded-lg text-xs font-bold uppercase tracking-wider", getPriorityColor(task.priority))}>
                                                    {task.priority}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-gray-500 text-sm">
                                                {formatDate(task.createdAt)}
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2 transition-opacity">
                                                    <button
                                                        className="p-2 hover:bg-white/10 rounded-lg text-gray-300 hover:text-white transition-all"
                                                        onClick={() => {
                                                            setEditingTask(task);
                                                            setShowTaskModal(true);
                                                        }}
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        className="p-2 hover:bg-red-500/10 rounded-lg text-gray-300 hover:text-red-500 transition-all"
                                                        onClick={() => deleteTask(task._id)}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="py-20 text-center">
                                <div className="bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle2 className="text-gray-600" size={32} />
                                </div>
                                <h3 className="text-xl font-bold mb-1">No tasks found</h3>
                                <p className="text-gray-500">Start by creating your first task entity.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <TaskModal
                isOpen={showTaskModal}
                onClose={() => setShowTaskModal(false)}
                onSuccess={fetchTasks}
                task={editingTask}
            />
        </div>
    );
}

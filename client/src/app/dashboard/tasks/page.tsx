'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/context/AuthContext';
import {
    Plus,
    Search,
    Clock,
    AlertCircle,
    CheckCircle2,
    Trash2,
    Edit,
    Loader2,
    Filter
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

export default function TasksPage() {
    const { loading } = useAuth();
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
        if (!confirm('Are you sure?')) return;
        try {
            await api.delete(`/tasks/${id}`);
            setTasks(tasks.filter(t => t._id !== id));
        } catch (err) {
            console.error(err);
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

    if (loading) return null;

    return (
        <div className="min-h-screen bg-background flex">
            <Sidebar />
            <main className="flex-grow ml-64 p-8">
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Task Management</h1>
                        <p className="text-gray-400">Organize and track your development entities.</p>
                    </div>
                    <button
                        onClick={() => { setEditingTask(null); setShowTaskModal(true); }}
                        className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-primary/20 transition-all"
                    >
                        <Plus size={20} /> Create Entity
                    </button>
                </header>

                <div className="glass p-6 rounded-3xl mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search by title or description..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary/50 text-sm"
                        />
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <Filter size={18} className="text-gray-500" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/50 text-gray-300 outline-none cursor-pointer"
                        >
                            <option value="all" className="bg-[#121212]">All Status</option>
                            <option value="todo" className="bg-[#121212]">Todo</option>
                            <option value="in-progress" className="bg-[#121212]">In Progress</option>
                            <option value="completed" className="bg-[#121212]">Completed</option>
                        </select>
                    </div>
                </div>

                <div className="glass rounded-3xl overflow-hidden">
                    {isFetchingTasks ? (
                        <div className="py-20 flex flex-col items-center justify-center gap-4">
                            <Loader2 className="animate-spin text-primary" size={32} />
                            <p className="text-gray-500">Loading entities...</p>
                        </div>
                    ) : filteredTasks.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-gray-500 text-sm border-b border-white/5">
                                        <th className="px-6 py-4 font-medium">Entity Name</th>
                                        <th className="px-6 py-4 font-medium">Status</th>
                                        <th className="px-6 py-4 font-medium">Priority</th>
                                        <th className="px-6 py-4 font-medium">Date Created</th>
                                        <th className="px-6 py-4 font-medium text-right">Actions</th>
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
                                                <span className={cn(
                                                    "px-3 py-1 rounded-full text-xs font-semibold capitalize flex items-center gap-1.5 w-fit",
                                                    task.status === 'completed' ? "bg-emerald-500/10 text-emerald-500" :
                                                        task.status === 'in-progress' ? "bg-amber-500/10 text-amber-500" :
                                                            "bg-gray-500/10 text-gray-500"
                                                )}>
                                                    <span className={cn("w-1.5 h-1.5 rounded-full",
                                                        task.status === 'completed' ? "bg-emerald-500" :
                                                            task.status === 'in-progress' ? "bg-amber-500" :
                                                                "bg-gray-500"
                                                    )} />
                                                    {task.status.replace('-', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={cn("px-2 py-1 rounded-lg text-xs font-bold uppercase tracking-wider", getPriorityColor(task.priority))}>
                                                    {task.priority}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-gray-500 text-sm">
                                                {formatDate(task.createdAt)}
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => { setEditingTask(task); setShowTaskModal(true); }}
                                                        className="p-2 hover:bg-white/10 rounded-lg text-gray-300 hover:text-white transition-all"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteTask(task._id)}
                                                        className="p-2 hover:bg-red-500/10 rounded-lg text-gray-300 hover:text-red-500 transition-all"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="py-20 text-center text-gray-500">
                            No tasks matched your search criteria.
                        </div>
                    )}
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

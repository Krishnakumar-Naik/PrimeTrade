'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Save } from 'lucide-react';
import api from '@/lib/api';

interface Task {
    _id?: string;
    title: string;
    description: string;
    status: string;
    priority: string;
}

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    task?: Task | null;
}

export default function TaskModal({ isOpen, onClose, onSuccess, task }: TaskModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Task>({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
    });

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title,
                description: task.description,
                status: task.status,
                priority: task.priority,
            });
        } else {
            setFormData({
                title: '',
                description: '',
                status: 'todo',
                priority: 'medium',
            });
        }
    }, [task, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (task?._id) {
                await api.put(`/tasks/${task._id}`, formData);
            } else {
                await api.post('/tasks', formData);
            }
            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="w-full max-w-lg glass p-8 rounded-3xl relative z-10 shadow-2xl"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold">{task ? 'Edit Task' : 'New Task Entity'}</h2>
                            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400 ml-1">Title</label>
                                <input
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 focus:ring-2 focus:ring-primary/50 text-white"
                                    placeholder="Analyze market trends..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400 ml-1">Description</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 focus:ring-2 focus:ring-primary/50 text-white resize-none"
                                    placeholder="Detailed analytics report for Q1..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400 ml-1">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full bg-[#121212] border border-white/10 rounded-2xl py-3.5 px-4 focus:ring-2 focus:ring-primary/50 text-white appearance-none cursor-pointer"
                                    >
                                        <option value="todo" className="bg-[#121212]">Todo</option>
                                        <option value="in-progress" className="bg-[#121212]">In Progress</option>
                                        <option value="completed" className="bg-[#121212]">Completed</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400 ml-1">Priority</label>
                                    <select
                                        value={formData.priority}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                        className="w-full bg-[#121212] border border-white/10 rounded-2xl py-3.5 px-4 focus:ring-2 focus:ring-primary/50 text-white appearance-none cursor-pointer"
                                    >
                                        <option value="low" className="bg-[#121212]">Low</option>
                                        <option value="medium" className="bg-[#121212]">Medium</option>
                                        <option value="high" className="bg-[#121212]">High</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                disabled={loading}
                                className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary/30 flex items-center justify-center gap-2 transition-all"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : (
                                    <>
                                        <Save size={18} /> {task ? 'Update Task' : 'Create Task'}
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

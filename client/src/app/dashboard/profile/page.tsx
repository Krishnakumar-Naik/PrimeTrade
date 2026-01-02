'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import {
    User,
    Mail,
    Shield,
    Camera,
    Loader2,
    Save,
    Key
} from 'lucide-react';
import api from '@/lib/api';

export default function ProfilePage() {
    const { user, updateUser, loading } = useAuth();
    const [isUpdating, setIsUpdating] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        avatar: user?.avatar || '',
        password: '',
    });

    const resizeImage = (file: File): Promise<string> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 400;
                    const MAX_HEIGHT = 400;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', 0.7));
                };
            };
        });
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const optimizedImage = await resizeImage(file);
                setFormData({ ...formData, avatar: optimizedImage });
            } catch (err) {
                console.error('Failed to process image', err);
            }
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdating(true);
        setSuccess(false);
        try {
            const { data } = await api.put('/users/profile', formData);
            updateUser(data);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error(err);
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) return null;

    return (
        <div className="min-h-screen bg-background flex">
            <Sidebar />
            <main className="flex-grow ml-64 p-8">
                <header className="mb-12">
                    <h1 className="text-4xl font-bold mb-2">Account Settings</h1>
                    <p className="text-gray-400">Manage your profile and security preferences.</p>
                </header>

                <div className="max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Avatar Section */}
                    <div className="glass p-8 rounded-3xl flex flex-col items-center text-center">
                        <div className="relative mb-6">
                            <div className="w-32 h-32 rounded-full border-2 border-primary overflow-hidden bg-white/5 flex items-center justify-center">
                                {formData.avatar || user?.avatar ? (
                                    <img src={formData.avatar || user?.avatar} alt={user?.name} className="w-full h-full object-cover" />
                                ) : (
                                    <User size={48} className="text-gray-600" />
                                )}
                            </div>
                            <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-primary p-2 rounded-xl shadow-lg hover:scale-110 transition-transform cursor-pointer">
                                <Camera size={16} className="text-white" />
                                <input
                                    id="avatar-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageChange}
                                />
                            </label>
                        </div>
                        <h3 className="text-2xl font-bold">{user?.name}</h3>
                        <p className="text-primary text-sm font-medium mt-1">Premium Member</p>
                        <div className="mt-6 pt-6 border-t border-white/5 w-full">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-500">Member Since</span>
                                <span className="text-gray-300">Jan 2026</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Status</span>
                                <span className="text-emerald-500">Active</span>
                            </div>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="md:col-span-2 glass p-8 rounded-3xl">
                        <form onSubmit={handleUpdate} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">FullName</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                        <input
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary/50 text-white"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                        <input
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary/50 text-white"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">New Password (Leave blank to keep current)</label>
                                <div className="relative">
                                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary/50 text-white"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div className="pt-6 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-emerald-500 text-sm font-semibold">
                                    {success && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                            Profile updated successfully!
                                        </motion.div>
                                    )}
                                </div>
                                <button
                                    disabled={isUpdating}
                                    className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-primary/20 disabled:opacity-50 transition-all"
                                >
                                    {isUpdating ? <Loader2 className="animate-spin" size={18} /> : (
                                        <>
                                            <Save size={18} /> Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}

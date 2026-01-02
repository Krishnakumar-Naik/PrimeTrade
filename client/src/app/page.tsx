'use client';

import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, Shield, Zap, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Zap className="text-white fill-white" size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight">PrimeTrade</span>
          </div>

          <div className="flex items-center gap-6">
            {user ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
              >
                Dashboard <LayoutDashboard size={18} />
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg shadow-primary/25"
                >
                  Join Now
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="px-4 py-1.5 rounded-full glass text-primary text-xs font-bold uppercase tracking-widest mb-6 inline-block">
              Web3 Analytics Reimagined
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-8 max-w-4xl text-gradient leading-tight">
              Master the Markets with Modern Intelligence
            </h1>
            <p className="text-gray-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
              Experience the next generation of trading analytics. Scalable, secure, and built for the future of finance.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/register"
                className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl text-lg font-bold transition-all shadow-xl shadow-primary/30 flex items-center gap-2 group"
              >
                Start Trading <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/demo"
                className="glass hover:bg-white/5 text-white px-8 py-4 rounded-2xl text-lg font-bold transition-all"
              >
                View Demo
              </Link>
            </div>
          </motion.div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 w-full">
            {[
              {
                icon: <BarChart3 className="text-primary" size={32} />,
                title: "Advanced Analytics",
                description: "Deep dive into market dynamics with real-time data visualization."
              },
              {
                icon: <Shield className="text-primary" size={32} />,
                title: "Military-Grade Security",
                description: "JWT-based authentication and encrypted data storage."
              },
              {
                icon: <Zap className="text-primary" size={32} />,
                title: "Blitz-Fast Speed",
                description: "Optimized server-side operations for minimal latency."
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                className="glass p-8 rounded-3xl text-left hover:border-primary/50 transition-colors group"
              >
                <div className="mb-6 bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 opacity-60">
            <Zap size={20} />
            <span className="font-semibold">PrimeTrade &copy; 2026</span>
          </div>
          <div className="flex gap-8 text-sm text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

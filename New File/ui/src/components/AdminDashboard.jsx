import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Globe, 
  Package, 
  Users, 
  ClipboardList, 
  UserCog, 
  ArrowUpRight, 
  Activity 
} from 'lucide-react';
import Logout from './Logout';

const AdminDashboard = () => {
    const [totalAssets, setTotalAssets] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [assetRes, userRes] = await Promise.all([
                    axios.get('/api/assets'),
                    axios.get('/api/users')
                ]);
                
                setTotalAssets(Array.isArray(assetRes.data) ? assetRes.data.length : 0);
                setTotalUsers(Array.isArray(userRes.data) ? userRes.data.length : 0);
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-gray-900">
            
            {/* 🧭 Navbar */}
            <nav className="sticky top-0 z-50 flex justify-between items-center px-8 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="bg-blue-600 p-1.5 rounded-lg">
                        <Globe className="text-white" size={20} />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight">
                        People<span className="text-blue-600">Desk</span>
                    </h1>
                </div>
                <div className="flex items-center gap-6">
                    <span className="hidden md:flex items-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        Admin Control Panel
                    </span>
                    <Logout />
                </div>
            </nav>

            <main className="p-6 md:p-10 max-w-7xl mx-auto w-full">
                
                {/* 👋 Header Section */}
                <header className="mb-10">
                    <h2 className="text-3xl font-black text-gray-900">System Overview</h2>
                    <p className="text-gray-500 font-medium">Monitoring organization assets and user access</p>
                </header>

                {/* 📊 Statistics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {/* Assets Stat */}
                    <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-blue-100/50 border border-gray-100 flex items-center gap-5">
                        <div className="bg-blue-100 p-4 rounded-2xl text-blue-600">
                            <Package size={28} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Assets</p>
                            <h3 className="text-3xl font-black">{loading ? '...' : totalAssets}</h3>
                        </div>
                    </div>

                    {/* Users Stat */}
                    <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-green-100/50 border border-gray-100 flex items-center gap-5">
                        <div className="bg-green-100 p-4 rounded-2xl text-green-600">
                            <Users size={28} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Users</p>
                            <h3 className="text-3xl font-black">{loading ? '...' : totalUsers}</h3>
                        </div>
                    </div>

                    {/* System Status (Static Example) */}
                    <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-purple-100/50 border border-gray-100 flex items-center gap-5">
                        <div className="bg-purple-100 p-4 rounded-2xl text-purple-600">
                            <Activity size={28} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Status</p>
                            <h3 className="text-xl font-black text-purple-600 uppercase">Operational</h3>
                        </div>
                    </div>
                </div>

                {/* 🚀 Quick Actions Section */}
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    Management Modules
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    
                    {/* Action 1: Inventory */}
                    <Link to="/asset-inventory" className="group relative bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                        <div className="bg-pink-50 text-pink-600 p-4 rounded-2xl w-fit mb-6 group-hover:bg-pink-600 group-hover:text-white transition-colors">
                            <ClipboardList size={32} />
                        </div>
                        <h4 className="text-2xl font-black mb-2">Asset Inventory</h4>
                        <p className="text-gray-500 text-sm leading-relaxed mb-4">
                            Add, edit, and track the lifecycle of hardware across all locations.
                        </p>
                        <div className="flex items-center text-pink-600 font-bold text-sm">
                            Manage Assets <ArrowUpRight size={16} className="ml-1" />
                        </div>
                    </Link>

                    {/* Action 2: Users */}
                    <Link to="/user-management" className="group relative bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                        <div className="bg-blue-50 text-blue-600 p-4 rounded-2xl w-fit mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <UserCog size={32} />
                        </div>
                        <h4 className="text-2xl font-black mb-2">User Management</h4>
                        <p className="text-gray-500 text-sm leading-relaxed mb-4">
                            Verify registration requests and manage roles for employees.
                        </p>
                        <div className="flex items-center text-blue-600 font-bold text-sm">
                            Manage Users <ArrowUpRight size={16} className="ml-1" />
                        </div>
                    </Link>

                    {/* Action 3: Assignments */}
                    <Link to="/assigned-assets" className="group relative bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                        <div className="bg-violet-50 text-violet-600 p-4 rounded-2xl w-fit mb-6 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                            <Package size={32} />
                        </div>
                        <h4 className="text-2xl font-black mb-2">Asset Tracking</h4>
                        <p className="text-gray-500 text-sm leading-relaxed mb-4">
                            Monitor which hardware is assigned to which team member.
                        </p>
                        <div className="flex items-center text-violet-600 font-bold text-sm">
                            Track Assignments <ArrowUpRight size={16} className="ml-1" />
                        </div>
                    </Link>

                </div>
            </main>

            <footer className="mt-auto py-8 border-t border-gray-100 bg-white text-center">
                <p className="text-gray-400 text-sm font-medium">
                    © 2026 PeopleDesk Enterprise • Admin Session Secure
                </p>
            </footer>
        </div>
    );
};

export default AdminDashboard;
import React, { useEffect, useState } from 'react';
import { Globe, Package, Calendar, User, LayoutDashboard } from 'lucide-react';
import Logout from './Logout'; // Assuming your Logout component is in the same folder

const EmployeeDashboard = () => {
    const [assignedAssets, setAssignedAssets] = useState([]);
    const [employee, setEmployee] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEmployeeDetails = async () => {
            try {
                const response = await fetch('/api/getEmployees');
                if (!response.ok) throw new Error('Failed to fetch details');
                const data = await response.json();
                setEmployee(data);
                fetchAssignedAssets(data.userId);
            } catch (error) {
                setError('Failed to load profile details');
                setLoading(false);
            }
        };

        const fetchAssignedAssets = async (userId) => {
            try {
                const response = await fetch(`/api/assigned-assets/employee/${userId}`);
                if (!response.ok) throw new Error('Failed to fetch assets');
                const data = await response.json();
                setAssignedAssets(Array.isArray(data) ? data : []);
            } catch (error) {
                setError('Failed to load assigned assets');
            } finally {
                setLoading(false);
            }
        };

        fetchEmployeeDetails();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-gray-900">
            
            {/* 🧭 Dashboard Navbar */}
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
                    <span className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-500">
                        <LayoutDashboard size={16} /> Employee Portal
                    </span>
                    <Logout />
                </div>
            </nav>

            <main className="p-6 md:p-10 max-w-7xl mx-auto w-full">
                
                {/* 👋 Welcome Header */}
                <header className="mb-10">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2rem] p-8 md:p-12 text-white shadow-xl shadow-blue-200 relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-4xl font-black mb-2">
                                Keep shining, {employee?.username || 'User'}!
                            </h2>
                            <p className="text-blue-100 text-lg opacity-90">
                                Your efforts are inspiring. Here is your current inventory.
                            </p>
                        </div>
                        {/* Decorative background circle */}
                        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    </div>
                </header>

                <div className="grid lg:grid-cols-3 gap-8">
                    
                    {/* 👤 Profile Summary Card */}
                    <aside className="lg:col-span-1">
                        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-50">
                                <div className="bg-blue-50 p-4 rounded-2xl">
                                    <User className="text-blue-600" size={32} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl">{employee?.username}</h3>
                                    <p className="text-gray-500 text-sm">Employee Account</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Email</p>
                                    <p className="font-medium text-gray-700">{employee?.email || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">User ID</p>
                                    <p className="font-mono text-gray-700">{employee?.userId || '---'}</p>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* 📦 Assets Table Section */}
                    <section className="lg:col-span-2">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                    <Package className="text-blue-600" size={20} /> Assigned Assets
                                </h3>
                                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full">
                                    {assignedAssets.length} Total
                                </span>
                            </div>

                            {error && (
                                <div className="p-6 bg-red-50 text-red-600 text-sm text-center font-medium">
                                    {error}
                                </div>
                            )}

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/50">
                                            <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Asset ID</th>
                                            <th className="px-8 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Assignment Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {loading ? (
                                            <tr>
                                                <td colSpan="2" className="px-8 py-10 text-center text-gray-400 animate-pulse font-medium">
                                                    Fetching your assets...
                                                </td>
                                            </tr>
                                        ) : assignedAssets.length === 0 ? (
                                            <tr>
                                                <td colSpan="2" className="px-8 py-12 text-center text-gray-400 italic">
                                                    No assets have been assigned to you yet.
                                                </td>
                                            </tr>
                                        ) : (
                                            assignedAssets.map(asset => (
                                                <tr key={asset.assetId} className="hover:bg-blue-50/30 transition-colors group">
                                                    <td className="px-8 py-5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                                                <Package size={14} />
                                                            </div>
                                                            <span className="font-bold text-gray-700 uppercase tracking-tight">{asset.assetId}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-5 text-right">
                                                        <div className="inline-flex items-center gap-2 text-gray-500 font-medium">
                                                            <Calendar size={14} />
                                                            {new Date(asset.assignmentDate).toLocaleDateString(undefined, {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric'
                                                            })}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>

                </div>
            </main>

            {/* 🔻 Footer */}
            <footer className="mt-auto py-8 border-t border-gray-100 bg-white text-center">
                <p className="text-gray-400 text-sm">
                    © 2026 PeopleDesk IT Portal • System Status: <span className="text-green-500 font-bold uppercase text-[10px]">Optimal</span>
                </p>
            </footer>
        </div>
    );
};

export default EmployeeDashboard;
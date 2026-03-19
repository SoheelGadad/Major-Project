import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Globe, Package, Calendar, Activity, ArrowLeft, Save, Tag, Hash } from 'lucide-react';
import Logout from './Logout';

const AddAssetForm = () => {
    const { assetId } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        assetId: assetId || '',
        assetName: '',
        scheduledDate: '',
        status: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (assetId) {
                await axios.put(`/api/assets/${assetId}`, formData);
            } else {
                await axios.post('/api/assets', formData);
            }
            navigate('/technician-dashboard');
        } catch (error) {
            console.error('Error saving asset:', error);
        }
    };

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
                    <Link to="/technician-dashboard" className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 transition">
                        <ArrowLeft size={16} /> Dashboard
                    </Link>
                    <Logout />
                </div>
            </nav>

            <main className="flex-grow flex items-center justify-center p-6 py-12">
                <div className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-xl shadow-blue-100/50 border border-gray-100 overflow-hidden">
                    
                    {/* Header */}
                    <div className="bg-blue-600 p-8 text-center text-white">
                        <div className="inline-flex p-3 bg-white/20 rounded-2xl mb-4 backdrop-blur-sm">
                            <Package size={32} />
                        </div>
                        <h2 className="text-3xl font-black">{assetId ? 'Edit Asset Details' : 'Add New Asset'}</h2>
                        <p className="text-blue-100 text-sm mt-2 opacity-90 tracking-wide uppercase font-bold text-[10px]">
                            Technician Maintenance Portal
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-10 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Asset ID */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700" htmlFor="assetId">
                                    <Hash size={16} className="text-blue-600" /> Asset ID
                                </label>
                                <input
                                    type="text"
                                    id="assetId"
                                    name="assetId"
                                    placeholder="e.g. AST-99"
                                    value={formData.assetId}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-xl border border-gray-200 outline-none transition ${assetId ? 'bg-gray-50 text-gray-400' : 'focus:border-blue-500 focus:ring-2 focus:ring-blue-100'}`}
                                    required
                                    readOnly={!!assetId}
                                />
                            </div>

                            {/* Asset Name */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700" htmlFor="assetName">
                                    <Tag size={16} className="text-blue-600" /> Asset Name
                                </label>
                                <input
                                    type="text"
                                    id="assetName"
                                    name="assetName"
                                    placeholder="e.g. Dell Monitor"
                                    value={formData.assetName}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 rounded-xl border border-gray-200 outline-none transition ${assetId ? 'bg-gray-50 text-gray-400' : 'focus:border-blue-500 focus:ring-2 focus:ring-blue-100'}`}
                                    required
                                    readOnly={!!assetId}
                                />
                            </div>

                            {/* Scheduled Date */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700" htmlFor="scheduledDate">
                                    <Calendar size={16} className="text-blue-600" /> Maintenance Date
                                </label>
                                <input
                                    type="date"
                                    id="scheduledDate"
                                    name="scheduledDate"
                                    value={formData.scheduledDate}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition bg-white"
                                    required
                                />
                            </div>

                            {/* Status */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700" htmlFor="status">
                                    <Activity size={16} className="text-blue-600" /> Current Status
                                </label>
                                <select
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition bg-white"
                                    required
                                >
                                    <option value="">Select Status</option>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                    <option value="Repair">Repair</option>
                                </select>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex gap-4 border-t border-gray-100 pt-8 mt-4">
                            <button
                                type="submit"
                                className="flex-grow flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-100 transition-all transform active:scale-[0.98]"
                            >
                                <Save size={20} /> Save Details
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/technician-dashboard')}
                                className="px-8 py-4 bg-white border-2 border-gray-100 text-gray-400 font-bold rounded-2xl hover:bg-gray-50 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            <footer className="py-6 border-t border-gray-100 bg-white text-center text-gray-400 text-[10px] font-medium uppercase tracking-widest">
                © 2026 PeopleDesk • Technician Services Node
            </footer>
        </div>
    );
};

export default AddAssetForm;
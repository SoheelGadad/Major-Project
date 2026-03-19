import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Globe, Package, Hash, Tag, Monitor, Calendar, ShieldCheck, MapPin, UserPlus, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';

const EditAsset = () => {
    const [employees, setEmployees] = useState([]);
    const [assetData, setAssetData] = useState({
        assetId: '',
        assetName: '',
        assetType: '',
        model: '',
        serialNumber: '',
        purchaseDate: '',
        warranty: '',
        location: '',
        assignedUser: 'Unassigned'
    });
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            try {
                // Fetch Approved Employees
                const empRes = await axios.get('/api/users');
                const approvedEmps = empRes.data.filter(u => u.status === 'approved');
                setEmployees(approvedEmps);

                // Fetch Asset Details
                if (id) {
                    const assetRes = await axios.get(`/api/assets/${id}`);
                    setAssetData({
                        ...assetRes.data,
                        assignedUser: assetRes.data.assignedUser || 'Unassigned'
                    });
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error("Failed to load asset or employee data");
            }
        };
        loadData();
    }, [id]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setAssetData({ ...assetData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`/api/assets/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(assetData)
            });

            if (!response.ok) throw new Error('Failed to edit asset');

            toast.success('Asset updated successfully');
            navigate('/asset-inventory');
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to update asset');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            
            {/* 🧭 Navbar */}
            <header className="sticky top-0 z-50 flex justify-between items-center px-8 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="bg-blue-600 p-1.5 rounded-lg">
                        <Globe className="text-white" size={20} />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight">
                        People<span className="text-blue-600">Desk</span>
                    </h1>
                </div>
                <button 
                    onClick={() => navigate('/asset-inventory')}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-blue-600 transition"
                >
                    <ArrowLeft size={16} /> Back to Inventory
                </button>
            </header>

            <main className="flex-grow flex items-center justify-center p-6 py-12">
                <div className="w-full max-w-3xl bg-white rounded-[2.5rem] shadow-xl shadow-blue-100/50 border border-gray-100 overflow-hidden">
                    
                    <div className="bg-blue-600 p-8 text-center text-white">
                        <div className="inline-flex p-3 bg-white/20 rounded-2xl mb-4">
                            <Package size={32} />
                        </div>
                        <h2 className="text-3xl font-black">{id ? 'Edit Asset' : 'Add New Asset'}</h2>
                        <p className="text-blue-100 text-sm mt-2 opacity-90 tracking-wide uppercase font-bold">
                            Hardware Inventory Management
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            
                            {/* Asset ID */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                    <Hash size={16} className="text-blue-600" /> Asset ID
                                </label>
                                <input 
                                    type="text" name="assetId" value={assetData.assetId} onChange={handleInputChange}
                                    className={`w-full px-4 py-3 rounded-xl border border-gray-200 outline-none transition ${id ? 'bg-gray-50 text-gray-400' : 'focus:border-blue-500 focus:ring-2 focus:ring-blue-100'}`}
                                    required readOnly={!!id} 
                                />
                            </div>

                            {/* Asset Name */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                    <Tag size={16} className="text-blue-600" /> Asset Name
                                </label>
                                <input 
                                    type="text" name="assetName" placeholder="e.g. MacBook Pro" value={assetData.assetName} onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                                    required 
                                />
                            </div>

                            {/* Asset Type */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                    <Monitor size={16} className="text-blue-600" /> Asset Type
                                </label>
                                <input 
                                    type="text" name="assetType" placeholder="e.g. Laptop" value={assetData.assetType} onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                                    required 
                                />
                            </div>

                            {/* Model */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                    <Package size={16} className="text-blue-600" /> Model
                                </label>
                                <input 
                                    type="text" name="model" placeholder="e.g. M2 2023" value={assetData.model} onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                                    required 
                                />
                            </div>

                            {/* Serial Number */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                    <Hash size={16} className="text-blue-600" /> Serial Number
                                </label>
                                <input 
                                    type="text" name="serialNumber" placeholder="S/N: 123456" value={assetData.serialNumber} onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                                    required 
                                />
                            </div>

                            {/* Purchase Date */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                    <Calendar size={16} className="text-blue-600" /> Purchase Date
                                </label>
                                <input 
                                    type="date" name="purchaseDate" value={assetData.purchaseDate ? assetData.purchaseDate.split('T')[0] : ''} onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition bg-white"
                                    required 
                                />
                            </div>

                            {/* Warranty */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                    <ShieldCheck size={16} className="text-blue-600" /> Warranty Details
                                </label>
                                <input 
                                    type="text" name="warranty" placeholder="e.g. 3 Years International" value={assetData.warranty} onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                                    required 
                                />
                            </div>

                            {/* Location */}
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                    <MapPin size={16} className="text-blue-600" /> Current Location
                                </label>
                                <input 
                                    type="text" name="location" placeholder="e.g. Goa Office" value={assetData.location} onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                                    required 
                                />
                            </div>

                            {/* Change Assignment */}
                            <div className="md:col-span-2 space-y-2 pt-4">
                                <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                    <UserPlus size={16} className="text-blue-600" /> Assign To User
                                </label>
                                <select
                                    name="assignedUser"
                                    value={assetData.assignedUser}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition bg-white"
                                >
                                    <option value="Unassigned">Unassigned (In Stock)</option>
                                    {employees.map(emp => (
                                        <option key={emp.userId} value={emp.userId}>
                                            {emp.username} — {emp.userId}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex gap-4 border-t border-gray-100 pt-8">
                            <button
                                type="submit"
                                className="flex-grow bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-100 transition-all transform active:scale-[0.98]"
                            >
                                Save Changes
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/asset-inventory')}
                                className="px-8 py-4 bg-white border-2 border-gray-100 text-gray-400 font-bold rounded-2xl hover:bg-gray-50 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            {/* 🔻 Footer */}
            <footer className="py-6 border-t border-gray-100 bg-white text-center text-gray-400 text-xs font-medium uppercase tracking-widest">
                © 2026 PeopleDesk • Hardware Lifecycle Management
            </footer>
        </div>
    );
};

export default EditAsset;
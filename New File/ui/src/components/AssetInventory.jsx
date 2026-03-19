import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Globe, 
  Package, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Monitor, 
  Tag, 
  Hash, 
  MapPin, 
  UserCheck 
} from 'lucide-react';
import Logout from './Logout';

const AssetInventory = () => {
    const [assets, setAssets] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredAssets, setFilteredAssets] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const filtered = assets.filter(asset => {
            const assignedUser = asset.assignedUser || '';
            const searchLower = searchQuery.toLowerCase();
            return (
                asset.assetId.toLowerCase().includes(searchLower) ||
                asset.assetName.toLowerCase().includes(searchLower) ||
                asset.assetType.toLowerCase().includes(searchLower) ||
                asset.model.toLowerCase().includes(searchLower) ||
                asset.serialNumber.toLowerCase().includes(searchLower) ||
                asset.location.toLowerCase().includes(searchLower) ||
                assignedUser.toLowerCase().includes(searchLower)
            );
        });
        setFilteredAssets(filtered);
    }, [searchQuery, assets]);

    const fetchData = async () => {
        try {
            const response = await axios.get('/api/assets');
            setAssets(response.data);
            setFilteredAssets(response.data); 
        } catch (error) {
            console.error('Error fetching assets:', error);
        }
    };

    const handleDeleteAsset = async (assetId) => {
        if (window.confirm('Are you sure you want to delete this asset?')) {
            try {
                await axios.delete(`/api/assets/${assetId}`);
                setAssets(assets.filter(asset => asset.assetId !== assetId));
                alert('Asset deleted successfully!');
            } catch (error) {
                console.error('Error deleting asset:', error);
            }
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
                    <Link to="/admin-dashboard" className="text-sm font-bold text-gray-500 hover:text-blue-600 transition">Dashboard</Link>
                    <Logout />
                </div>
            </nav>

            <main className="p-6 md:p-10 max-w-[1600px] mx-auto w-full">
                
                {/* 👋 Header Section */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                           <Package className="text-blue-600" size={32} /> Asset Inventory
                        </h2>
                        <p className="text-gray-500 mt-1 font-medium">Manage and track company hardware assets</p>
                    </div>
                    
                    <Link to="/add-newAsset" className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200">
                        <Plus size={18} /> Add New Asset
                    </Link>
                </header>

                {/* 📊 Inventory Card */}
                <div className="bg-white rounded-[2rem] shadow-xl shadow-blue-100/50 border border-gray-100 overflow-hidden">
                    
                    {/* Toolbar */}
                    <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/30">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search by ID, Name, Model, or Serial..."
                                className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="px-4 py-2 bg-white border border-gray-100 rounded-lg text-xs font-black text-gray-400 uppercase tracking-widest">
                            Total Assets: {filteredAssets.length}
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                                <tr>
                                    <th className="px-6 py-4">Asset Details</th>
                                    <th className="px-6 py-4">Type/Model</th>
                                    <th className="px-6 py-4">Identification</th>
                                    <th className="px-6 py-4">Purchase Info</th>
                                    <th className="px-6 py-4">Location</th>
                                    <th className="px-6 py-4">Assigned To</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredAssets.map(asset => (
                                    <tr key={asset.assetId} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="font-bold text-gray-900">{asset.assetName}</div>
                                            <div className="text-xs font-mono text-gray-400">{asset.assetId}</div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                                <Monitor size={14} className="text-blue-500" /> {asset.assetType}
                                            </div>
                                            <div className="text-xs text-gray-500">{asset.model}</div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                                                <Hash size={12} className="text-gray-400" /> {asset.serialNumber}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="text-sm font-medium text-gray-700">
                                                {new Date(asset.purchaseDate).toLocaleDateString()}
                                            </div>
                                            <div className="text-[10px] font-bold text-emerald-600 uppercase italic">
                                                {asset.warranty} Warranty
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                                <MapPin size={14} className="text-rose-500" /> {asset.location}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${
                                                asset.assignedUser === 'Unassigned' || !asset.assignedUser 
                                                ? 'bg-slate-50 text-slate-400 border-slate-100' 
                                                : 'bg-blue-50 text-blue-600 border-blue-100'
                                            }`}>
                                                <UserCheck size={12} />
                                                {asset.assignedUser || 'Unassigned'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex justify-end gap-1">
                                                <button 
                                                    onClick={() => navigate(`/edit-asset/${asset.assetId}`)}
                                                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                                                >
                                                    <Edit3 size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteAsset(asset.assetId)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Empty State */}
                    {filteredAssets.length === 0 && (
                        <div className="py-20 text-center">
                            <Package className="mx-auto text-gray-100 mb-4" size={80} />
                            <p className="text-gray-400 font-medium italic">No assets found in inventory.</p>
                        </div>
                    )}
                </div>
            </main>

            <footer className="mt-auto py-8 border-t border-gray-100 bg-white text-center">
                <p className="text-gray-400 text-sm font-medium tracking-wide uppercase">
                    © 2026 PeopleDesk • Asset Life Cycle Node
                </p>
            </footer>
        </div>
    );
};

export default AssetInventory;
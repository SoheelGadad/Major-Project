import React, { useState, useEffect } from "react";
import axios from "axios";
import { Globe, Plus, Edit3, Trash2, User, Package, Calendar, X, AlertCircle } from "lucide-react";
import Logout from "./Logout";
import { Link } from 'react-router-dom';

const AssignedAssets = () => {
    const [assignedAssets, setAssignedAssets] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentAssignment, setCurrentAssignment] = useState(null);

    const [userId, setUserId] = useState("");
    const [assetId, setAssetId] = useState("");
    const [assignmentDate, setAssignmentDate] = useState("");

    const [users, setUsers] = useState([]);
    const [assets, setAssets] = useState([]);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [assignRes, userRes, assetRes] = await Promise.all([
                    axios.get("/api/assignments"),
                    axios.get("/api/users"),
                    axios.get("/api/assets")
                ]);
                setAssignedAssets(assignRes.data);
                setUsers(userRes.data);
                setAssets(assetRes.data);
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
            }
        };
        fetchAllData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userId || !assetId || !assignmentDate) return;

        const existingAssignment = assignedAssets.find(
            (a) => a.assetId === assetId && a._id !== currentAssignment?._id
        );

        if (existingAssignment) {
            const assignedUser = users.find(u => (u.userId || u._id) === existingAssignment.userId);
            alert(`⚠️ Already assigned to ${assignedUser ? assignedUser.username : existingAssignment.userId}`);
            return;
        }

        try {
            if (editMode) {
                const res = await axios.put(`/api/assignments/${currentAssignment._id}`, { userId, assetId, assignmentDate });
                setAssignedAssets(prev => prev.map(a => a._id === currentAssignment._id ? res.data : a));
            } else {
                const res = await axios.post("/api/assignments", { userId, assetId, assignmentDate });
                setAssignedAssets(prev => [...prev, res.data]);
            }
            closeModal();
        } catch (error) {
            console.error("Submission failed:", error);
        }
    };

    const closeModal = () => {
        setUserId("");
        setAssetId("");
        setAssignmentDate("");
        setEditMode(false);
        setCurrentAssignment(null);
        setModalOpen(false);
    };

    const handleEdit = (assignment) => {
        setCurrentAssignment(assignment);
        setUserId(assignment.userId);
        setAssetId(assignment.assetId);
        setAssignmentDate(new Date(assignment.assignmentDate).toISOString().split("T")[0]);
        setEditMode(true);
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Remove this assignment?")) return;
        try {
            await axios.delete(`/api/assignments/${id}`);
            setAssignedAssets(prev => prev.filter(a => a._id !== id));
        } catch (error) {
            console.error("Delete failed:", error);
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

            <main className="p-6 md:p-10 max-w-7xl mx-auto w-full">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                            Asset Assignments
                        </h2>
                        <p className="text-gray-500 mt-1 font-medium">Link users with hardware inventory</p>
                    </div>
                    <button
                        onClick={() => { setEditMode(false); setModalOpen(true); }}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                    >
                        <Plus size={18} /> New Assignment
                    </button>
                </header>

                {/* 📊 Table Card */}
                <div className="bg-white rounded-[2rem] shadow-xl shadow-blue-100/50 border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-400 text-xs font-black uppercase tracking-widest">
                                <tr>
                                    <th className="px-8 py-4">User</th>
                                    <th className="px-8 py-4">Asset ID</th>
                                    <th className="px-8 py-4">Assignment Date</th>
                                    <th className="px-8 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {assignedAssets.map(a => {
                                    const user = users.find(u => (u.userId || u._id) === a.userId);
                                    return (
                                        <tr key={a._id} className="hover:bg-blue-50/30 transition-colors group">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                                        <User size={14} />
                                                    </div>
                                                    <span className="font-bold text-gray-900">{user ? user.username : a.userId}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-2 text-gray-600 font-mono text-sm">
                                                    <Package size={14} className="text-gray-400" /> {a.assetId}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-gray-500 font-medium">
                                                {new Date(a.assignmentDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => handleEdit(a)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"><Edit3 size={18} /></button>
                                                    <button onClick={() => handleDelete(a._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 size={18} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* 📝 Assignment Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={closeModal}></div>
                    <div className="relative bg-white rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl border border-gray-100 animate-in zoom-in duration-200">
                        <button onClick={closeModal} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900"><X size={24} /></button>
                        
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-black">{editMode ? "Update Assignment" : "Assign Asset"}</h3>
                            <p className="text-gray-500 text-sm">Link hardware to a specific user</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Select Employee</label>
                                <select 
                                    value={userId} 
                                    onChange={(e) => setUserId(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-100 bg-white"
                                >
                                    <option value="">Choose User...</option>
                                    {users.map(u => <option key={u._id} value={u.userId || u._id}>{u.username}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Select Asset</label>
                                <select 
                                    value={assetId} 
                                    onChange={(e) => setAssetId(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-100 bg-white"
                                >
                                    <option value="">Choose Asset...</option>
                                    {assets.map(asset => {
                                        const assigned = assignedAssets.find(a => a.assetId === (asset.assetId || asset._id));
                                        return (
                                            <option key={asset._id} value={asset.assetId || asset._id} disabled={assigned && !editMode}>
                                                {asset.assetName} {assigned ? "(Assigned)" : ""}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 text-left">Assignment Date</label>
                                <input 
                                    type="date" 
                                    value={assignmentDate} 
                                    onChange={(e) => setAssignmentDate(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <button type="submit" className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition active:scale-95 mt-4">
                                {editMode ? "Update Assignment" : "Confirm Assignment"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssignedAssets;
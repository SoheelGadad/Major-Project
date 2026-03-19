import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { exportCSV } from "../utils/exportUtils"; // Ensure this utility is present
import ConfirmModal from "./ConfirmModal";
import { ArrowUpDown, Trash2, Download, Edit, CheckCircle, XCircle, Globe, UserPlus, Users, Shield } from "lucide-react";
import { Link } from 'react-router-dom';
import Logout from './Logout';

const PAGE_SIZE = 5;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get("/api/users");
      setUsers(res.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await axios.put(`/api/users/${userId}`, { status: newStatus });
      setUsers(users.map(u => u.userId === userId ? { ...u, status: newStatus } : u));
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const deleteUser = async () => {
    try {
      await axios.delete(`/api/users/${deleteId}`);
      setUsers((prev) => prev.filter((u) => u.userId !== deleteId));
      setDeleteId(null);
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const filteredAndSortedUsers = useMemo(() => {
    let result = users.filter(u => 
      u.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.status || 'pending').toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortKey) {
      result.sort((a, b) => {
        const A = String(a[sortKey] ?? "");
        const B = String(b[sortKey] ?? "");
        return sortDir === "asc" ? A.localeCompare(B) : B.localeCompare(A);
      });
    }
    return result;
  }, [users, searchQuery, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedUsers.length / PAGE_SIZE));
  const paginatedUsers = filteredAndSortedUsers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (key) => {
    setSortDir(sortKey === key && sortDir === "asc" ? "desc" : "asc");
    setSortKey(key);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-gray-900">
      
      {/* 🧭 Navbar */}
      <nav className="sticky top-0 z-50 flex justify-between items-center px-8 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Globe className="text-white" size={20} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">
            People<span className="text-blue-600">Desk</span>
          </h1>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/admin-dashboard" className="text-sm font-bold text-gray-500 hover:text-blue-600 transition">Dashboard</Link>
          <Logout />
        </div>
      </nav>

      <main className="p-6 md:p-10 max-w-7xl mx-auto w-full">
        
        {/* 👋 Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
               <Users className="text-blue-600" size={32} /> User Management
            </h2>
            <p className="text-gray-500 mt-1 font-medium">Verify credentials and manage organization access</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button onClick={() => exportCSV(users, "users")} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-50 transition shadow-sm">
              <Download size={18} className="text-emerald-600" /> CSV
            </button>
            <Link to="/create-user" className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-200">
              <UserPlus size={18} /> Create User
            </Link>
          </div>
        </header>

        {/* 📊 Content Card */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-blue-100/50 border border-gray-100 overflow-hidden">
          
          {/* Table Toolbar */}
          <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/30">
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Search users..."
                className="w-full pl-4 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition"
                value={searchQuery}
                onChange={(e) => {setSearchQuery(e.target.value); setPage(1);}}
              />
            </div>
            <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">
              Total Records: {filteredAndSortedUsers.length}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-400 text-xs font-black uppercase tracking-widest">
                <tr>
                  {["userId", "username", "email", "role", "status"].map((col) => (
                    <th key={col} onClick={() => handleSort(col)} className="px-8 py-4 cursor-pointer hover:text-blue-600 transition">
                      <div className="flex items-center gap-1 uppercase">
                        {col === "userId" ? "ID" : col} <ArrowUpDown size={12} />
                      </div>
                    </th>
                  ))}
                  <th className="px-8 py-4 text-right uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginatedUsers.map((u) => {
                  const status = u.status || 'pending';
                  const isAdmin = u.role?.toLowerCase() === 'admin';
                  return (
                    <tr key={u.userId} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-8 py-5 font-mono text-sm text-gray-500">{u.userId}</td>
                      <td className="px-8 py-5 font-bold text-gray-900">{u.username}</td>
                      <td className="px-8 py-5 text-gray-500 font-medium">{u.email}</td>
                      <td className="px-8 py-5">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-black uppercase ${isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                          {isAdmin && <Shield size={10} />} {u.role}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${
                          status === 'approved' ? 'bg-green-100 text-green-700 border-green-200' : 
                          status === 'rejected' ? 'bg-red-100 text-red-700 border-red-200' : 
                          'bg-yellow-100 text-yellow-700 border-yellow-200'
                        }`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-1">
                          {status === 'pending' && (
                            <>
                              <button onClick={() => handleStatusChange(u.userId, 'approved')} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition" title="Approve"><CheckCircle size={18}/></button>
                              <button onClick={() => handleStatusChange(u.userId, 'rejected')} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition" title="Reject"><XCircle size={18}/></button>
                            </>
                          )}
                          <Link to={`/edit-user/${u.userId}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Edit Profile">
                            <Edit size={18}/>
                          </Link>
                          <button onClick={() => setDeleteId(u.userId)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete User">
                            <Trash2 size={18}/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <footer className="p-6 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/20">
            <p className="text-sm font-bold text-gray-400 italic">Page {page} of {totalPages}</p>
            <div className="flex gap-1">
              <button 
                disabled={page === 1} 
                onClick={() => setPage(p => p - 1)} 
                className="px-4 py-2 bg-white border border-gray-200 rounded-xl font-bold disabled:opacity-30 hover:bg-gray-50 transition"
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button 
                  key={i} 
                  onClick={() => setPage(i + 1)} 
                  className={`w-10 h-10 rounded-xl font-bold transition ${page === i + 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white border border-gray-200 text-gray-400 hover:bg-gray-50'}`}
                >
                  {i + 1}
                </button>
              ))}
              <button 
                disabled={page === totalPages} 
                onClick={() => setPage(p => p + 1)} 
                className="px-4 py-2 bg-white border border-gray-200 rounded-xl font-bold disabled:opacity-30 hover:bg-gray-50 transition"
              >
                Next
              </button>
            </div>
          </footer>
        </div>
      </main>

      {/* ⚠️ Confirm Modal is correctly integrated here */}
      <ConfirmModal 
        open={!!deleteId} 
        onClose={() => setDeleteId(null)} 
        onConfirm={deleteUser} 
        title="Remove User Access"
        message="This will permanently revoke all system permissions for this user. Continue?"
      />
    </div>
  );
};

export default UserManagement;
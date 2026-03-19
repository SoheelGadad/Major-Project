import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Globe, User, Mail, Shield, Key, Copy, Check, RefreshCcw, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";

const EditUserPage = () => {
  const { id } = useParams(); // 👈 This catches the ID from /edit-user/:id
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const [userData, setUserData] = useState({
    userId: "",
    username: "",
    email: "",
    role: "",
    password: "",
  });

  // 🔄 Effect to load data if we are in "Edit Mode"
  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        setLoading(true);
        try {
          const res = await axios.get(`/api/users/${id}`);
          setUserData({
            ...res.data,
            password: "", // Keep password blank for security during edit
          });
        } catch (err) {
          toast.error("Failed to load user data");
          navigate("/user-management");
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
  }, [id, navigate]);

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleGenerateOTP = () => {
    setUserData({ ...userData, password: Math.random().toString(36).slice(-8) });
    setCopied(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        // 📝 Update logic
        await axios.put(`/api/users/${id}`, userData);
        toast.success("User updated successfully!");
      } else {
        // ➕ Create logic
        await axios.post("/api/users", userData);
        toast.success("User created successfully!");
      }
      navigate("/user-management");
    } catch (error) {
      toast.error("Operation failed. Please check inputs.");
    }
  };

  if (loading) return <div className="p-10 text-center font-bold">Loading User Data...</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-gray-900">
      <header className="sticky top-0 z-50 flex justify-between items-center px-8 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg"><Globe className="text-white" size={20} /></div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">People<span className="text-blue-600">Desk</span></h1>
        </div>
        <button onClick={() => navigate("/user-management")} className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 transition">
          <ArrowLeft size={16} /> Back to List
        </button>
      </header>

      <main className="flex-grow flex items-center justify-center p-6 py-12">
        <div className="w-full max-w-3xl bg-white rounded-[2.5rem] shadow-2xl shadow-blue-100/50 border border-gray-100 overflow-hidden">
          <div className="bg-blue-600 p-8 text-center text-white">
            <h2 className="text-3xl font-black">{id ? "Edit User Details" : "Create New User"}</h2>
            <p className="text-blue-100 text-sm mt-2 opacity-90">{id ? `Modifying account: ${id}` : "Register a new team member"}</p>
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">User ID</label>
                <input type="text" name="userId" value={userData.userId} onChange={handleInputChange} readOnly={!!id} className={`w-full px-4 py-3 rounded-xl border border-gray-200 outline-none transition ${id ? 'bg-gray-100 cursor-not-allowed' : 'focus:border-blue-500'}`} required />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Username</label>
                <input type="text" name="username" value={userData.username} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none transition" required />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                <input type="email" name="email" value={userData.email} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none transition" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Role</label>
                <select name="role" value={userData.role} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 outline-none transition bg-white" required>
                  <option value="" disabled>Select Role</option>
                  <option value="Employee">Employee</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="md:col-span-2 pt-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">{id ? "Change Password (Leave blank to keep same)" : "Password"}</label>
                <div className="flex gap-2">
                   <input type="text" name="password" value={userData.password} onChange={handleInputChange} className="flex-grow px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500" placeholder="New password..." required={!id} />
                   <button type="button" onClick={handleGenerateOTP} className="bg-emerald-50 text-emerald-600 p-3 rounded-xl border border-emerald-100 hover:bg-emerald-600 hover:text-white transition"><RefreshCcw size={20}/></button>
                </div>
              </div>
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-lg transition-all transform active:scale-95">
              {id ? "Save Changes" : "Create Account"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditUserPage;
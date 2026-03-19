import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Globe, User, Mail, Shield, Key, Copy, Check, RefreshCcw, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";

const EditUsers = () => {
  const [userData, setUserData] = useState({
    userId: "",
    username: "",
    email: "",
    role: "",
    password: "",
  });

  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleGenerateOTP = () => {
    const randomPassword = Math.random().toString(36).slice(-8);
    setUserData({
      ...userData,
      password: randomPassword,
    });
    setCopied(false);
  };

  const handleCopy = () => {
    if (userData.password) {
      navigator.clipboard.writeText(userData.password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.info("Password copied to clipboard!");
    } else {
      toast.warning("Please generate or enter a password first!");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Failed to add user");
      }

      setUserData({
        userId: "",
        username: "",
        email: "",
        role: "",
        password: "",
      });

      toast.success("User added successfully!");
      navigate("/user-management");
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error("Failed to add user. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-gray-900">
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
          onClick={() => navigate("/user-management")}
          className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-blue-600 transition"
        >
          <ArrowLeft size={16} /> Back to Management
        </button>
      </header>

      <main className="flex-grow flex items-center justify-center p-6 py-12">
        <div className="w-full max-w-2xl bg-white rounded-[2.5rem] shadow-xl shadow-blue-100/50 border border-gray-100 overflow-hidden">
          <div className="bg-blue-600 p-8 text-center text-white">
            <div className="inline-flex p-3 bg-white/20 rounded-2xl mb-4">
              <User size={32} />
            </div>
            <h2 className="text-3xl font-black">{id ? "Edit User" : "Add New User"}</h2>
            <p className="text-blue-100 text-sm mt-2 opacity-90 tracking-wide uppercase font-bold">
              User Registration & Access Control
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User ID */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700" htmlFor="userId">
                  <User size={16} className="text-blue-600" /> User ID
                </label>
                <input
                  type="text"
                  id="userId"
                  name="userId"
                  placeholder="e.g. EMP001"
                  value={userData.userId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                  required
                />
              </div>

              {/* Username */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700" htmlFor="username">
                  <User size={16} className="text-blue-600" /> Full Name
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="John Doe"
                  value={userData.username}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700" htmlFor="email">
                  <Mail size={16} className="text-blue-600" /> Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="john@company.com"
                  value={userData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                  required
                />
              </div>

              {/* Role */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700" htmlFor="role">
                  <Shield size={16} className="text-blue-600" /> User Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={userData.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition bg-white"
                  required
                >
                  <option value="" disabled>Select a role</option>
                  <option value="Employee">Employee</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>

            {/* Password Section */}
            <div className="space-y-2 pt-4">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700" htmlFor="password">
                <Key size={16} className="text-blue-600" /> Set Security Password
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  id="password"
                  name="password"
                  placeholder="Enter or generate password"
                  value={userData.password}
                  onChange={handleInputChange}
                  className="flex-grow px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                  required
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleGenerateOTP}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 font-bold rounded-xl hover:bg-emerald-100 transition border border-emerald-100"
                  >
                    <RefreshCcw size={16} /> Generate
                  </button>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition border border-slate-100"
                  >
                    {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 border-t border-gray-100 pt-8">
              <button
                type="submit"
                className="flex-grow bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl shadow-lg shadow-blue-100 transition-all transform active:scale-[0.98]"
              >
                {id ? "Update User" : "Register User"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/user-management")}
                className="px-8 py-4 bg-white border-2 border-gray-100 text-gray-400 font-bold rounded-2xl hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>

      <footer className="py-6 border-t border-gray-100 bg-white text-center text-gray-400 text-xs font-medium uppercase tracking-widest">
        © 2026 PeopleDesk • Admin Access Control
      </footer>
    </div>
  );
};

export default EditUsers;
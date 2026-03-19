import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Globe, Mail, Lock, LogIn } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginSubmit = async (e) => {
    e.preventDefault();
    const loginDetails = { email, password };

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginDetails),
      });

      const data = await res.json();

      if (res.ok) {
        const normalizedRole = data.userType ? data.userType.toLowerCase() : "";

        if (normalizedRole === 'employee') {
          toast.success("Welcome to the Employee Dashboard");
          navigate("/employee-dashboard");
        } 
        else if (normalizedRole === 'admin') {
          toast.success("Welcome to the Admin Dashboard");
          navigate("/admin-dashboard");
        } 
        else {
          toast.error("User role not recognized");
        }
      } else {
        toast.error(data.error || "Please check your credentials");
      }
    } catch (error) {
      console.error("Login fetch error:", error);
      toast.error("Server connection failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* 🧭 Header / Navbar */}
      <header className="sticky top-0 z-50 flex justify-between items-center px-8 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1 rounded-lg">
            <Globe className="text-white" size={20} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">
            People<span className="text-blue-600">Desk</span>
          </h1>
        </div>
        <Link to="/" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">
          Back to Home
        </Link>
      </header>

      {/* 🚀 Main Content Area */}
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-blue-100/50 border border-gray-100 overflow-hidden">
          
          <div className="bg-blue-600 p-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4 backdrop-blur-sm">
               <LogIn className="text-white" size={32} />
            </div>
            <h2 className="text-3xl font-extrabold text-white">Welcome Back</h2>
            <p className="text-blue-100 text-sm mt-2">Sign in to manage your assets</p>
          </div>

          <form onSubmit={loginSubmit} className="p-8 space-y-6">
            {/* Email Field */}
            <div>
              <label className="flex items-center gap-2 mb-2 text-sm font-bold text-gray-700" htmlFor="email">
                <Mail size={16} className="text-blue-600" /> Email Address
              </label>
              <input
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition duration-200"
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="flex items-center gap-2 text-sm font-bold text-gray-700" htmlFor="password">
                  <Lock size={16} className="text-blue-600" /> Password
                </label>
              </div>
              <input
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition duration-200"
                type="password"
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition duration-300 transform active:scale-[0.98]"
            >
              Sign In
            </button>

            <div className="text-center mt-6">
              <p className="text-sm text-gray-500">
                Don't have an account?{" "}
                <Link to="/sign-up" className="text-blue-600 hover:underline font-bold">
                  Create Account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </main>

      {/* 🔻 Footer */}
      <footer className="bg-white border-t border-gray-100 py-6 text-center">
        <p className="text-gray-400 text-sm">
          © 2026 PeopleDesk. Secure Asset Management System.
        </p>
      </footer>
    </div>
  );
};

const getUserType = () => {
  try {
    const cookieString = document.cookie;
    const tokenRow = cookieString.split("; ").find((row) => row.startsWith("Authtoken="));
    
    if (!tokenRow) return null; 

    const authToken = tokenRow.split("=")[1];
    const decoded = jwtDecode(authToken);
    return decoded.userType;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null; 
  }
};

export { LoginPage as default, getUserType };
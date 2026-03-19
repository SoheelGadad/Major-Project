import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LogOut } from 'lucide-react'; // Import the icon

const Logout = () => {
    const navigate = useNavigate();

    const logout = async () => {
        // Optional: Add a quick confirmation to prevent accidental logouts
        if (!window.confirm("Are you sure you want to logout?")) return;

        try {
            const res = await fetch('/api/logout');
            if (res.ok) {
                toast.success('Logout success');
                // Note: Ensure your route is actually '/home' or just '/'
                navigate('/'); 
            }
        } catch (error) {
            console.error("Logout error:", error);
            toast.error('Something went wrong during logout');
        }
    };

    return (
        <button 
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 group"
        >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span>Logout</span>
        </button>
    );
};

export default Logout;
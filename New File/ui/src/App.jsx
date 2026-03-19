import { createBrowserRouter, createRoutesFromElements, RouterProvider, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- Layouts ---
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import ProtectedRoute from "./components/ProtectedRoute"; 

// --- Public Pages ---
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import NotFoundPage from "./pages/NotFoundPage";

// --- Admin Pages ---
import { Admin } from "./pages/Admin";
import Asset from "./pages/Asset";
import UserManagementPage from "./pages/UserManagementPage";
import AddNewAssetPage from "./pages/AddNewAssetPage";
import EditAssetPage from "./components/EditAsset";
import EditUserPage from "./pages/EditUserPage"; // Smart component for Add & Edit
import AssignedAssetPage from "./pages/AssignedAssetPage";

// --- Employee Pages ---
import Employee from "./pages/Employee";

// --- Technician Pages ---
import AddAssetFormPage from "./pages/AddAssetFormPage";

function App() {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/">
                
                {/* 🔓 PUBLIC ROUTES */}
                <Route element={<AuthLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="login" element={<LoginPage />} />
                    <Route path="sign-up" element={<SignupPage />} />
                </Route>

                {/* 🛡️ PROTECTED DASHBOARD ROUTES */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<MainLayout />}>
                        {/* Admin Modules */}
                        <Route path="admin-dashboard" element={<Admin />} />
                        <Route path="asset-inventory" element={<Asset />} />
                        <Route path="user-management" element={<UserManagementPage />} />
                        <Route path="add-newAsset" element={<AddNewAssetPage />} />
                        <Route path="edit-asset/:id" element={<EditAssetPage />} />
                        <Route path="assigned-assets" element={<AssignedAssetPage />} />
                        
                        {/* 🛠️ THE FIX: Use EditUserPage for both Create and Edit */}
                        {/* When path is 'create-user', useParams().id will be undefined */}
                        <Route path="create-user" element={<EditUserPage />} />
                        <Route path="edit-user/:id" element={<EditUserPage />} />

                        {/* Employee Modules */}
                        <Route path="employee-dashboard" element={<Employee />} />
                        
                        {/* Technician Modules */}
                        <Route path="add-asset" element={<AddAssetFormPage />} />
                    </Route>
                </Route>

                {/* 🚨 Catch-all 404 Route */}
                <Route path="*" element={<NotFoundPage />} />
                
            </Route>
        )
    );

    return (
        <>
            <RouterProvider router={router} />
            <ToastContainer 
                position="top-right"
                autoClose={3000}
                theme="light"
                pauseOnHover
                draggable
            />
        </>
    );
}

export default App;
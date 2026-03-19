import React from "react";
import { ArrowRight, ShieldCheck, BarChart3, Settings, Wrench, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="bg-white min-h-screen flex flex-col font-sans">

      {/* 🧭 Navbar */}
      <header className="sticky top-0 z-50 flex justify-between items-center px-6 md:px-12 py-4 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <Globe className="text-white" size={20} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            People<span className="text-blue-600">Desk</span>
          </h1>
        </div>

        <nav className="flex items-center gap-4 md:gap-8">
          <Link to="/sign-up" className="hidden md:block font-semibold text-gray-600 hover:text-blue-600 transition">
            Signup
          </Link>
          <Link
            to="/login"
            className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-200 active:scale-95"
          >
            Login
          </Link>
        </nav>
      </header>

      {/* 🚀 Hero Section */}
      <section className="relative overflow-hidden flex flex-col items-center justify-center text-center px-6 py-28 bg-slate-50">
        {/* Background Decoration */}
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>

        <div className="relative z-10">
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-tight">
            Smart IT Asset <br />
            <span className="text-blue-600">Management</span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
            From procurement to retirement. Track, manage, and optimize your organization's assets with PeopleDesk.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-10 py-4 rounded-2xl text-lg font-bold hover:bg-blue-700 transition shadow-xl shadow-blue-200"
            >
              Get Started <ArrowRight size={20} />
            </Link>

            <Link
              to="/sign-up"
              className="flex items-center justify-center px-10 py-4 rounded-2xl border-2 border-gray-200 text-gray-900 font-bold hover:bg-gray-50 transition"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* ⭐ Features Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need in one place
            </h2>
            <p className="text-gray-500 text-lg">Powerful tools built for modern IT teams.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Card 1 */}
            <div className="group p-10 rounded-3xl border border-gray-100 bg-white hover:border-blue-500 transition-all hover:shadow-2xl hover:shadow-blue-500/10">
              <div className="mb-6 inline-block p-4 rounded-2xl bg-blue-50 group-hover:bg-blue-600 transition-colors">
                <ShieldCheck className="text-blue-600 group-hover:text-white transition-colors" size={32} />
              </div>
              <h3 className="font-bold text-xl mb-4 text-gray-900">Asset Tracking</h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                Real-time monitoring of asset location, status, and lifecycle assignment.
              </p>
            </div>

            {/* Card 2 */}
            <div className="group p-10 rounded-3xl border border-gray-100 bg-white hover:border-purple-500 transition-all hover:shadow-2xl hover:shadow-purple-500/10">
              <div className="mb-6 inline-block p-4 rounded-2xl bg-purple-50 group-hover:bg-purple-600 transition-colors">
                <BarChart3 className="text-purple-600 group-hover:text-white transition-colors" size={32} />
              </div>
              <h3 className="font-bold text-xl mb-4 text-gray-900">Analytics</h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                Gain deep insights into asset usage patterns and lifecycle costs.
              </p>
            </div>

            {/* Card 3 */}
            <div className="group p-10 rounded-3xl border border-gray-100 bg-white hover:border-emerald-500 transition-all hover:shadow-2xl hover:shadow-emerald-500/10">
              <div className="mb-6 inline-block p-4 rounded-2xl bg-emerald-50 group-hover:bg-emerald-600 transition-colors">
                <Wrench className="text-emerald-600 group-hover:text-white transition-colors" size={32} />
              </div>
              <h3 className="font-bold text-xl mb-4 text-gray-900">Maintenance</h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                Schedule service alerts and track maintenance history for every unit.
              </p>
            </div>

            {/* Card 4 */}
            <div className="group p-10 rounded-3xl border border-gray-100 bg-white hover:border-orange-500 transition-all hover:shadow-2xl hover:shadow-orange-500/10">
              <div className="mb-6 inline-block p-4 rounded-2xl bg-orange-50 group-hover:bg-orange-600 transition-colors">
                <Settings className="text-orange-500 group-hover:text-white transition-colors" size={32} />
              </div>
              <h3 className="font-bold text-xl mb-4 text-gray-900">Permissions</h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                Tailor roles and access levels to fit your organizational structure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 🎯 CTA Section */}
      <section className="mx-6 mb-24 relative overflow-hidden bg-blue-600 rounded-[3rem] py-24 px-6 text-center shadow-2xl shadow-blue-500/40">
        <div className="relative z-10 max-w-3xl mx-auto text-white">
          <h2 className="text-5xl font-black mb-8">
            Ready to reclaim your time?
          </h2>
          <p className="mb-12 text-blue-100 text-xl">
            Join thousands of teams using PeopleDesk to stay organized.
          </p>

          <Link
            to="/sign-up"
            className="inline-block bg-white text-blue-600 px-12 py-5 rounded-full font-black text-lg hover:bg-gray-50 transition-all transform hover:-translate-y-1 active:scale-95"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* 🔻 Footer */}
      <footer className="bg-white border-t border-gray-100 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1 rounded-lg">
              <Globe className="text-white" size={16} />
            </div>
            <span className="font-bold text-gray-900 text-lg">PeopleDesk</span>
          </div>
          <p className="text-gray-400 text-sm">© 2026 PeopleDesk. All rights reserved.</p>
          <div className="flex gap-8 text-sm font-medium text-gray-500">
            <a href="#" className="hover:text-blue-600 transition">Privacy Policy</a>
            <a href="#" className="hover:text-blue-600 transition">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Hero;
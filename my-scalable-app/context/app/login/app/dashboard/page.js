"use client";
import { useAuth } from "@/context/AuthContext";
import { redirect } from "next/navigation";
import { LayoutDashboard, Users, Settings, LogOut } from "lucide-react";

export default function Dashboard() {
  const { user, logout } = useAuth();

  // Basic Protection logic
  if (typeof window !== "undefined" && !localStorage.getItem("isLoggedIn")) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r hidden md:flex flex-col p-4">
        <div className="text-xl font-bold text-blue-600 mb-8">AdminBoard</div>
        <nav className="space-y-2 flex-1">
          <div className="flex items-center gap-3 p-2 bg-blue-50 text-blue-700 rounded-md"><LayoutDashboard size={20}/> Dashboard</div>
          <div className="flex items-center gap-3 p-2 text-gray-600 hover:bg-gray-50 rounded-md"><Users size={20}/> Users</div>
          <div className="flex items-center gap-3 p-2 text-gray-600 hover:bg-gray-50 rounded-md"><Settings size={20}/> Settings</div>
        </nav>
        <button onClick={logout} className="flex items-center gap-3 p-2 text-red-500 hover:bg-red-50 rounded-md"><LogOut size={20}/> Logout</button>
      </aside>

      {/* Content */}
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-4">Welcome, {user?.email}</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-xl shadow-sm border">Active Projects: 12</div>
          <div className="p-6 bg-white rounded-xl shadow-sm border">Pending Tasks: 5</div>
          <div className="p-6 bg-white rounded-xl shadow-sm border">Messages: 3</div>
        </div>
      </main>
    </div>
  );
}
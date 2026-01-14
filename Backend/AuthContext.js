const logout = () => {
  localStorage.removeItem("token");
  setUser(null);
  window.location.href = "/login"; // Force redirect to clear any residual state
};


"use client";
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Search, LogOut, User, Plus, Trash2, CheckCircle, Circle } from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newTask, setNewTask] = useState("");

  // 1. FETCH PROFILE & DATA
  useEffect(() => {
    const fetchTasks = async () => {
      const res = await fetch('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (res.ok) setTasks(data);
    };
    fetchTasks();
  }, []);

  // 2. SEARCH & FILTER UI LOGIC
  // useMemo prevents re-filtering on every minor render
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => 
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, tasks]);

  // 3. CRUD: CREATE
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newTask) return;
    const res = await fetch('http://localhost:5000/api/tasks', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}` 
      },
      body: JSON.stringify({ title: newTask })
    });
    const data = await res.json();
    setTasks([...tasks, data]);
    setNewTask("");
  };

  // 4. CRUD: DELETE
  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setTasks(tasks.filter(t => t._id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* --- TOP NAV / PROFILE --- */}
      <nav className="bg-white border-b px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
            <User size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">Account</p>
            <p className="text-sm font-medium text-slate-700">{user?.email || 'Loading...'}</p>
          </div>
        </div>
        <button onClick={logout} className="flex items-center gap-2 text-slate-500 hover:text-red-500 transition">
          <LogOut size={18} /> <span className="text-sm font-semibold">Logout</span>
        </button>
      </nav>

      <main className="max-w-4xl mx-auto w-full p-8">
        {/* --- SEARCH & ADD UI --- */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input 
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <form onSubmit={handleAdd} className="flex gap-2">
            <input 
              className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Add task title"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
              <Plus size={18} /> Add
            </button>
          </form>
        </div>

        {/* --- DATA LIST (CRUD DISPLAY) --- */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-4 border-b bg-slate-50/50">
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">My Sample Entities</h2>
          </div>
          <ul className="divide-y divide-slate-100">
            {filteredTasks.length > 0 ? (
              filteredTasks.map(task => (
                <li key={task._id} className="p-4 flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <Circle size={16} className="text-slate-300" />
                    <span className="text-slate-700 font-medium">{task.title}</span>
                  </div>
                  <button 
                    onClick={() => handleDelete(task._id)}
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-md transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </li>
              ))
            ) : (
              <li className="p-12 text-center text-slate-400 italic">No items found matching your search</li>
            )}
          </ul>
        </div>
      </main>
    </div>
  );
}
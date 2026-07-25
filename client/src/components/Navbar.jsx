import React from 'react';
import { GraduationCap, LogOut } from 'lucide-react';

export const Navbar = ({ student, onLogout }) => {
  return (
    <header className="w-full border-b border-slate-300 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
        
        {/* Simple Brand Logo */}
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-lime-500 text-slate-950 rounded-none border border-lime-600">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight">
              Form2Login
            </h1>
          </div>
        </div>

        {/* User Info & Logout Button */}
        {student && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 border border-slate-300 rounded-none">
              <div className="w-6 h-6 bg-lime-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
              </div>
              <div className="text-xs font-semibold text-slate-800">
                {student.name} <span className="font-mono text-lime-800 text-[11px] ml-1">({student.username})</span>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-300 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors rounded-none"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        )}

      </div>
    </header>
  );
};

export default Navbar;

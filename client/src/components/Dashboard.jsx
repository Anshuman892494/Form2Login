import React from 'react';
import { GraduationCap, Mail, Phone, MapPin, User, Calendar, CheckCircle2, Database, Key, ShieldCheck } from 'lucide-react';

export const Dashboard = ({ student, onLogout }) => {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      
      {/* Student Welcome Header Card */}
      <div className="flat-card p-6 rounded-none">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-lime-500 text-slate-950 flex items-center justify-center font-bold text-xl rounded-none border border-lime-600">
              {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">{student.name}</h2>
                <span className="px-2 py-0.5 bg-lime-100 text-lime-900 border border-lime-400 text-[10px] font-bold uppercase rounded-none">
                  Active Student
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-lime-600 inline" />
                Verified Student Profile (MongoDB)
              </p>
            </div>
          </div>

          <div className="bg-slate-100 px-4 py-2 border border-slate-300 font-mono text-left sm:text-right rounded-none w-full sm:w-auto">
            <div className="text-[10px] font-bold text-slate-500 uppercase font-sans">Roll Username</div>
            <div className="text-lg font-bold text-slate-900">{student.username}</div>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Academic Details */}
        <div className="flat-card p-5 rounded-none space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-200">
            <GraduationCap className="w-4 h-4 text-lime-700" />
            Academic Details
          </h3>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center py-0.5">
              <span className="text-slate-500 font-medium">Enrolled Course:</span>
              <span className="font-bold text-slate-900 bg-lime-100 px-2.5 py-0.5 border border-lime-400 rounded-none">
                {student.course}
              </span>
            </div>

            <div className="flex justify-between items-center py-0.5">
              <span className="text-slate-500 font-medium">Father's Name:</span>
              <span className="font-bold text-slate-800">{student.fatherName}</span>
            </div>

            <div className="flex justify-between items-center py-0.5">
              <span className="text-slate-500 font-medium">Registration Date:</span>
              <span className="font-semibold text-slate-700 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                {new Date(student.createdAt || Date.now()).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="flat-card p-5 rounded-none space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-200">
            <User className="w-4 h-4 text-lime-700" />
            Contact Details
          </h3>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center gap-2.5 py-0.5">
              <Mail className="w-4 h-4 text-slate-500 shrink-0" />
              <span className="text-slate-800 font-semibold">{student.email}</span>
            </div>

            <div className="flex items-center gap-2.5 py-0.5">
              <Phone className="w-4 h-4 text-slate-500 shrink-0" />
              <span className="text-slate-800 font-semibold">{student.mobile}</span>
            </div>

            <div className="flex items-center gap-2.5 py-0.5">
              <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
              <span className="text-slate-800 font-semibold">{student.address}</span>
            </div>
          </div>
        </div>

      </div>

      {/* System Security Info */}
      <div className="flat-card p-4 rounded-none">
        <h3 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-lime-700" />
          Security Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-[11px]">
          <div className="bg-slate-50 p-2.5 border border-slate-200 rounded-none">
            <span className="text-slate-500 block mb-0.5">Database</span>
            <span className="font-bold text-slate-800 flex items-center gap-1">
              <Database className="w-3 h-3 text-lime-600" /> MongoDB
            </span>
          </div>

          <div className="bg-slate-50 p-2.5 border border-slate-200 rounded-none">
            <span className="text-slate-500 block mb-0.5">Password Protection</span>
            <span className="font-bold text-slate-800 flex items-center gap-1">
              <Key className="w-3 h-3 text-lime-600" /> bcrypt Hashed
            </span>
          </div>

          <div className="bg-slate-50 p-2.5 border border-slate-200 rounded-none">
            <span className="text-slate-500 block mb-0.5">Session Authentication</span>
            <span className="font-bold text-lime-800 bg-lime-100 px-1.5 py-0.5 border border-lime-300 inline-block rounded-none">JWT Verified</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;

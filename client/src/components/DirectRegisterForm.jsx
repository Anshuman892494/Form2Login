import React, { useState } from 'react';
import { User, Mail, Phone, BookOpen, MapPin, Sparkles, CheckCircle2, AlertCircle, Copy, Check } from 'lucide-react';
import { registerStudentDirect } from '../services/api';

export const DirectRegisterForm = ({ onRegistrationComplete }) => {
  const [formData, setFormData] = useState({
    name: 'Anshu Verma',
    fatherName: 'Ram Verma',
    mobile: '9876543210',
    email: 'anshu@example.com',
    course: 'CCC',
    address: 'Lucknow, Uttar Pradesh',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [resultData, setResultData] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setResultData(null);
    setLoading(true);

    try {
      const res = await registerStudentDirect(formData);

      if (res.success) {
        setResultData(res);
      } else {
        setErrorMsg(res.message || 'Registration failed.');
      }
    } catch (err) {
      setErrorMsg('An error occurred during submission.');
    } finally {
      setLoading(false);
    }
  };

  const copyCredentials = () => {
    if (!resultData?.generatedCredentials) return;
    const text = `Username: ${resultData.generatedCredentials.username}\nPassword: ${resultData.generatedCredentials.password}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="glass-panel rounded-3xl p-8 shadow-2xl relative">
        
        {/* Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Direct Web Form Simulator
          </div>
          <h2 className="text-2xl font-black text-slate-100">Student Registration Form</h2>
          <p className="text-xs text-slate-400 mt-1">Simulates Google Form submission directly into Express & MongoDB</p>
        </div>

        {/* Success Card */}
        {resultData && (
          <div className="mb-8 p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-slate-200 animate-fadeIn">
            <div className="flex items-center gap-3 text-emerald-400 font-bold text-lg mb-2">
              <CheckCircle2 className="w-6 h-6" />
              <span>Student Registration Successful!</span>
            </div>
            <p className="text-xs text-slate-300 mb-4">
              Saved in MongoDB & welcome email dispatched. Here are the generated credentials:
            </p>

            <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-2 mb-4 font-mono">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Username:</span>
                <span className="font-bold text-sky-400 text-base">{resultData.generatedCredentials.username}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Password:</span>
                <span className="font-bold text-emerald-400 text-base">{resultData.generatedCredentials.password}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={copyCredentials}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-2 border border-slate-700 cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Credentials'}</span>
              </button>

              <button
                onClick={() => onRegistrationComplete(resultData.generatedCredentials)}
                className="px-4 py-2.5 rounded-xl btn-gradient text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md"
              >
                <span>Proceed to Login ➔</span>
              </button>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Anshu Verma"
                  className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-slate-100 text-sm outline-none"
                />
              </div>
            </div>

            {/* Father's Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Father's Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Ram Verma"
                  className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-slate-100 text-sm outline-none"
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Mobile Number *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 9876543210"
                  className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-slate-100 text-sm outline-none"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="e.g. anshu@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-slate-100 text-sm outline-none"
                />
              </div>
            </div>

            {/* Course */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Course *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  required
                  placeholder="e.g. CCC / O Level / Web Dev"
                  className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-slate-100 text-sm outline-none"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Lucknow, UP"
                  className="w-full pl-11 pr-4 py-3 rounded-xl glass-input text-slate-100 text-sm outline-none"
                />
              </div>
            </div>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 rounded-xl btn-gradient text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-4"
          >
            {loading ? (
              <span>Generating Credentials & Emailing...</span>
            ) : (
              <span>Submit Form & Register Student</span>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};

export default DirectRegisterForm;

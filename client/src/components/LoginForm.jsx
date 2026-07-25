import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, LogIn, AlertCircle, CheckCircle2, KeyRound } from 'lucide-react';
import { loginStudent } from '../services/api';

export const LoginForm = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!username.trim()) {
      setErrorMsg('Please enter your Username.');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('Please enter your Password.');
      return;
    }

    setLoading(true);

    try {
      const res = await loginStudent(username.trim(), password.trim());

      if (res.success) {
        setSuccessMsg(res.message || 'Login successful!');
        setTimeout(() => {
          onLoginSuccess(res.student, res.token);
        }, 600);
      } else {
        setErrorMsg(res.message || 'Invalid Username or Password');
      }
    } catch (err) {
      setErrorMsg('An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flat-card p-6 rounded-none">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-3 bg-lime-100 border border-lime-400 text-slate-900 flex items-center justify-center rounded-none">
            <KeyRound className="w-6 h-6 text-lime-700" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Form2Login Portal</h2>
          <p className="text-xs text-slate-600 mt-1">Enter your username & password</p>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-4 p-3 bg-lime-100 border border-lime-400 text-slate-900 text-xs flex items-center gap-2 rounded-none">
            <CheckCircle2 className="w-4 h-4 text-lime-700 shrink-0" />
            <span className="font-semibold">{successMsg}</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-100 border border-rose-400 text-rose-900 text-xs flex items-center gap-2 rounded-none">
            <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
            <span className="font-semibold">{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Username Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. EP260001"
                className="w-full pl-9 pr-3 py-2.5 flat-input text-slate-900 placeholder-slate-400 text-xs font-mono font-medium rounded-none"
                disabled={loading}
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-9 pr-10 py-2.5 flat-input text-slate-900 placeholder-slate-400 text-xs font-mono font-medium rounded-none"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-900"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 btn-flat-lime text-slate-950 font-bold text-xs flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer rounded-none mt-2"
          >
            {loading ? (
              <span>Logging in...</span>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Log In</span>
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};

export default LoginForm;

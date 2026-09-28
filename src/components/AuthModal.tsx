import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Lock, Mail, User as UserIcon, GraduationCap, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    authModalOpen, 
    setAuthModalOpen, 
    authModalMode, 
    setAuthModalMode, 
    login, 
    signup, 
    allUsers, 
    switchUser 
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [year, setYear] = useState('2nd Year');
  const [error, setError] = useState<string | null>(null);

  if (!authModalOpen) return null;

  const isLogin = authModalMode === 'login';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isLogin) {
      if (!email.trim() || !password.trim()) {
        setError('Please enter your college email and password');
        return;
      }
      login(email.trim(), password);
    } else {
      if (!name.trim() || !email.trim() || !password.trim()) {
        setError('All fields are required');
        return;
      }
      signup({
        name: name.trim(),
        email: email.trim(),
        department,
        year,
      });
    }
  };

  const handleQuickLogin = (uId: string) => {
    switchUser(uId);
    setAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-md w-full border border-[#EFE8D8] shadow-2xl p-6 sm:p-8 relative animate-in zoom-in-95 duration-150 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full text-[#786F66] hover:bg-[#FAF6EC] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#FEF08A] text-[#372F24] flex items-center justify-center font-bold text-xl mx-auto mb-2 border border-[#FDE047]">
            CF
          </div>
          <h3 className="text-2xl font-extrabold text-[#27221E] font-heading">
            {isLogin ? 'Welcome to CampusFind' : 'Create Student Account'}
          </h3>
          <p className="text-xs text-[#786F66] mt-1">
            {isLogin ? 'Sign in with your campus credentials' : 'Join fellow students recovering lost campus items'}
          </p>
        </div>

        {/* Toggle between Login and Signup */}
        <div className="flex p-1 bg-[#FAF6EC] rounded-2xl border border-[#EFE8D8] mb-5">
          <button
            type="button"
            onClick={() => { setAuthModalMode('login'); setError(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              isLogin ? 'bg-white text-[#27221E] shadow-xs' : 'text-[#6B635B]'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => { setAuthModalMode('signup'); setError(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              !isLogin ? 'bg-white text-[#27221E] shadow-xs' : 'text-[#6B635B]'
            }`}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          
          {!isLogin && (
            <div>
              <label className="block text-[11px] font-bold text-[#857B72] uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Aarav Sharma"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EFE8D8] focus:border-[#FDE047] focus:ring-2 focus:ring-[#FEF9C3] outline-none text-xs text-[#27221E] bg-[#FFFDF9]"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-[#857B72] uppercase tracking-wider mb-1">
              College Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@campus.edu"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EFE8D8] focus:border-[#FDE047] focus:ring-2 focus:ring-[#FEF9C3] outline-none text-xs text-[#27221E] bg-[#FFFDF9]"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#857B72] uppercase tracking-wider mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EFE8D8] focus:border-[#FDE047] focus:ring-2 focus:ring-[#FEF9C3] outline-none text-xs text-[#27221E] bg-[#FFFDF9]"
              required
            />
          </div>

          {!isLogin && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#857B72] uppercase tracking-wider mb-1">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EFE8D8] text-xs text-[#27221E] bg-[#FFFDF9] outline-none"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Mechanical Eng">Mechanical Eng</option>
                  <option value="Electrical Eng">Electrical Eng</option>
                  <option value="Biotechnology">Biotechnology</option>
                  <option value="Business Admin">Business Admin</option>
                  <option value="Architecture">Architecture</option>
                  <option value="Arts & Design">Arts & Design</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#857B72] uppercase tracking-wider mb-1">
                  Academic Year
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EFE8D8] text-xs text-[#27221E] bg-[#FFFDF9] outline-none"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Postgraduate">Postgraduate</option>
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-[#FEF08A] hover:bg-[#FDE047] text-[#713F12] border border-[#FDE047] text-xs font-bold shadow-xs transition-colors mt-2 cursor-pointer"
          >
            {isLogin ? 'Log In to CampusFind' : 'Complete Registration'}
          </button>
        </form>

        {/* 1-Click Quick Demo Sign In */}
        <div className="mt-6 pt-5 border-t border-[#F4EFE6]">
          <p className="text-[11px] font-bold text-[#857B72] text-center mb-2.5">
            Quick 1-Click Demo Accounts
          </p>
          <div className="grid grid-cols-2 gap-2">
            {allUsers.slice(0, 4).map(u => (
              <button
                key={u.userId}
                type="button"
                onClick={() => handleQuickLogin(u.userId)}
                className="p-2 rounded-xl bg-[#FAF6EC] hover:bg-[#FEF9C3] border border-[#EFE8D8] text-left transition-colors flex items-center gap-2 cursor-pointer"
              >
                <img
                  src={u.avatar}
                  alt={u.name}
                  className="w-6 h-6 rounded-md object-cover"
                />
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-[#27221E] truncate">{u.name}</p>
                  <p className="text-[9px] text-[#786F66] truncate">{u.year}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

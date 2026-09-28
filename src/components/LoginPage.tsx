import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AUTH_CONFIG, isAllowedEmailDomain } from '../config/authConfig';
import { 
  Search, 
  Tag, 
  Mail, 
  Lock, 
  User as UserIcon, 
  GraduationCap, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck,
  ArrowRight,
  HelpCircle,
  Eye,
  EyeOff
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, signup, loginWithOAuth } = useApp();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [year, setYear] = useState('2nd Year');
  
  // Forgot password & feedback states
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [showProfileStep, setShowProfileStep] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLogin = mode === 'login';

  const handleOAuthLogin = (provider: 'google' | 'apple') => {
    setError(null);
    setIsSubmitting(true);
    setTimeout(() => {
      loginWithOAuth(provider);
      setIsSubmitting(false);
    }, 400);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    // Validate inputs
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Please enter your student email address.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Optional campus email domain check
    if (!isAllowedEmailDomain(trimmedEmail)) {
      setError(`Only official campus emails (${AUTH_CONFIG.ALLOWED_CAMPUS_DOMAIN}) are permitted to register.`);
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);

    if (isLogin) {
      setTimeout(() => {
        const ok = login(trimmedEmail, password);
        if (!ok) {
          setError('Invalid email or password. Please try again.');
        }
        setIsSubmitting(false);
      }, 350);
    } else {
      // Sign-up flow
      if (!name.trim()) {
        setError('Please enter your full name.');
        setIsSubmitting(false);
        return;
      }

      setTimeout(() => {
        signup({
          name: name.trim(),
          email: trimmedEmail,
          department,
          year,
        });
        setIsSubmitting(false);
      }, 400);
    }
  };

  const handleSendResetEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim() || !/\S+@\S+\.\S+/.test(forgotEmail.trim())) {
      setError('Please enter a valid campus email address.');
      return;
    }
    setError(null);
    setForgotSent(true);
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center px-4 py-8 bg-gradient-to-b from-[#FFFDF0] via-[#FFF9D6] to-[#FFF3B0] selection:bg-[#FEF08A] selection:text-[#713F12]">
      {/* Background ambient decorative blurs */}
      <div className="fixed top-12 left-1/4 w-72 h-72 bg-[#FEF08A]/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-12 right-1/4 w-80 h-80 bg-[#FDE047]/30 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Main Centered Card */}
      <div className="w-full max-w-[460px] bg-[#FFFEF7] rounded-[24px] border border-[#F6E8B9] shadow-[0_12px_40px_rgba(217,163,33,0.14)] p-6 sm:p-9 relative transition-all">
        
        {/* App Logo & Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FFD84D] to-[#FEF08A] border border-[#FACC15] shadow-xs text-[#3D3200] mb-3 group hover:scale-105 transition-transform">
            <div className="relative">
              <Search className="w-6 h-6 stroke-[2.5]" />
              <Tag className="w-3.5 h-3.5 absolute -bottom-1 -right-1 text-[#854D0E] fill-[#FEF9C3]" />
            </div>
          </div>

          <h1 className="text-2xl font-black text-[#2B231A] tracking-tight font-heading">
            Campus Lost &amp; Found
          </h1>
          <p className="text-xs text-[#7A6E62] mt-1 font-medium">
            Lost something? Found something? Let's connect.
          </p>
        </div>

        {/* Tab Toggle: Login vs Sign Up */}
        {!showForgotPassword && (
          <div className="flex bg-[#FBF5E6] p-1 rounded-full border border-[#EFE2C5] mb-5">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
                isLogin
                  ? 'bg-[#FFD84D] text-[#3D3200] shadow-xs hover:bg-[#FACC15]'
                  : 'text-[#7A6E62] hover:text-[#2B231A]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setError(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
                !isLogin
                  ? 'bg-[#FFD84D] text-[#3D3200] shadow-xs hover:bg-[#FACC15]'
                  : 'text-[#7A6E62] hover:text-[#2B231A]'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Error / Feedback banners */}
        {error && (
          <div className="mb-4 p-3 bg-red-50/90 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-snug">{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-start gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-snug">{successMsg}</span>
          </div>
        )}

        {/* FORGOT PASSWORD VIEW */}
        {showForgotPassword ? (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-sm font-bold text-[#2B231A]">Reset Password</h2>
              <p className="text-xs text-[#7A6E62] mt-0.5">
                Enter your campus email to receive a password recovery link.
              </p>
            </div>

            {forgotSent ? (
              <div className="p-4 bg-[#FEF9C3]/80 border border-[#FDE047] rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-[#854D0E] mx-auto" />
                <p className="text-xs font-bold text-[#3D3200]">Recovery email sent!</p>
                <p className="text-[11px] text-[#7A6E62]">
                  Please check <span className="font-semibold text-[#2B231A]">{forgotEmail}</span> for instructions to reset your password.
                </p>
                <button
                  type="button"
                  onClick={() => { setShowForgotPassword(false); setForgotSent(false); }}
                  className="mt-3 px-4 py-1.5 bg-[#FFD84D] text-[#3D3200] text-xs font-bold rounded-full hover:bg-[#FACC15] cursor-pointer"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleSendResetEmail} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#55493D] mb-1">Campus Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A8B7B]" />
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="student@campus.edu"
                      required
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#FAF6EC] border border-[#E9DFCE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FACC15] focus:bg-white text-[#2B231A]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#FFD84D] hover:bg-[#FACC15] text-[#3D3200] font-bold text-xs rounded-full shadow-xs transition-transform active:scale-[0.99] cursor-pointer"
                >
                  Send Reset Link
                </button>

                <button
                  type="button"
                  onClick={() => { setShowForgotPassword(false); setError(null); }}
                  className="w-full py-2 text-xs font-semibold text-[#7A6E62] hover:text-[#2B231A] text-center block"
                >
                  ← Back to Login
                </button>
              </form>
            )}
          </div>
        ) : (
          /* LOGIN OR SIGN UP FORM */
          <div className="space-y-4">
            
            {/* OAuth Quick Options */}
            <div className="space-y-2.5">
              {/* Google Button */}
              <button
                type="button"
                onClick={() => handleOAuthLogin('google')}
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-white hover:bg-[#FFFDF5] border border-[#E9DFCE] hover:border-[#FACC15] rounded-full shadow-2xs text-xs font-bold text-[#372F24] flex items-center justify-center gap-3 transition-all hover:-translate-y-0.5 cursor-pointer disabled:opacity-60"
              >
                {/* Official Google 'G' Icon */}
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Apple Button */}
              <button
                type="button"
                onClick={() => handleOAuthLogin('apple')}
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-white hover:bg-[#FFFDF5] border border-[#E9DFCE] hover:border-[#FACC15] rounded-full shadow-2xs text-xs font-bold text-[#372F24] flex items-center justify-center gap-3 transition-all hover:-translate-y-0.5 cursor-pointer disabled:opacity-60"
              >
                {/* Official Apple Icon */}
                <svg className="w-4 h-4 shrink-0 fill-current text-black" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.74 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.08-7.73-7.98-12.13-14.7-5.99-9.13-10.77-19.46-14.34-30.01-3.57-10.55-5.36-20.73-5.36-30.54 0-14.1 3.52-25.75 10.56-34.96 7.04-9.21 15.93-13.93 26.66-14.16 5.26 0 11.05 1.34 17.38 4.02 6.33 2.68 10.37 4.08 12.12 4.19 1.57-.11 5.79-1.57 12.67-4.39 6.87-2.82 12.74-4.14 17.61-3.96 13.88.78 24.59 5.86 32.14 15.24-12.19 7.37-18.17 17.44-17.94 30.21.22 10.27 4.14 18.79 11.75 25.56 7.61 6.77 16.55 10.55 26.83 11.34-2.23 6.92-5.02 14.35-8.37 22.26zm-38.99-122.9c0 7.26-2.68 14.18-8.04 20.77-6.25 7.48-13.86 11.83-22.82 11.05-.11-1.01-.17-1.9-.17-2.68 0-7.03 2.85-14.07 8.54-21.11 5.7-7.04 13.06-11.23 22.09-12.56.22 1.45.4 3.01.4 4.53z" />
                </svg>
                <span>Continue with Apple</span>
              </button>
            </div>

            {/* Subtle Divider */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-[#EFE2C5]" />
              <span className="shrink mx-3 text-[11px] font-semibold text-[#9A8B7B] uppercase tracking-wider">
                or email
              </span>
              <div className="flex-grow border-t border-[#EFE2C5]" />
            </div>

            {/* Email + Password Form */}
            <form onSubmit={handleFormSubmit} className="space-y-3.5">
              
              {/* Extra Sign Up Fields */}
              {!isLogin && (
                <>
                  <div>
                    <label className="block text-[11px] font-bold text-[#55493D] mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A8B7B]" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Aarav Sharma"
                        required={!isLogin}
                        className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF6EC] border border-[#E9DFCE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FACC15] focus:bg-white text-[#2B231A]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-[#55493D] mb-1">
                        Department
                      </label>
                      <div className="relative">
                        <GraduationCap className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#9A8B7B]" />
                        <select
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          className="w-full pl-8 pr-2 py-2 text-xs bg-[#FAF6EC] border border-[#E9DFCE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FACC15] focus:bg-white text-[#2B231A]"
                        >
                          <option value="Computer Science">Comp Science</option>
                          <option value="Information Tech">Info Tech</option>
                          <option value="Mechanical Eng">Mech Eng</option>
                          <option value="Electronics & Comm">ECE</option>
                          <option value="Civil Engineering">Civil</option>
                          <option value="Business Admin">Business</option>
                          <option value="General Studies">General</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#55493D] mb-1">
                        Academic Year
                      </label>
                      <div className="relative">
                        <Calendar className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#9A8B7B]" />
                        <select
                          value={year}
                          onChange={(e) => setYear(e.target.value)}
                          className="w-full pl-8 pr-2 py-2 text-xs bg-[#FAF6EC] border border-[#E9DFCE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FACC15] focus:bg-white text-[#2B231A]"
                        >
                          <option value="1st Year">1st Year</option>
                          <option value="2nd Year">2nd Year</option>
                          <option value="3rd Year">3rd Year</option>
                          <option value="4th Year">4th Year</option>
                          <option value="Postgraduate">Postgrad</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Email field */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[11px] font-bold text-[#55493D]">
                    Campus Email
                  </label>
                  {AUTH_CONFIG.ALLOWED_CAMPUS_DOMAIN && (
                    <span className="text-[10px] text-[#854D0E] bg-[#FEF9C3] px-1.5 py-0.5 rounded font-medium">
                      Requires {AUTH_CONFIG.ALLOWED_CAMPUS_DOMAIN}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A8B7B]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={AUTH_CONFIG.ALLOWED_CAMPUS_DOMAIN ? `you${AUTH_CONFIG.ALLOWED_CAMPUS_DOMAIN}` : 'student@campus.edu'}
                    required
                    className="w-full pl-9 pr-3 py-2.5 text-xs bg-[#FAF6EC] border border-[#E9DFCE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FACC15] focus:bg-white text-[#2B231A]"
                  />
                </div>
              </div>

              {/* Password field */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[11px] font-bold text-[#55493D]">
                    Password
                  </label>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={() => { setShowForgotPassword(true); setError(null); }}
                      className="text-[11px] text-[#854D0E] hover:underline font-semibold"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A8B7B]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-9 pr-10 py-2.5 text-xs bg-[#FAF6EC] border border-[#E9DFCE] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FACC15] focus:bg-white text-[#2B231A]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9A8B7B] hover:text-[#55493D]"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#FFD84D] hover:bg-[#FACC15] text-[#3D3200] font-bold text-xs rounded-full shadow-[0_4px_14px_rgba(234,179,8,0.35)] transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
              >
                <span>{isLogin ? 'Sign In to CampusFind' : 'Complete Registration'}</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </form>

            {/* Quick Demo Student Auto-fill */}
            <div className="pt-3 border-t border-[#F2E8D2] text-center">
              <span className="text-[10px] text-[#8C7E70] block mb-2 font-medium">
                Campus Student Quick Login:
              </span>
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('aarav.sharma@campus.edu');
                    setPassword('password123');
                    setMode('login');
                  }}
                  className="px-2.5 py-1 text-[10px] font-semibold bg-[#FAF4E2] hover:bg-[#FEF08A] text-[#713F12] rounded-lg border border-[#EFE2C5] transition-colors"
                >
                  Aarav (CS 3rd Yr)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('priya.patel@campus.edu');
                    setPassword('password123');
                    setMode('login');
                  }}
                  className="px-2.5 py-1 text-[10px] font-semibold bg-[#FAF4E2] hover:bg-[#FEF08A] text-[#713F12] rounded-lg border border-[#EFE2C5] transition-colors"
                >
                  Priya (IT 2nd Yr)
                </button>
              </div>
            </div>

          </div>
        )}

        {/* Security badge at bottom of card */}
        <div className="mt-6 pt-3 border-t border-[#F4EFE6] flex items-center justify-center gap-1.5 text-[10px] text-[#8C8074]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
          <span>Encrypted Campus Authentication Protocol</span>
        </div>

      </div>

      {/* Footer attribution */}
      <p className="text-[11px] text-[#8A7C6B] mt-5 text-center">
        Campus Lost &amp; Found Portal • Protected Student Area
      </p>
    </div>
  );
};

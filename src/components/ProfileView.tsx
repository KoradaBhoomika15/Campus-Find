import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User as UserIcon, 
  Mail, 
  GraduationCap, 
  Calendar, 
  Edit3, 
  LogOut, 
  RotateCcw, 
  CheckCircle2, 
  Layers, 
  ShieldCheck,
  Sparkles,
  Users
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { 
    currentUser, 
    allUsers, 
    items, 
    claims, 
    logout, 
    switchUser, 
    resetAllDemoData, 
    setAuthModalOpen 
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [department, setDepartment] = useState(currentUser?.department || '');
  const [year, setYear] = useState(currentUser?.year || '');

  if (!currentUser) {
    return (
      <div className="bg-white rounded-3xl p-10 border border-[#EFE8D8] text-center max-w-md mx-auto my-12">
        <h3 className="text-xl font-bold text-[#27221E] font-heading">
          Sign In Required
        </h3>
        <p className="text-xs text-[#786F66] mt-2 leading-relaxed">
          Please log in to view your college profile and reports history.
        </p>
        <button
          onClick={() => setAuthModalOpen(true)}
          className="mt-6 px-6 py-2.5 rounded-2xl bg-[#FEF08A] hover:bg-[#FDE047] text-[#713F12] border border-[#FDE047] text-xs font-bold shadow-xs transition-colors"
        >
          Sign In
        </button>
      </div>
    );
  }

  const userReports = items.filter(i => i.userId === currentUser.userId);
  const recoveredCount = userReports.filter(i => i.status === 'Resolved' || i.status === 'Returned' || i.status === 'Found').length;
  const userClaimsCount = claims.filter(c => c.claimantId === currentUser.userId).length;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    currentUser.name = name;
    currentUser.department = department;
    currentUser.year = year;
    setIsEditing(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-[#EFE8D8] p-6 sm:p-10 shadow-xs relative overflow-hidden">
        
        {/* Decorative backdrop */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FEF9C3]/50 rounded-full blur-2xl pointer-events-none -z-0" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          
          <img
            src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
            alt={currentUser.name}
            className="w-24 h-24 rounded-2xl object-cover border-2 border-[#FDE047] shadow-md"
          />

          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF9C3] text-[#713F12] text-xs font-bold border border-[#FEF08A] mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
              Verified College Student
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#27221E] font-heading">
              {currentUser.name}
            </h2>

            <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-[#6B635B]">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-[#854D0E]" />
                {currentUser.email}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-[#854D0E]" />
                {currentUser.department}
              </span>
              <span>•</span>
              <span className="font-semibold text-[#713F12]">
                {currentUser.year}
              </span>
            </div>

            <div className="mt-4 flex items-center justify-center sm:justify-start gap-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-1.5 rounded-xl border border-[#EFE8D8] text-xs font-bold text-[#5C5349] hover:bg-[#FAF6EC] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
              </button>

              <button
                onClick={logout}
                className="px-4 py-1.5 rounded-xl border border-red-200 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="mt-6 pt-6 border-t border-[#F4EFE6] space-y-4">
            <h4 className="text-xs font-bold text-[#857B72] uppercase tracking-wider">
              Update Student Details
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#27221E] mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EFE8D8] text-xs bg-[#FFFDF9]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#27221E] mb-1">Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#EFE8D8] text-xs bg-[#FFFDF9]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#27221E] mb-1">Academic Year</label>
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="e.g. 3rd Year"
                  className="w-full px-3 py-2 rounded-xl border border-[#EFE8D8] text-xs bg-[#FFFDF9]"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#FEF08A] hover:bg-[#FDE047] text-[#713F12] border border-[#FDE047] text-xs font-bold shadow-xs cursor-pointer"
              >
                Save Profile
              </button>
            </div>
          </form>
        )}

      </div>

      {/* College Statistics Grid per Section 17 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-[#EFE8D8] shadow-xs text-center">
          <p className="text-3xl font-black text-[#27221E] font-heading">{userReports.length}</p>
          <p className="text-xs font-semibold text-[#857B72] uppercase tracking-wider mt-1">Number of Reports</p>
          <span className="text-[11px] text-[#A3998E] mt-1 block">Active &amp; resolved listings</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#EFE8D8] shadow-xs text-center">
          <p className="text-3xl font-black text-[#16A34A] font-heading">{recoveredCount}</p>
          <p className="text-xs font-semibold text-[#857B72] uppercase tracking-wider mt-1">Items Recovered</p>
          <span className="text-[11px] text-[#A3998E] mt-1 block">Safely returned on campus</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#EFE8D8] shadow-xs text-center">
          <p className="text-3xl font-black text-[#854D0E] font-heading">{userClaimsCount}</p>
          <p className="text-xs font-semibold text-[#857B72] uppercase tracking-wider mt-1">Claims Submitted</p>
          <span className="text-[11px] text-[#A3998E] mt-1 block">Ownership verification requests</span>
        </div>
      </div>

      {/* Demo Account Switcher (For seamless testing of multi-user claim flows) */}
      <div className="bg-white rounded-3xl border border-[#EFE8D8] p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-[#854D0E]" />
          <h3 className="text-base font-bold text-[#27221E] font-heading">
            Switch Demo Student Account
          </h3>
        </div>
        <p className="text-xs text-[#786F66]">
          Switch between students to test the full lifecycle: Report lost phone as Aarav → browse &amp; submit claim → switch to Priya (who found it) → accept claim and coordinate return.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {allUsers.map(u => {
            const isCurrent = u.userId === currentUser.userId;

            return (
              <div
                key={u.userId}
                onClick={() => switchUser(u.userId)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isCurrent
                    ? 'bg-[#FEF9C3] border-[#FDE047] shadow-xs'
                    : 'bg-[#FFFDF9] border-[#EFE8D8] hover:bg-[#FAF6EC]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="w-10 h-10 rounded-xl object-cover border border-[#EFE8D8]"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-[#27221E]">{u.name}</h4>
                    <p className="text-[11px] text-[#786F66]">{u.department} • {u.year}</p>
                  </div>
                </div>

                {isCurrent ? (
                  <span className="text-[10px] font-bold text-[#713F12] bg-[#FEF08A] px-2 py-0.5 rounded-full border border-[#FDE047]">
                    Active
                  </span>
                ) : (
                  <span className="text-xs text-[#854D0E] font-bold hover:underline">
                    Switch
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Reset Demo State Button */}
      <div className="p-4 bg-[#FAF6EC] rounded-2xl border border-[#EFE8D8] flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-[#27221E]">Reset Demo Data</p>
          <p className="text-[11px] text-[#786F66]">Restore original sample lost &amp; found items and claims.</p>
        </div>
        <button
          onClick={() => {
            if (confirm('Reset demo data to initial state?')) {
              resetAllDemoData();
            }
          }}
          className="px-3.5 py-1.5 rounded-xl border border-[#EFE8D8] bg-white hover:bg-red-50 text-xs font-bold text-red-600 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Demo
        </button>
      </div>

    </div>
  );
};

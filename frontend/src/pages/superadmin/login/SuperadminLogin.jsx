import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Loader2, ShieldCheck, Activity, Globe } from "lucide-react";
import { SuccessAlert } from "../../../components/auth";

export default function SuperadminLogin() {
  const navigate = useNavigate();

  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    // This page is no longer active. /superadmin/login redirects to /login.
    // Keeping this file as a historical reference only.
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col justify-center relative overflow-hidden">
      {/* Light Abstract Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.05]" 
             style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #cbd5e1 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-lg mx-auto px-6">
        {/* Logo/Brand Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-2xl mb-6 shadow-xl shadow-emerald-500/20 rotate-3">
            <ShieldCheck className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">
            Pinnex<span className="text-emerald-600">Ventures</span> 
            <span className="ml-2 px-2 py-0.5 bg-slate-200 text-slate-600 text-xs font-bold rounded uppercase tracking-widest border border-slate-300">Platform</span>
          </h1>
          <p className="text-slate-500 font-medium">Platform Administration Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-10 shadow-2xl shadow-slate-200/50">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">
                Admin Email
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@pinnexventures.com"
                  disabled={isLoading}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all outline-none"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">
                Security Key
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  disabled={isLoading}
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-lg transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Authenticating...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Access Dashboard
                  <Activity className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </form>

          {/* Quick Stats/Footer Info */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
              <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                <Globe className="w-3 h-3 text-emerald-500" />
                Connectivity
              </div>
              <div className="text-slate-900 text-sm font-semibold">Active Node</div>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
              <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                Security
              </div>
              <div className="text-slate-900 text-sm font-semibold">Verified</div>
            </div>
          </div>
        </div>

        {/* System Footer */}
        <div className="mt-12 text-center text-slate-500 text-sm">
          <p className="font-medium">PinnexVentures Orchestrator v1.0.0</p>
          <div className="mt-2 flex items-center justify-center gap-4">
            <span className="hover:text-emerald-600 cursor-pointer transition-colors">Security Details</span>
            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
            <span className="hover:text-emerald-600 cursor-pointer transition-colors">Platform Status</span>
          </div>
        </div>
      </div>

      <SuccessAlert
        isOpen={showSuccessAlert}
        title="Identity Verified"
        message="System authorization successful. Initiating secure session."
        onClose={() => setShowSuccessAlert(false)}
        autoCloseDelay={3000}
      />
    </div>
  );
}

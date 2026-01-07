import { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { ForgotPasswordModal, SuccessAlert } from "../../components/auth";

export default function Login() {
  const { themeColors } = useTheme();
  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Modal state
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  // Handle login
  const handleLogin = (e) => {
    e.preventDefault();
    // Add login logic here
    console.log("Login:", { email, password, rememberMe });
    
    // Navigate to dashboard
    window.location.href = "/dashboard/";
  };

  // Handle forgot password success
  const handleForgotPasswordSuccess = () => {
    setShowSuccessAlert(true);
  };

  return (
    <div className={`min-h-screen relative overflow-hidden ${themeColors.pageGradient}`}>
      {/* Static Curved Pattern Background */}
      <div className="absolute inset-0 overflow-hidden">
        <svg
          className="absolute bottom-0 left-0 w-full h-full"
          viewBox="0 0 1440 800"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          
          {/* Static waves */}
          <path
            d="M0,400 C320,200 640,600 960,400 C1280,200 1440,400 1440,400 L1440,800 L0,800 Z"
            fill="url(#gradient1)"
          />
          <path
            d="M0,500 C360,300 720,700 1080,500 C1320,350 1440,500 1440,500 L1440,800 L0,800 Z"
            fill="url(#gradient2)"
          />
        </svg>
        
        {/* Decorative circles using theme colors */}
        <div className={`absolute top-20 left-20 w-72 h-72 ${themeColors.decorativeCircle1} rounded-full mix-blend-multiply filter blur-3xl opacity-20`}></div>
        <div className={`absolute top-40 right-20 w-72 h-72 ${themeColors.decorativeCircle2} rounded-full mix-blend-multiply filter blur-3xl opacity-20`}></div>
        <div className={`absolute bottom-20 left-1/2 w-72 h-72 ${themeColors.decorativeCircle3} rounded-full mix-blend-multiply filter blur-3xl opacity-20`}></div>
      </div>

      {/* Login Form */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="text-center mb-8 animate-fade-in">
            <h1 className={`text-4xl font-bold ${themeColors.logoGradient} bg-clip-text text-transparent`}>
              StringVentory
            </h1>
            <p className="text-gray-600 mt-2">Welcome back! Please sign in to continue</p>
          </div>

          {/* Login Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/50 animate-slide-up">
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={`w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 
                             ${themeColors.focusRing} focus:border-transparent transition-all outline-none
                             bg-white/50 backdrop-blur-sm`}
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className={`w-full pl-11 pr-11 py-3 border border-gray-300 rounded-lg focus:ring-2 
                             ${themeColors.focusRing} focus:border-transparent transition-all outline-none
                             bg-white/50 backdrop-blur-sm`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className={`w-4 h-4 ${themeColors.textColor} border-gray-300 rounded ${themeColors.focusRing}`}
                  />
                  <span className="text-sm text-gray-700">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotPasswordModal(true)}
                  className={`text-sm ${themeColors.textColor} ${themeColors.textHover} font-medium transition-colors`}
                >
                  Forgot password?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className={`w-full ${themeColors.buttonGradient} text-white py-3 px-4 
                         rounded-lg font-medium ${themeColors.buttonHover} 
                         transform hover:scale-[1.02] transition-all duration-200 shadow-lg 
                         hover:shadow-xl`}
              >
                Sign In
              </button>
            </form>

            {/* Contact Admin Message */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <span className="text-gray-900 font-medium">Contact admin to be added.</span>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              Developed by{" "}
              <a
                href="https://stringtech.co.uk/"
                target="_blank"
                rel="noopener noreferrer"
                className={`${themeColors.textColor} ${themeColors.textHover} font-medium transition-colors`}
              >
                StringTech
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
        onSuccess={handleForgotPasswordSuccess}
      />

      {/* Success Alert */}
      <SuccessAlert
        isOpen={showSuccessAlert}
        title="Success!"
        message="Your password has been reset successfully."
        onClose={() => setShowSuccessAlert(false)}
        autoCloseDelay={3000}
      />

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

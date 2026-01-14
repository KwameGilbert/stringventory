import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { ForgotPasswordModal, SuccessAlert } from "../../components/auth";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Modal state
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  // Handle forgot password success
  const handleForgotPasswordSuccess = () => {
    setShowSuccessAlert(true);
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #e0f7f4 0%, #b8ebe5 50%, #8dd5cc 100%)' }}>
      {/* Static Curved Wave Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top wave */}
        <svg
          className="absolute top-0 left-0 w-full"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          style={{ height: '200px' }}
        >
          <path
            fill="rgba(255, 255, 255, 0.3)"
            d="M0,160L48,170.7C96,181,192,203,288,192C384,181,480,139,576,128C672,117,768,139,864,160C960,181,1056,203,1152,197.3C1248,192,1344,160,1392,144L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />
        </svg>

        {/* Bottom left wave */}
        <svg
          className="absolute bottom-0 left-0 w-full"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          style={{ height: '300px' }}
        >
          <path
            fill="rgba(100, 200, 190, 0.4)"
            d="M0,224L60,213.3C120,203,240,181,360,186.7C480,192,600,224,720,229.3C840,235,960,213,1080,186.7C1200,160,1320,128,1380,112L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          />
        </svg>

        {/* Bottom wave overlay */}
        <svg
          className="absolute bottom-0 left-0 w-full"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          style={{ height: '250px' }}
        >
          <path
            fill="rgba(128, 210, 200, 0.5)"
            d="M0,288L48,272C96,256,192,224,288,218.7C384,213,480,235,576,245.3C672,256,768,256,864,234.7C960,213,1056,171,1152,165.3C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>

        {/* Right side wave */}
        <svg
          className="absolute top-1/4 right-0"
          viewBox="0 0 200 600"
          preserveAspectRatio="none"
          style={{ height: '60%', width: '150px' }}
        >
          <path
            fill="rgba(100, 190, 180, 0.3)"
            d="M200,0 Q100,150 200,300 Q100,450 200,600 L200,600 L200,0 Z"
          />
        </svg>
      </div>

      {/* Content Container */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold italic text-emerald-600 mb-2">
            StringVentory
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Welcome back! Please sign in to continue
          </p>
        </div>

        {/* Login Card */}
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all outline-none"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all outline-none"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-emerald-500 border-gray-300 rounded focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => setShowForgotPasswordModal(true)}
                className="text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg font-medium transition-all shadow-lg shadow-emerald-500/30"
            >
              Sign In
            </button>

            {/* Footer Text */}
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <span className="font-semibold text-gray-800 cursor-pointer hover:underline">
                Contact admin to be added.
              </span>
            </p>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Developed by{" "}
          <span className="text-emerald-600 font-medium">StringTech</span>
        </div>
      </div>

      {/* Modals */}
      <ForgotPasswordModal
        isOpen={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
        onSuccess={handleForgotPasswordSuccess}
      />

      <SuccessAlert
        isOpen={showSuccessAlert}
        title="Success!"
        message="Your password has been reset successfully."
        onClose={() => setShowSuccessAlert(false)}
        autoCloseDelay={3000}
      />
    </div>
  );
}

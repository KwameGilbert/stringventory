import { useState } from "react";

import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { ForgotPasswordModal, SuccessAlert } from "../../components/auth";

export default function Login() {

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
    <div className="min-h-screen flex w-full bg-slate-50">
      {/* Left Side - Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="space-y-2">
             <div className="h-4 w-4 bg-cyan-300 mb-6"></div> {/* Logo Placeholder Square */}
            <h1 className="text-3xl font-bold text-gray-900">Login</h1>
            <p className="text-gray-500 text-sm">See your growth and get support!</p>
          </div>

          {/* Social Login */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors bg-white text-sm font-medium text-gray-700"
          >
            Sign in with google
            <span className="text-lg font-bold text-blue-500">G</span> {/* Simple G representation */}
          </button>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Email*
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 bg-gray-100 border-none rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all outline-none"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Password*
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="minimum 8 characters"
                    className="w-full px-4 py-3 bg-gray-100 border-none rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all outline-none"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-slate-900 border-gray-300 rounded focus:ring-slate-900"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => setShowForgotPasswordModal(true)}
                className="text-sm font-medium text-slate-900 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#1e1b4b] hover:bg-[#1e1b4b]/90 text-white rounded-full font-medium transition-colors shadow-lg shadow-indigo-500/20"
            >
              Login
            </button>

            {/* Footer Text */}
            <p className="text-center text-sm text-gray-600">
              Not regestered yet?{" "}
              <span className="font-medium text-slate-900 cursor-pointer hover:underline">
                Create a new account
              </span>
            </p>
          </form>
        </div>
      </div>

      {/* Right Side - Illustration Section */}
      <div className="hidden lg:flex w-1/2 bg-slate-50 items-center justify-center p-12 relative overflow-hidden">
        {/* Background Decorative Elements - simulating the isometric feel */}
        <div className="absolute inset-0">
             {/* We can add a subtle pattern or gradient here if needed */}
        </div>
        
        {/* Illustration Container */}
        <div className="relative w-full max-w-lg aspect-square">
            {/* 
                Since we don't have the exact illustration asset, 
                we'll use a placeholder or a simple CSS composition to represent 'Inventory/Analytics' 
                or just a clean placeholder div for now. 
            */}
            <img 
                src="/assets/login_img.png" 
                alt="Login Illustration"
                className="w-full h-full object-contain"
            />
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

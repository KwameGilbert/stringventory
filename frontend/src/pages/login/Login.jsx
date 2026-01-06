import { useState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function Login() {
  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Forgot password flow state
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1); // 1: email, 2: OTP, 3: reset password
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [otpTimer, setOtpTimer] = useState(300); // 5 minutes in seconds
  const [canResendOtp, setCanResendOtp] = useState(false);

  // OTP timer countdown
  useEffect(() => {
    if (forgotPasswordStep === 2 && otpTimer > 0) {
      const interval = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            setCanResendOtp(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [forgotPasswordStep, otpTimer]);

  // Format timer display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Handle login
  const handleLogin = (e) => {
    e.preventDefault();
    // Add login logic here
    console.log("Login:", { email, password, rememberMe });
  };

  // Handle forgot password - Step 1: Send OTP
  const handleSendOtp = (e) => {
    e.preventDefault();
    if (forgotEmail) {
      // Add API call to send OTP
      console.log("Sending OTP to:", forgotEmail);
      setForgotPasswordStep(2);
      setOtpTimer(300);
      setCanResendOtp(false);
    }
  };

  // Handle forgot password - Step 2: Verify OTP
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length === 6) {
      // Add API call to verify OTP
      console.log("Verifying OTP:", otpString);
      setForgotPasswordStep(3);
    }
  };

  // Handle forgot password - Step 3: Reset Password
  const handleResetPassword = (e) => {
    e.preventDefault();
    if (newPassword && newPassword === confirmPassword) {
      // Add API call to reset password
      console.log("Resetting password");
      setShowForgotPasswordModal(false);
      setShowSuccessAlert(true);
      
      // Auto-hide success alert after 3 seconds
      setTimeout(() => {
        setShowSuccessAlert(false);
        resetForgotPasswordFlow();
      }, 3000);
    }
  };

  // Reset forgot password flow
  const resetForgotPasswordFlow = () => {
    setForgotPasswordStep(1);
    setForgotEmail("");
    setOtp(["", "", "", "", "", ""]);
    setNewPassword("");
    setConfirmPassword("");
    setOtpTimer(300);
    setCanResendOtp(false);
  };

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  // Handle OTP backspace
  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  // Resend OTP
  const handleResendOtp = () => {
    if (canResendOtp) {
      console.log("Resending OTP to:", forgotEmail);
      setOtpTimer(300);
      setCanResendOtp(false);
      setOtp(["", "", "", "", "", ""]);
    }
  };

  // Calculate password strength
  const getPasswordStrength = (pass) => {
    if (!pass) return { strength: 0, label: "", color: "" };
    
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength++;
    if (/\d/.test(pass)) strength++;
    if (/[^a-zA-Z0-9]/.test(pass)) strength++;

    const labels = ["", "Weak", "Fair", "Good", "Strong"];
    const colors = ["", "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-emerald-500"];
    
    return { strength, label: labels[strength], color: colors[strength] };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Animated Curved Pattern Background */}
      <div className="absolute inset-0 overflow-hidden">
        <svg
          className="absolute bottom-0 left-0 w-full h-full"
          viewBox="0 0 1440 800"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.25" />
            </linearGradient>
          </defs>
          
          {/* Animated waves */}
          <path
            d="M0,400 C320,200 640,600 960,400 C1280,200 1440,400 1440,400 L1440,800 L0,800 Z"
            fill="url(#gradient1)"
            className="animate-wave"
          />
          <path
            d="M0,500 C360,300 720,700 1080,500 C1320,350 1440,500 1440,500 L1440,800 L0,800 Z"
            fill="url(#gradient2)"
            className="animate-wave-slow"
          />
        </svg>
        
        {/* Decorative circles */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Login Form */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
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
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 
                             focus:ring-emerald-500 focus:border-transparent transition-all outline-none
                             bg-white/50 backdrop-blur-sm"
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
                    className="w-full pl-11 pr-11 py-3 border border-gray-300 rounded-lg focus:ring-2 
                             focus:ring-emerald-500 focus:border-transparent transition-all outline-none
                             bg-white/50 backdrop-blur-sm"
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
                    className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-700">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotPasswordModal(true)}
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 px-4 
                         rounded-lg font-medium hover:from-emerald-600 hover:to-teal-700 
                         transform hover:scale-[1.02] transition-all duration-200 shadow-lg 
                         hover:shadow-xl"
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
                className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
              >
                StringTech
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-scale-in">
            {/* Step 1: Email Input */}
            {forgotPasswordStep === 1 && (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
                  <p className="text-gray-600 text-sm">
                    Enter your email address and we'll send you an OTP to reset your password.
                  </p>
                </div>

                <form onSubmit={handleSendOtp} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 
                                 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPasswordModal(false);
                        resetForgotPasswordFlow();
                      }}
                      className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg 
                               hover:bg-gray-50 transition-all font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 
                               text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 
                               transition-all font-medium shadow-lg hover:shadow-xl"
                    >
                      Send OTP
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* Step 2: OTP Verification */}
            {forgotPasswordStep === 2 && (
              <>
                <div className="mb-6">
                  <button
                    onClick={() => setForgotPasswordStep(1)}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back
                  </button>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify OTP</h2>
                  <p className="text-gray-600 text-sm">
                    We've sent a 6-digit code to <span className="font-medium">{forgotEmail}</span>
                  </p>
                </div>

                <form onSubmit={handleVerifyOtp} className="space-y-5">
                  {/* OTP Input Fields */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Enter OTP
                    </label>
                    <div className="flex gap-2 justify-between">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          className="w-12 h-12 text-center text-xl font-bold border border-gray-300 
                                   rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent 
                                   transition-all outline-none"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Timer */}
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Time remaining: <span className="font-medium text-emerald-600">{formatTime(otpTimer)}</span>
                    </p>
                    {canResendOtp && (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="text-sm text-emerald-600 hover:text-emerald-700 font-medium mt-2 transition-colors"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={otp.join("").length !== 6}
                    className="w-full px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 
                             text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 
                             transition-all font-medium shadow-lg hover:shadow-xl
                             disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Verify OTP
                  </button>
                </form>
              </>
            )}

            {/* Step 3: Reset Password */}
            {forgotPasswordStep === 3 && (
              <>
                <div className="mb-6">
                  <button
                    onClick={() => setForgotPasswordStep(2)}
                    className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back
                  </button>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h2>
                  <p className="text-gray-600 text-sm">
                    Enter your new password below
                  </p>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-5">
                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="w-full pl-11 pr-11 py-3 border border-gray-300 rounded-lg focus:ring-2 
                                 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    
                    {/* Password Strength Indicator */}
                    {newPassword && (
                      <div className="mt-2">
                        <div className="flex gap-1 mb-1">
                          {[1, 2, 3, 4].map((level) => (
                            <div
                              key={level}
                              className={`h-1 flex-1 rounded-full transition-all ${
                                level <= passwordStrength.strength ? passwordStrength.color : "bg-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-gray-600">
                          Password strength: <span className="font-medium">{passwordStrength.label}</span>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="w-full pl-11 pr-11 py-3 border border-gray-300 rounded-lg focus:ring-2 
                                 focus:ring-emerald-500 focus:border-transparent transition-all outline-none"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {confirmPassword && newPassword !== confirmPassword && (
                      <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={!newPassword || newPassword !== confirmPassword}
                    className="w-full px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 
                             text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 
                             transition-all font-medium shadow-lg hover:shadow-xl
                             disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Reset Password
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Success Alert */}
      {showSuccessAlert && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center animate-scale-in">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Success!</h3>
            <p className="text-gray-600 mb-6">
              Your password has been reset successfully.
            </p>
            <button
              onClick={() => {
                setShowSuccessAlert(false);
                resetForgotPasswordFlow();
              }}
              className="w-full px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 
                       text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 
                       transition-all font-medium shadow-lg hover:shadow-xl"
            >
              Continue to Login
            </button>
          </div>
        </div>
      )}

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes wave {
          0%, 100% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(-25%) translateY(-10%); }
        }
        
        @keyframes wave-slow {
          0%, 100% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(25%) translateY(-15%); }
        }
        
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
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
        
        .animate-wave {
          animation: wave 15s ease-in-out infinite;
        }
        
        .animate-wave-slow {
          animation: wave-slow 20s ease-in-out infinite;
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
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

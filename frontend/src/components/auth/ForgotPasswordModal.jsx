import { useState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

export default function ForgotPasswordModal({ isOpen, onClose, onSuccess }) {
  const { themeColors } = useTheme();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpTimer, setOtpTimer] = useState(300);
  const [canResendOtp, setCanResendOtp] = useState(false);

  // OTP timer countdown
  useEffect(() => {
    if (step === 2 && otpTimer > 0) {
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
  }, [step, otpTimer]);

  // Format timer display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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
    const colors = ["", "bg-red-500", "bg-orange-500", "bg-yellow-500", themeColors.strengthStrong];
    
    return { strength, label: labels[strength], color: colors[strength] };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  // Handle Step 1: Send OTP
  const handleSendOtp = (e) => {
    e.preventDefault();
    if (email) {
      console.log("Sending OTP to:", email);
      setStep(2);
      setOtpTimer(300);
      setCanResendOtp(false);
    }
  };

  // Handle Step 2: Verify OTP
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length === 6) {
      console.log("Verifying OTP:", otpString);
      setStep(3);
    }
  };

  // Handle Step 3: Reset Password
  const handleResetPassword = (e) => {
    e.preventDefault();
    if (newPassword && newPassword === confirmPassword) {
      console.log("Resetting password");
      resetFlow();
      onClose();
      onSuccess();
    }
  };

  // Reset flow
  const resetFlow = () => {
    setStep(1);
    setEmail("");
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
      console.log("Resending OTP to:", email);
      setOtpTimer(300);
      setCanResendOtp(false);
      setOtp(["", "", "", "", "", ""]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-scale-in">
        {/* Step 1: Email Input */}
        {step === 1 && (
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={`w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 
                             ${themeColors.focusRing} focus:border-transparent transition-all outline-none`}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    resetFlow();
                    onClose();
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg 
                           hover:bg-gray-50 transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`flex-1 px-4 py-3 ${themeColors.buttonGradient} 
                           text-white rounded-lg ${themeColors.buttonHover} 
                           transition-all font-medium shadow-lg hover:shadow-xl`}
                >
                  Send OTP
                </button>
              </div>
            </form>
          </>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <>
            <div className="mb-6">
              <button
                onClick={() => setStep(1)}
                className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </button>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify OTP</h2>
              <p className="text-gray-600 text-sm">
                We've sent a 6-digit code to <span className="font-medium">{email}</span>
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
                      className={`w-12 h-12 text-center text-xl font-bold border border-gray-300 
                               rounded-lg focus:ring-2 ${themeColors.focusRing} focus:border-transparent 
                               transition-all outline-none`}
                    />
                  ))}
                </div>
              </div>

              {/* Timer */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Time remaining: <span className={`font-medium ${themeColors.textColor}`}>{formatTime(otpTimer)}</span>
                </p>
                {canResendOtp && (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className={`text-sm ${themeColors.textColor} ${themeColors.textHover} font-medium mt-2 transition-colors`}
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={otp.join("").length !== 6}
                className={`w-full px-4 py-3 ${themeColors.buttonGradient} 
                         text-white rounded-lg ${themeColors.buttonHover} 
                         transition-all font-medium shadow-lg hover:shadow-xl
                         disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Verify OTP
              </button>
            </form>
          </>
        )}

        {/* Step 3: Reset Password */}
        {step === 3 && (
          <>
            <div className="mb-6">
              <button
                onClick={() => setStep(2)}
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
                    className={`w-full pl-11 pr-11 py-3 border border-gray-300 rounded-lg focus:ring-2 
                             ${themeColors.focusRing} focus:border-transparent transition-all outline-none`}
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
                    className={`w-full pl-11 pr-11 py-3 border border-gray-300 rounded-lg focus:ring-2 
                             ${themeColors.focusRing} focus:border-transparent transition-all outline-none`}
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
                className={`w-full px-4 py-3 ${themeColors.buttonGradient} 
                         text-white rounded-lg ${themeColors.buttonHover} 
                         transition-all font-medium shadow-lg hover:shadow-xl
                         disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Reset Password
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

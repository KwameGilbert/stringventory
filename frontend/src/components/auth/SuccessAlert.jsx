import { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";

export default function SuccessAlert({ 
  isOpen, 
  title = "Success!", 
  message, 
  onClose,
  autoCloseDelay = 3000 
}) {
  const { themeColors } = useTheme();

  useEffect(() => {
    if (isOpen && autoCloseDelay > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoCloseDelay, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center px-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center animate-scale-in">
        <div className={`w-16 h-16 ${themeColors.selectionBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
          <CheckCircle2 className={`w-10 h-10 ${themeColors.textColor}`} />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <button
          onClick={onClose}
          className={`w-full px-4 py-3 ${themeColors.buttonGradient} 
                   text-white rounded-lg ${themeColors.buttonHover} 
                   transition-all font-medium shadow-lg hover:shadow-xl`}
        >
          Continue to Login
        </button>
      </div>
    </div>
  );
}

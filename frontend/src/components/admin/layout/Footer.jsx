import { useTheme } from "../../../contexts/ThemeContext";

const Footer = () => {
  const { themeColors } = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-4 px-6 ml-64 z-30">
      <div className="flex items-center justify-between text-sm text-gray-600">
        {/* Copyright */}
        <div>
          <p>© {currentYear} StringVentory. All rights reserved.</p>
        </div>

        {/* Developed by StringTech */}
        <div>
          <p>
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
    </footer>
  );
};

export default Footer;

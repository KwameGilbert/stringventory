import { useTheme } from "../../../contexts/ThemeContext";

const Footer = () => {
  const { themeColors } = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 py-6 px-6 mt-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500 text-center sm:text-left">
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

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Menu, X, ChevronDown, School2, Sparkles } from "lucide-react";

export function Header() {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);

      // Track active section
      const sections = [
        "hero-section",
        "features-section",
        "benefits-section",
        "how-it-works-section",
        "contact-section",
      ];
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial state
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest(".mobile-menu-container")) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMenuOpen]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 80;
      const elementPosition = element.offsetTop - headerHeight;

      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
      setIsMenuOpen(false);
    }
  };

  const navigationItems = [
    {
      key: "home",
      id: "hero-section",
      path: "/",
      icon: null,
      highlight: false,
    },
    {
      key: "features",
      id: "features-section",
      path: "/",
      icon: null,
      highlight: false,
    },
    {
      key: "benefits",
      id: "benefits-section",
      path: "/",
      icon: null,
      highlight: false,
    },
    {
      key: "howItWorks",
      id: "how-it-works-section",
      path: "/",
      icon: null,
      highlight: false,
    },
    {
      key: "pricing",
      id: "pricing-section",
      path: "/pricing",
      isPage: true,
      icon: Sparkles,
      highlight: true,
    },
    {
      key: "contact",
      id: "contact-section",
      path: "/",
      icon: null,
      highlight: false,
    },
  ];

  const handleNavigation = (item) => {
    if (item.isPage) {
      setIsMenuOpen(false);
      return;
    }

    if (location.pathname !== "/") {
      window.location.href = `/#${item.id}`;
    } else {
      scrollToSection(item.id);
    }
  };

  const isActive = (item) => {
    if (item.isPage) {
      return location.pathname === item.path;
    }
    return activeSection === item.id;
  };

  const isRTL = i18n.language === "ar";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-xl border-b border-gray-200/30 dark:border-gray-700/30"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Enhanced Logo */}
          <div className="flex-shrink-0 group">
            <Link
              to="/"
              className={`flex items-center transition-all duration-300 group-hover:scale-105 ${
                isRTL ? "space-x-reverse space-x-2" : "space-x-2"
              }`}
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <School2 className="w-6 h-6 text-white" />
                </div>
                {/* Subtle glow effect */}
                <div className="absolute inset-0 w-10 h-10 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                Taalim Flow
              </span>
            </Link>
          </div>

          {/* Enhanced Desktop Navigation */}
          <nav
            className={`hidden lg:flex items-center ${
              isRTL ? "space-x-reverse space-x-2 text-center" : "space-x-2"
            }`}
          >
            {navigationItems.map((item) => {
              const isItemActive = isActive(item);
              const IconComponent = item.icon;

              return item.isPage ? (
                <Link
                  key={item.key}
                  to={item.path}
                  className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 group ${
                    item.highlight
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl hover:scale-105"
                      : isItemActive
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                      : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  }`}
                >
                  <div className="flex items-center space-x-1 space-x-reverse">
                    {IconComponent && <IconComponent className="w-4 h-4" />}
                    <span>{t(`header.${item.key}`)}</span>
                  </div>
                </Link>
              ) : (
                <button
                  key={item.key}
                  onClick={() => handleNavigation(item)}
                  className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    isItemActive
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                      : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  }`}
                >
                  {t(`header.${item.key}`)}
                  {isItemActive && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Enhanced Desktop Controls */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Fixed position controls - always in same order */}
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/20 dark:border-gray-700/20" style={{ direction: 'ltr' }}>
              <ThemeToggle />
              <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
              <LanguageSwitcher />
            </div>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 px-6"
              onClick={() => scrollToSection("contact-section")}
            >
              {t("header.getStarted")}
            </Button>
          </div>

          {/* Enhanced Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2 mobile-menu-container">
            <div className="flex items-center gap-1 p-1.5 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/20 dark:border-gray-700/20" style={{ direction: 'ltr' }}>
              <ThemeToggle />
              <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
              <LanguageSwitcher />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2.5 rounded-xl transition-all duration-300 border border-gray-200/20 dark:border-gray-700/20 ${
                isMenuOpen
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                  : "bg-gray-50/50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700/50 backdrop-blur-sm"
              }`}
            >
              <div className="relative w-5 h-5">
                <Menu
                  className={`absolute inset-0 transition-all duration-300 ${
                    isMenuOpen ? "opacity-0 rotate-90" : "opacity-100 rotate-0"
                  }`}
                />
                <X
                  className={`absolute inset-0 transition-all duration-300 ${
                    isMenuOpen ? "opacity-100 rotate-0" : "opacity-0 rotate-90"
                  }`}
                />
              </div>
            </Button>
          </div>
        </div>

        {/* Enhanced Mobile Navigation */}
        <div
          className={`lg:hidden transition-all duration-500 overflow-hidden ${
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-2 pt-4 pb-6 space-y-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl mt-2 border border-gray-200/20 dark:border-gray-700/20 shadow-xl mobile-menu-container">
            {navigationItems.map((item, index) => {
              const isItemActive = isActive(item);
              const IconComponent = item.icon;

              return item.isPage ? (
                <Link
                  key={item.key}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-left font-medium transition-all duration-300 transform ${
                    item.highlight
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                      : isItemActive
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className={`flex items-center ${
                    isRTL ? "space-x-reverse space-x-3" : "space-x-3"
                  }`}>
                    {IconComponent && (
                      <div
                        className={`p-2 rounded-lg ${
                          item.highlight
                            ? "bg-white/20"
                            : "bg-gray-100 dark:bg-gray-800"
                        }`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>
                    )}
                    <span>{t(`header.${item.key}`)}</span>
                  </div>
                  {item.highlight && (
                    <Sparkles className="w-4 h-4 opacity-70" />
                  )}
                </Link>
              ) : (
                <button
                  key={item.key}
                  onClick={() => handleNavigation(item)}
                  className={`flex items-center w-full px-4 py-3 rounded-xl text-left font-medium transition-all duration-300 transform ${
                    isItemActive
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span>{t(`header.${item.key}`)}</span>
                  {isItemActive && (
                    <div className="ml-auto w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                  )}
                </button>
              );
            })}

            {/* Mobile CTA Button */}
            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                onClick={() => {
                  if (location.pathname !== "/") {
                    window.location.href = "/#contact-section";
                  } else {
                    scrollToSection("contact-section");
                  }
                  setIsMenuOpen(false);
                }}
              >
                {t("header.getStarted")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-[-1]"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </header>
  );
}
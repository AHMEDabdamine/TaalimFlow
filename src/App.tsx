import { RouterProvider } from "react-router-dom";
import "./index.css";
import { router } from "./routes";
import { ThemeProvider } from "@/components/theme-provider";
import "./i18n/index";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const App = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Set default direction and language on app load
    const isRTL = i18n.language === 'ar';
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <div className="min-h-screen">
        <RouterProvider router={router} />
      </div>
    </ThemeProvider>
  );
};

export default App;

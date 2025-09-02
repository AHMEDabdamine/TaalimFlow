import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="w-10 h-10 rounded-full border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        <div className="w-4 h-4" />
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="w-9 h-9 rounded-lg border border-gray-200/50 dark:border-gray-700/50 bg-transparent hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-all duration-200"
      title={theme === "light" ? "تبديل إلى الوضع المظلم" : "تبديل إلى الوضع المضيء"}
      style={{ direction: 'ltr' }}
    >
      {theme === "light" ? (
        <Moon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
      ) : (
        <Sun className="h-4 w-4 text-gray-600 dark:text-gray-300" />
      )}
      <span className="sr-only">تبديل الوضع</span>
    </Button>
  )
}
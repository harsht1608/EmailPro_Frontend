import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/ThemeProvider"
import { Moon, Sun, Mail } from "lucide-react"

interface HeaderProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const Header = ({ activeTab, onTabChange }: HeaderProps) => {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  const tabs = [
    { id: 'verify', label: 'Verify Email' },
    { id: 'send', label: 'Send Email' },
    { id: 'templates', label: 'Templates' },
    { id: 'ai-generator', label: 'AI Generator' },
    { id: 'api-docs', label: 'API Docs' }
  ]

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Mail className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            EmailPro
          </h1>
        </div>

        <nav className="hidden md:flex items-center space-x-1">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              size="sm"
              onClick={() => onTabChange(tab.id)}
              className={activeTab === tab.id ? "shadow-elegant" : ""}
            >
              {tab.label}
            </Button>
          ))}
        </nav>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full"
        >
          {theme === "light" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile Navigation */}
      <nav className="md:hidden px-4 pb-3 border-t">
        <div className="flex flex-wrap gap-2 pt-3">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              size="sm"
              onClick={() => onTabChange(tab.id)}
              className="text-xs"
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </nav>
    </header>
  )
}

export default Header
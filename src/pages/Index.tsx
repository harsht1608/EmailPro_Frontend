import { useState } from "react"
import { ThemeProvider } from "@/components/ThemeProvider"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import EmailVerification from "@/components/EmailVerification"
import SendEmail from "@/components/SendEmail"
import TemplatesBrowser from "@/components/TemplatesBrowser"
import AIGenerator from "@/components/AIGenerator"
import APIDocs from "@/components/APIDocs"

const Index = () => {
  const [activeTab, setActiveTab] = useState('verify')

  const renderContent = () => {
    switch (activeTab) {
      case 'verify':
        return <EmailVerification />
      case 'send':  
        return <SendEmail />
      case 'templates':
        return <TemplatesBrowser />
      case 'ai-generator':
        return <AIGenerator />
      case 'api-docs':
        return <APIDocs />
      default:
        return <EmailVerification />
    }
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="emailpro-theme">
      <div className="min-h-screen bg-gradient-muted">
        <Header activeTab={activeTab} onTabChange={setActiveTab} />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {renderContent()}
          </div>
        </main>

        <Footer />
      </div>
    </ThemeProvider>
  )
}

export default Index;

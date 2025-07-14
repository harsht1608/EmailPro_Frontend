import { ExternalLink, FileText, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-card/50 backdrop-blur-sm mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <h3 className="font-semibold text-primary">EmailPro</h3>
            <p className="text-sm text-muted-foreground">
              Professional email management and generation service with AI-powered content creation.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">Resources</h4>
            <div className="space-y-2">
              <Button variant="ghost" className="h-auto p-0 justify-start text-sm text-muted-foreground hover:text-foreground">
                <FileText className="w-4 h-4 mr-2" />
                API Documentation
              </Button>
              <Button variant="ghost" className="h-auto p-0 justify-start text-sm text-muted-foreground hover:text-foreground">
                <ExternalLink className="w-4 h-4 mr-2" />
                Developer Guide
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">Support</h4>
            <div className="space-y-2">
              <Button variant="ghost" className="h-auto p-0 justify-start text-sm text-muted-foreground hover:text-foreground">
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
              <Button variant="ghost" className="h-auto p-0 justify-start text-sm text-muted-foreground hover:text-foreground">
                <ExternalLink className="w-4 h-4 mr-2" />
                Status Page
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 mt-8 border-t">
          <p className="text-sm text-muted-foreground">
            © {currentYear} EmailPro. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Button variant="ghost" className="h-auto p-0 text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Button>
            <Button variant="ghost" className="h-auto p-0 text-sm text-muted-foreground hover:text-foreground">
              Terms of Service
            </Button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
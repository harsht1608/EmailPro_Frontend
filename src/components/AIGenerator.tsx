import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Sparkles, Copy, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useTemplate } from "@/context/TemplateContext";

interface GeneratedContent {
  subject: string
  message: string
  tone: string
  wordCount: number
}

const AIGenerator = () => {
  const [prompt, setPrompt] = useState('')
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { setSelectedTemplate } = useTemplate();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a prompt to generate email content"
      })
      return
    }

    setLoading(true)
    setGeneratedContent(null)
    try {
      // Call your backend endpoint
      const res = await fetch("/generate-email-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      })
      if (!res.ok) throw new Error("Failed to generate email content")
      const data = await res.json()

      // The backend returns { success: true, generatedContent: { ... } }
      // If your backend returns the Gemini API response directly, adjust accordingly.
      // We'll expect: { subject, message, tone, wordCount }
      let content = data.generatedContent
      // If content is a string, wrap it
      if (typeof content === "string") {
        content = { subject: "AI Generated Email", message: content, tone: "AI", wordCount: content.split(/\s+/).length }
      }
      setGeneratedContent(content)
      toast({
        title: "Content Generated!",
        description: "AI has generated your email content successfully"
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate email content"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUseInEmail = () => {
    if (!generatedContent) return;
    setSelectedTemplate({
      subject: generatedContent.subject,
      message: generatedContent.message,
      source: "ai"
    });
    toast({
      title: "Content Ready",
      description: "Switch to Send Email tab to use this generated content"
    });
  }

  const handleCopy = () => {
    if (!generatedContent) return;
    navigator.clipboard.writeText(generatedContent.message);
    toast({
      title: "Content Copied!",
      description: "Generated body has been copied to clipboard"
    });
  }

  const examplePrompts = [
    "Write a welcome email for new customers signing up for our SaaS platform",
    "Create a follow-up email for leads who downloaded our whitepaper",
    "Draft a product update announcement for existing users",
    "Write a re-engagement email for inactive subscribers",
    "Create a thank you email for recent purchasers"
  ]

  return (
    <div className="space-y-6">
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span>AI Email Content Generator</span>
          </CardTitle>
          <CardDescription>
            Generate professional email content using AI based on your prompt
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Prompt</label>
            <Textarea
              placeholder="Describe the type of email you want to generate..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
            />
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={loading} 
            className="w-full shadow-elegant"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Content...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Email Content
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Example Prompts */}
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="text-lg">Example Prompts</CardTitle>
          <CardDescription>
            Click on any prompt to use it as a starting point
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            {examplePrompts.map((example, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-3 text-left justify-start"
                onClick={() => setPrompt(example)}
              >
                <div className="text-sm">{example}</div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Generated Content */}
      {generatedContent && (
        <Card className="shadow-elegant animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Generated Content</span>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">{generatedContent.tone}</Badge>
                <Badge variant="outline">{generatedContent.wordCount} words</Badge>
              </div>
            </CardTitle>
            <CardDescription>
              AI-generated email content based on your prompt
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject Line</label>
              <div className="p-3 bg-muted rounded-md">
                <div className="font-medium">{generatedContent.subject}</div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email Body</label>
              <Textarea
                value={generatedContent.message}
                readOnly
                rows={15}
                className="font-mono text-sm bg-muted"
              />
            </div>

            <div className="flex space-x-2 pt-4">
              <Button onClick={handleCopy} variant="outline" className="flex-1">
                <Copy className="w-4 h-4 mr-2" />
                Copy Content
              </Button>
              <Button onClick={handleUseInEmail} className="flex-1 shadow-elegant">
                <FileText className="w-4 h-4 mr-2" />
                Use in Email
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default AIGenerator
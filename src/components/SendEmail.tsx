import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, Send, FileText, Plus, X, ExternalLink, Mail } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useTemplate } from "@/context/TemplateContext";

interface EmailTemplateMeta {
  category: string
  filename: string
  path: string
}

interface EmailTemplate {
  template_name: string
  from: { name: string; email: string }
  subject: string
  message: string
  variables: string[]
  category: string
}

const SendEmail = () => {
  const [to, setTo] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [selectedTemplateMeta, setSelectedTemplateMeta] = useState<EmailTemplateMeta | null>(null)
  const [templateVariables, setTemplateVariables] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [gmailUrl, setGmailUrl] = useState<string | null>(null)
  const [templates, setTemplates] = useState<EmailTemplateMeta[]>([])
  const [templateLoading, setTemplateLoading] = useState(false)
  const [sendViaGmail, setSendViaGmail] = useState(false) // <-- NEW STATE
  const { toast } = useToast()
  const { selectedTemplate, setSelectedTemplate } = useTemplate();

  // Fetch template list on mount
  useEffect(() => {
    const fetchTemplates = async () => {
      setTemplateLoading(true)
      try {
        const res = await fetch("/email-templates")
        const data = await res.json()
        // Flatten the template hierarchy into a list
        const metaList: EmailTemplateMeta[] = []
        const walk = (obj: any, category: string, path: string) => {
          if (obj.files) {
            obj.files.forEach((filename: string) => {
              metaList.push({ category, filename, path: `${category}/${filename}` })
            })
          }
          Object.keys(obj).forEach(key => {
            if (key !== "files" && typeof obj[key] === "object") {
              walk(obj[key], `${category}/${key}`, `${category}/${key}`)
            }
          })
        }
        if (data.templates) {
          Object.keys(data.templates).forEach(category => {
            walk(data.templates[category], category, category)
          })
        }
        setTemplates(metaList)
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load templates"
        })
      }
      setTemplateLoading(false)
    }
    fetchTemplates()
    // eslint-disable-next-line
  }, [])

  // Fetch template content and set variables when selected
  useEffect(() => {
    const fetchTemplateContent = async () => {
      if (!selectedTemplateMeta || !selectedTemplateMeta.filename) return;
      setTemplateLoading(true);
      try {
        const res = await fetch(`/email-templates/${selectedTemplateMeta.filename}`);
        if (!res.ok) throw new Error("Template not found");
        const data: EmailTemplate = await res.json();
        setSubject(data.subject);
        setMessage(data.message);
        // Initialize template variables
        const vars: Record<string, string> = {};
        data.variables.forEach(variable => {
          vars[variable] = '';
        });
        setTemplateVariables(vars);
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load template content"
        });
        setSubject('');
        setMessage('');
        setTemplateVariables({});
      }
      setTemplateLoading(false);
    }
    if (selectedTemplateMeta && selectedTemplateMeta.filename) {
      fetchTemplateContent();
    }
    // eslint-disable-next-line
  }, [selectedTemplateMeta])

  useEffect(() => {
    if (selectedTemplate) {
      setSubject(selectedTemplate.subject || "");
      setMessage(selectedTemplate.message || "");
      setSelectedTemplateMeta({
        filename: selectedTemplate.filename || "",
        category: selectedTemplate.source === "ai" ? "Selected from AI Generator" : "Selected from templates",
        path: ""
      });
      setTemplateVariables({});
    }
  }, [selectedTemplate]);

  const handleVariableChange = (variable: string, value: string) => {
    setTemplateVariables(prev => ({
      ...prev,
      [variable]: value
    }))
  }

  const handleSend = async () => {
    if (!to || !subject || !message) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields"
      })
      return
    }

    setLoading(true)
    setGmailUrl(null)
    try {
      // Prepare payload for backend
      let payload: any = {
        to,
        subject,
        text: message
      }

      if (selectedTemplateMeta) {
        payload.template = selectedTemplateMeta.filename
        payload.variables = templateVariables
      }

      if (sendViaGmail) {
        payload.openInGmail = true
      }

      const res = await fetch("/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const err = await res.text()
        throw new Error(err)
      }

      // Check if Gmail URL is returned
      const data = await res.json().catch(() => null)
      if (data && data.gmailUrl) {
        setGmailUrl(data.gmailUrl)
        toast({
          title: "Open in Gmail",
          description: "Click the button below to open Gmail with your email prefilled."
        })
      } else {
        toast({
          title: "Email Sent!",
          description: `Email successfully sent to ${to}`
        })
        // Reset form
        setTo('')
        setSubject('')
        setMessage('')
        setSelectedTemplateMeta(null)
        setTemplateVariables({})
        setSendViaGmail(false)
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to send email"
      })
    } finally {
      setLoading(false)
    }
  }

  const clearTemplate = () => {
    setSelectedTemplateMeta(null)
    setSubject('')
    setMessage('')
    setTemplateVariables({})
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Send className="w-5 h-5 text-primary" />
            <span>Send Email</span>
          </CardTitle>
          <CardDescription>
            Send emails with or without templates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Template Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Email Template (Optional)</label>
            <div className="flex space-x-2">
              <Select
                value={selectedTemplateMeta ? selectedTemplateMeta.filename : 'none'}
                onValueChange={val => {
                  if (val === 'none') clearTemplate()
                  else {
                    const meta = templates.find(t => t.filename === val)
                    if (meta) setSelectedTemplateMeta(meta)
                  }
                }}
                disabled={templateLoading}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder={selectedTemplateMeta?.category === "Selected from AI Generator" ? "Selected from AI Generator" : "Select a template or compose from scratch"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Template</SelectItem>
                  {templates.map((template) => (
                    <SelectItem key={template.filename} value={template.filename}>
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4" />
                        <span>{template.filename}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedTemplateMeta && (
                <Button variant="outline" size="icon" onClick={clearTemplate}>
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Template Variables */}
          {selectedTemplateMeta && Object.keys(templateVariables).length > 0 && (
            <Card className="bg-accent/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Template Variables</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.keys(templateVariables).map((variable) => (
                    <div key={variable} className="space-y-1">
                      <label className="text-xs font-medium flex items-center space-x-1">
                        <Badge variant="outline" className="text-xs">
                          {variable}
                        </Badge>
                      </label>
                      <Input
                        placeholder={`Enter ${variable}`}
                        value={templateVariables[variable]}
                        onChange={(e) => handleVariableChange(variable, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Email Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">To *</label>
              <Input
                type="email"
                placeholder="recipient@example.com"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Subject *</label>
              <Input
                placeholder="Email subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Message *</label>
              <Textarea
                placeholder="Email message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={8}
              />
            </div>

            {/* Send via Gmail toggle */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="sendViaGmail"
                checked={sendViaGmail}
                onChange={e => setSendViaGmail(e.target.checked)}
                className="accent-primary"
              />
              <label htmlFor="sendViaGmail" className="text-sm flex items-center space-x-1 cursor-pointer">
                <Mail className="w-4 h-4" />
                <span>Send via Gmail (prefilled compose)</span>
              </label>
            </div>

            <Button 
              onClick={handleSend} 
              disabled={loading} 
              className="w-full shadow-elegant"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Email
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Show Gmail URL if returned */}
      {gmailUrl && (
        <div className="flex justify-center mt-4">
          <a
            href={gmailUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded shadow hover:bg-primary/90 transition"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Open in Gmail
          </a>
        </div>
      )}
    </div>
  )
}

export default SendEmail
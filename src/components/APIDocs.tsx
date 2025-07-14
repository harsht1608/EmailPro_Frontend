import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, Copy, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface APIEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  endpoint: string
  description: string
  parameters?: Array<{
    name: string
    type: string
    required: boolean
    description: string
  }>
  requestBody?: {
    example: string
    schema: string
  }
  response: {
    example: string
    schema: string
  }
}

const APIDocs = () => {
  const { toast } = useToast()

  const endpoints: APIEndpoint[] = [
    {
      method: 'GET',
      endpoint: '/verify-email/:email',
      description: 'Verify the validity and deliverability of an email address',
      parameters: [
        {
          name: 'email',
          type: 'string',
          required: true,
          description: 'The email address to verify'
        }
      ],
      response: {
        example: `{
  "email": "user@example.com",
  "is_valid": true,
  "score": 85,
  "is_disposable": false,
  "is_webmail": true,
  "smtp_check": true,
  "mx_records": true,
  "safe_to_send": true
}`,
        schema: 'VerificationResult'
      }
    },
    {
      method: 'POST',
      endpoint: '/send-email',
      description: 'Send an email with or without a template',
      requestBody: {
        example: `{
  "to": "recipient@example.com",
  "subject": "Hello World",
  "message": "This is a test email",
  "template": "welcome.html",
  "variables": {
    "first_name": "John",
    "company_name": "Acme Corp"
  }
}`,
        schema: 'SendEmailRequest'
      },
      response: {
        example: `{
  "success": true,
  "message": "Email sent successfully",
  "message_id": "msg_123456789"
}`,
        schema: 'SendEmailResponse'
      }
    },
    {
      method: 'GET',
      endpoint: '/email-templates',
      description: 'Get the hierarchical structure of email templates',
      response: {
        example: `{
  "folders": [
    {
      "name": "Marketing",
      "files": ["welcome.html", "newsletter.html"]
    },
    {
      "name": "Transactional",
      "files": ["password-reset.html", "order-confirmation.html"]
    }
  ]
}`,
        schema: 'TemplateHierarchy'
      }
    },
    {
      method: 'GET',
      endpoint: '/email-templates/:filename',
      description: 'Get the content of a specific email template',
      parameters: [
        {
          name: 'filename',
          type: 'string',
          required: true,
          description: 'The template filename'
        }
      ],
      response: {
        example: `{
  "filename": "welcome.html",
  "subject": "Welcome to {{company_name}}!",
  "message": "Hello {{first_name}}, welcome to our platform!",
  "variables": ["first_name", "company_name"]
}`,
        schema: 'TemplateContent'
      }
    },
    {
      method: 'POST',
      endpoint: '/generate-email-content',
      description: 'Generate AI-powered email content based on a prompt',
      requestBody: {
        example: `{
  "prompt": "Write a welcome email for new SaaS customers",
  "tone": "professional",
  "length": "medium"
}`,
        schema: 'GenerateContentRequest'
      },
      response: {
        example: `{
  "subject": "Welcome to Our Platform!",
  "message": "Dear valued customer, we're excited to have you...",
  "tone": "professional",
  "word_count": 156
}`,
        schema: 'GeneratedContent'
      }
    }
  ]

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast({
      title: "Code Copied!",
      description: "Code snippet has been copied to clipboard"
    })
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return 'bg-blue-500'
      case 'POST':
        return 'bg-green-500'
      case 'PUT':
        return 'bg-yellow-500'
      case 'DELETE':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Code className="w-5 h-5 text-primary" />
            <span>API Documentation</span>
          </CardTitle>
          <CardDescription>
            Complete API reference for the Email & Message Generation Service
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 mb-6">
            <h3 className="text-lg font-semibold">Base URL</h3>
            <div className="flex items-center space-x-2">
              <code className="px-2 py-1 bg-muted rounded text-sm">
                https://api.emailpro.com/v1
              </code>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => copyCode('https://api.emailpro.com/v1')}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <h3 className="text-lg font-semibold">Authentication</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Include your API key in the Authorization header:
            </p>
            <div className="flex items-center space-x-2">
              <code className="px-2 py-1 bg-muted rounded text-sm">
                Authorization: Bearer YOUR_API_KEY
              </code>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => copyCode('Authorization: Bearer YOUR_API_KEY')}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Code className="w-5 h-5 text-primary" />
            <span>Google Gemini API Setup</span>
          </CardTitle>
          <CardDescription>
            Quick steps to get your free Gemini API key and start using AI features.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2 list-decimal list-inside text-base">
            <li>
              Go to <a href="https://aistudio.google.com/prompts/new_chat" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline">Google AI Studio</a>
            </li>
            <li>
              Click <span className="font-semibold">Get API key</span> at the top.
            </li>
            <li>
              Click <span className="font-semibold">Create API key</span> and authenticate with your Google account.
            </li>
            <li>
              Copy your API key and use it in your backend or with the example below.
            </li>
          </ol>
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Quick Start Example</h4>
            <pre className="p-3 bg-muted rounded-md text-sm overflow-x-auto">
              <code>
{`curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent" \\
  -H 'Content-Type: application/json' \\
  -H 'X-goog-api-key: GEMINI_API_KEY' \\
  -X POST \\
  -d '{
    "contents": [
      {
        "parts": [
          {
            "text": "Explain how AI works in a few words"
          }
        ]
      }
    ]
  }'`}
              </code>
            </pre>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {endpoints.map((endpoint, index) => (
          <Card key={index} className="shadow-elegant">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-3">
                  <Badge className={`${getMethodColor(endpoint.method)} text-white`}>
                    {endpoint.method}
                  </Badge>
                  <code className="text-lg">{endpoint.endpoint}</code>
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                >
                  <a
                    href={`https://web.postman.co/workspace/My-Workspace/request/create?requestUrl=${encodeURIComponent('https://api.emailpro.com/v1' + endpoint.endpoint)}&requestMethod=${endpoint.method}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open in Postman"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </div>
              <CardDescription>{endpoint.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="parameters">Parameters</TabsTrigger>
                  <TabsTrigger value="request">Request</TabsTrigger>
                  <TabsTrigger value="response">Response</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                  </div>
                </TabsContent>

                <TabsContent value="parameters" className="space-y-4">
                  {endpoint.parameters ? (
                    <div className="space-y-3">
                      {endpoint.parameters.map((param, paramIndex) => (
                        <div key={paramIndex} className="p-3 border rounded-md space-y-1">
                          <div className="flex items-center space-x-2">
                            <code className="font-semibold">{param.name}</code>
                            <Badge variant="outline">{param.type}</Badge>
                            {param.required && (
                              <Badge variant="destructive" className="text-xs">Required</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{param.description}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No parameters required</p>
                  )}
                </TabsContent>

                <TabsContent value="request" className="space-y-4">
                  {endpoint.requestBody ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">Request Body</h4>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => copyCode(endpoint.requestBody!.example)}
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                      <pre className="p-3 bg-muted rounded-md text-sm overflow-x-auto">
                        <code>{endpoint.requestBody.example}</code>
                      </pre>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No request body required</p>
                  )}
                </TabsContent>

                <TabsContent value="response" className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Response</h4>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => copyCode(endpoint.response.example)}
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </Button>
                    </div>
                    <pre className="p-3 bg-muted rounded-md text-sm overflow-x-auto">
                      <code>{endpoint.response.example}</code>
                    </pre>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default APIDocs
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface VerificationResult {
  email: string
  is_valid: boolean
  score: number
  is_disposable: boolean
  is_webmail: boolean
  smtp_check: boolean
  mx_records: boolean
  safe_to_send: boolean
}

const EmailVerification = () => {
  const [email, setEmail] = useState('')
  const [result, setResult] = useState<VerificationResult | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleVerify = async () => {
    if (!email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter an email address"
      })
      return
    }

    setLoading(true)
    try {
      // Call your backend endpoint!
      const res = await fetch(`/verify-email/${encodeURIComponent(email)}`)
      if (!res.ok) throw new Error("Failed to verify email")
      const data = await res.json()

      // Map backend response to frontend state
      const mappedResult: VerificationResult = {
        email,
        is_valid: data.isValid,
        score: data.score,
        is_disposable: data.details.disposable,
        is_webmail: data.details.webmail,
        smtp_check: data.details.smtp_check,
        mx_records: data.details.mx_records,
        safe_to_send: data.safe_to_send
      }

      setResult(mappedResult)
      toast({
        title: "Verification Complete",
        description: `Email ${mappedResult.is_valid ? 'is valid' : 'is invalid'}`
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to verify email address"
      })
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-success'
    if (score >= 60) return 'bg-warning'
    return 'bg-destructive'
  }

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="w-4 h-4 text-success" />
    ) : (
      <XCircle className="w-4 h-4 text-destructive" />
    )
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-primary" />
            <span>Email Verification</span>
          </CardTitle>
          <CardDescription>
            Verify email addresses to check validity, deliverability, and safety
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              type="email"
              placeholder="Enter email address to verify"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
              className="flex-1"
            />
            <Button onClick={handleVerify} disabled={loading} className="shadow-elegant">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card className="shadow-elegant animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Verification Results</span>
              <Badge variant={result.is_valid ? "default" : "destructive"}>
                {result.is_valid ? 'Valid' : 'Invalid'}
              </Badge>
            </CardTitle>
            <CardDescription>Results for: {result.email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Quality Score</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-12 h-2 rounded-full ${getScoreColor(result.score)}`} />
                    <span className="text-sm">{result.score}%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">SMTP Check</span>
                  {getStatusIcon(result.smtp_check)}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">MX Records</span>
                  {getStatusIcon(result.mx_records)}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Safe to Send</span>
                  {getStatusIcon(result.safe_to_send)}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Webmail</span>
                  <Badge variant={result.is_webmail ? "secondary" : "outline"}>
                    {result.is_webmail ? 'Yes' : 'No'}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Disposable</span>
                  <Badge variant={result.is_disposable ? "destructive" : "secondary"}>
                    {result.is_disposable ? 'Yes' : 'No'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default EmailVerification
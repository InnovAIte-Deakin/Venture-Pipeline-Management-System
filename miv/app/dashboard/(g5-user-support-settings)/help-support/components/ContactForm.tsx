"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, CheckCircle2 } from "lucide-react"
import { useContactForm } from "../hooks/useContactForm"

export default function ContactForm() {
  const {
    name, email, subject, message, submitted, errors,
    setSubject, setSubmitted,
    handleNameChange, handleEmailChange, handleMessageChange, handleSubmit,
  } = useContactForm()

  if (submitted) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center text-center py-12 space-y-2">
          <CheckCircle2 className="h-12 w-12 text-green-600" />
          <p className="font-semibold text-lg">Request submitted</p>
          <p className="text-sm text-muted-foreground max-w-xs">
            Thanks for reaching out. Our support team will get back to you within 1-2 business days.
          </p>
          <Button variant="outline" size="sm" onClick={() => setSubmitted(false)} className="mt-2">
            Back to Contact Support
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Support</CardTitle>
        <p className="text-sm text-muted-foreground">
          Submit a request and our team will get back to you.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-4 w-4" />
          <span>support@mivplatform.com</span>
        </div>

        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="Your name"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && (
            <p id="name-error" className="text-sm text-red-600 mt-1">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p id="email-error" className="text-sm text-red-600 mt-1">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            placeholder="e.g. Cannot access dashboard"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            placeholder="Describe your issue in detail..."
            rows={4}
            value={message}
            onChange={(e) => handleMessageChange(e.target.value)}
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? "message-error" : undefined}
          />
          {errors.message && (
            <p id="message-error" className="text-sm text-red-600 mt-1">
              {errors.message}
            </p>
          )}
        </div>

        <Button className="w-full" onClick={handleSubmit}>
          Submit Request
        </Button>
      </CardContent>
    </Card>
  )
}
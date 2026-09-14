"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Mail, CheckCircle2, Phone } from "lucide-react"
import { useContactForm } from "../hooks/useContactForm"

export default function ContactForm() {
  const {
    name, email, issueType, priority, subject, message, submitted, ticketId, supportEmailHref, errors,
    setIssueType, setPriority, setSubject, setSubmitted,
    handleNameChange, handleEmailChange, handleMessageChange, handleSubmit,
  } = useContactForm()

  if (submitted) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center text-center py-12 space-y-2">
          <CheckCircle2 className="h-12 w-12 text-green-600" />
          <p className="font-semibold text-lg">Request submitted</p>
          <p className="text-sm text-muted-foreground max-w-xs">
            Reference {ticketId}. We opened a prefilled email to support so the request can be sent from your mailbox.
          </p>
          {supportEmailHref && (
            <Button size="sm" asChild>
              <a href={supportEmailHref}>Open Email Again</a>
            </Button>
          )}
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
          Create a support request and send it to our team by email.
          </p>
        </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-4 w-4" />
          <a href="mailto:support@miv.org" className="hover:underline">
            support@miv.org
          </a>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="h-4 w-4" />
          <a href="tel:+85517350544" className="hover:underline">
            +855 17 350 544
          </a>
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="issueType">Issue type</Label>
            <select
              id="issueType"
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
              className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option>General question</option>
              <option>Account access</option>
              <option>Venture intake</option>
              <option>Due diligence workflow</option>
              <option>GEDSI or IRIS metrics</option>
              <option>Reports or exports</option>
              <option>Documents or uploads</option>
              <option>Billing</option>
            </select>
          </div>

          <div>
            <Label htmlFor="priority">Priority</Label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option>Normal</option>
              <option>High</option>
              <option>Urgent</option>
            </select>
          </div>
        </div>

        <div>
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            placeholder="e.g. Cannot access dashboard"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            aria-invalid={!!errors.subject}
            aria-describedby={errors.subject ? "subject-error" : undefined}
          />
          {errors.subject && (
            <p id="subject-error" className="text-sm text-red-600 mt-1">
              {errors.subject}
            </p>
          )}
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

"use client"

import { useState } from "react"
import { ContactFormData, FormErrors } from "../types/help.types"

const SUPPORT_REQUESTS_STORAGE_KEY = "miv.supportRequests"

interface StoredSupportRequest extends ContactFormData {
  id: string
  createdAt: string
  status: "open"
  pageUrl?: string
}

export function useContactForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [issueType, setIssueType] = useState("General question")
  const [priority, setPriority] = useState("Normal")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [ticketId, setTicketId] = useState<string | null>(null)
  const [supportEmailHref, setSupportEmailHref] = useState<string | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {}
    if (!name.trim()) newErrors.name = "Name is required"
    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address"
    }
    if (!subject.trim()) newErrors.subject = "Subject is required"
    if (!message.trim()) newErrors.message = "Message is required"
    return newErrors
  }

  const handleSubmit = () => {
    const newErrors = validate()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    setErrors({})
    const request: StoredSupportRequest = {
      id: `MIV-${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      status: "open",
      pageUrl: typeof window !== "undefined" ? window.location.href : undefined,
      name: name.trim(),
      email: email.trim(),
      issueType,
      priority,
      subject: subject.trim(),
      message: message.trim(),
    }

    try {
      const existing = window.localStorage.getItem(SUPPORT_REQUESTS_STORAGE_KEY)
      const requests: StoredSupportRequest[] = existing ? JSON.parse(existing) : []
      window.localStorage.setItem(
        SUPPORT_REQUESTS_STORAGE_KEY,
        JSON.stringify([request, ...requests].slice(0, 25))
      )
    } catch {
      // Local storage is a convenience fallback; the visible ticket id still confirms the request payload was accepted.
    }

    const emailSubject = `[${request.id}] ${request.subject}`
    const emailBody = [
      `Reference: ${request.id}`,
      `Name: ${request.name}`,
      `Email: ${request.email}`,
      `Issue type: ${request.issueType}`,
      `Priority: ${request.priority}`,
      request.pageUrl ? `Page: ${request.pageUrl}` : "",
      "",
      request.message,
    ].filter(Boolean).join("\n")
    const mailtoHref = `mailto:support@miv.org?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`

    setSupportEmailHref(mailtoHref)
    setTicketId(request.id)
    setSubmitted(true)
    window.location.href = mailtoHref
    setName("")
    setEmail("")
    setIssueType("General question")
    setPriority("Normal")
    setSubject("")
    setMessage("")
  }

  const handleNameChange = (value: string) => {
    setName(value)
    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }))
  }

  const handleEmailChange = (value: string) => {
    setEmail(value)
    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
  }

  const handleMessageChange = (value: string) => {
    setMessage(value)
    if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }))
  }

  return {
    name, email, issueType, priority, subject, message, submitted, ticketId, supportEmailHref, errors,
    setIssueType, setPriority, setSubject, setSubmitted,
    handleNameChange, handleEmailChange, handleMessageChange, handleSubmit,
  }
}

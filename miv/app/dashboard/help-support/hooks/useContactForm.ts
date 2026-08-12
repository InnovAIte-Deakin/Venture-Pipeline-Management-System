"use client"

import { useState } from "react"
import { FormErrors } from "../types/help.types"

export function useContactForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {}
    if (!name.trim()) newErrors.name = "Name is required"
    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email address"
    }
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
    setSubmitted(true)
    setName("")
    setEmail("")
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
    name, email, subject, message, submitted, errors,
    setSubject, setSubmitted,
    handleNameChange, handleEmailChange, handleMessageChange, handleSubmit,
  }
}
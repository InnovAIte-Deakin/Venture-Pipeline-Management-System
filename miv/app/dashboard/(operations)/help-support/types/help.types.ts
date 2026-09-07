export interface FormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
}

export interface ContactFormData {
  name: string
  email: string
  issueType: string
  priority: string
  subject: string
  message: string
}

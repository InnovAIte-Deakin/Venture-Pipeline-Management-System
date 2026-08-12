import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"

export default function HelpHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
        <p className="text-muted-foreground">
          Get help with using the MIV Platform and find answers to common questions
        </p>
      </div>
      <Button>
        <Mail className="mr-2 h-4 w-4" />
        Contact Support
      </Button>
    </div>
  )
}
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import HelpHeader from "../components/HelpHeader"
import HelpSearchBar from "../components/HelpSearchBar"
import QuickActionsGrid from "../components/QuickActionsGrid"
import FaqSection from "../components/FaqSection"
import TutorialsSection from "../components/TutorialsSection"
import ContactForm from "../components/ContactForm"

type ActiveSection = "faq" | "tutorials" | "contact"

export default function HelpSupportMobileScreen() {
  const [activeSection, setActiveSection] = useState<ActiveSection>("faq")

  return (
    <div className="space-y-4 px-4">
      <HelpHeader />
      <HelpSearchBar />
      <QuickActionsGrid />

      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button
          size="sm"
          variant={activeSection === "faq" ? "default" : "outline"}
          onClick={() => setActiveSection("faq")}
        >
          FAQ
        </Button>
        <Button
          size="sm"
          variant={activeSection === "tutorials" ? "default" : "outline"}
          onClick={() => setActiveSection("tutorials")}
        >
          Tutorials
        </Button>
        <Button
          size="sm"
          variant={activeSection === "contact" ? "default" : "outline"}
          onClick={() => setActiveSection("contact")}
        >
          Contact
        </Button>
      </div>

      <div className="space-y-4">
        {activeSection === "faq" && <FaqSection />}
        {activeSection === "tutorials" && <TutorialsSection />}
        {activeSection === "contact" && <ContactForm />}
      </div>
    </div>
  )
}
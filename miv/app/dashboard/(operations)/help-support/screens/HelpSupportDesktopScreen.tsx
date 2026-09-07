"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import HelpHeader from "../components/HelpHeader"
import HelpSearchBar from "../components/HelpSearchBar"
import QuickActionsGrid from "../components/QuickActionsGrid"
import FaqSection from "../components/FaqSection"
import TutorialsSection from "../components/TutorialsSection"
import ContactForm from "../components/ContactForm"

type ActiveSection = "faq" | "tutorials" | "contact"

export default function HelpSupportDesktopScreen() {
  const [search, setSearch] = useState("")
  const [activeSection, setActiveSection] = useState<ActiveSection>("faq")

  return (
    <div className="space-y-6">
      <HelpHeader onContactSupport={() => setActiveSection("contact")} />
      <HelpSearchBar value={search} onChange={setSearch} />
      <QuickActionsGrid
        onOpenFaq={() => setActiveSection("faq")}
        onOpenTutorials={() => setActiveSection("tutorials")}
        onOpenContact={() => setActiveSection("contact")}
      />

      <Tabs value={activeSection} onValueChange={(value) => setActiveSection(value as ActiveSection)} className="space-y-4">
        <TabsList>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="space-y-4">
          <FaqSection searchValue={search} />
        </TabsContent>

        <TabsContent value="tutorials" className="space-y-4">
          <TutorialsSection searchValue={search} />
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <ContactForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}

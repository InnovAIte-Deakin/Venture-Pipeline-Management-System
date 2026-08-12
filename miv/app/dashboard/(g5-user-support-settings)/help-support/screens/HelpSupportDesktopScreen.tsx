"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import HelpHeader from "../components/HelpHeader"
import HelpSearchBar from "../components/HelpSearchBar"
import QuickActionsGrid from "../components/QuickActionsGrid"
import FaqSection from "../components/FaqSection"
import TutorialsSection from "../components/TutorialsSection"
import ContactForm from "../components/ContactForm"

export default function HelpSupportDesktopScreen() {
  return (
    <div className="space-y-6">
      <HelpHeader />
      <HelpSearchBar />
      <QuickActionsGrid />

      <Tabs defaultValue="faq" className="space-y-4">
        <TabsList>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="space-y-4">
          <FaqSection />
        </TabsContent>

        <TabsContent value="tutorials" className="space-y-4">
          <TutorialsSection />
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <ContactForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}
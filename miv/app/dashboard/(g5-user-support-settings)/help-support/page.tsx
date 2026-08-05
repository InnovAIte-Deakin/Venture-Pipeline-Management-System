"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  HelpCircle, 
  MessageCircle, 
  BookOpen, 
  Video, 
  Mail, 
  Phone,
  Search,
  FileText,
  PlayCircle,
  ExternalLink
} from "lucide-react"

export default function HelpSupportPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search help articles, tutorials, and FAQs..."
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Documentation</h3>
                <p className="text-sm text-muted-foreground">User guides & manuals</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Video className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Video Tutorials</h3>
                <p className="text-sm text-muted-foreground">Step-by-step guides</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MessageCircle className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">Live Chat</h3>
                <p className="text-sm text-muted-foreground">Get instant help</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Phone className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold">Phone Support</h3>
                <p className="text-sm text-muted-foreground">Call us directly</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="faq" className="space-y-4">
        <TabsList>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Find answers to the most common questions about the MIV Platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h3 className="font-semibold mb-2">How do I add a new venture to the platform?</h3>
                  <p className="text-muted-foreground">
                    Navigate to the Venture Intake section and fill out the comprehensive form. 
                    The platform will automatically analyze the venture and provide insights.
                  </p>
                </div>
                
                <div className="border-b pb-4">
                  <h3 className="font-semibold mb-2">What are GEDSI metrics and how are they calculated?</h3>
                  <p className="text-muted-foreground">
                    GEDSI (Gender, Equality, Disability, and Social Inclusion) metrics are 
                    automatically calculated based on venture data and IRIS+ standards.
                  </p>
                </div>
                
                <div className="border-b pb-4">
                  <h3 className="font-semibold mb-2">How can I export reports and data?</h3>
                  <p className="text-muted-foreground">
                    Use the export functionality in any dashboard section to download 
                    reports in PDF, Excel, or CSV formats.
                  </p>
                </div>
                
                <div className="border-b pb-4">
                  <h3 className="font-semibold mb-2">Is my data secure and compliant?</h3>
                  <p className="text-muted-foreground">
                    Yes, the platform follows enterprise-grade security standards and 
                    is compliant with GDPR, SOC 2, and other relevant regulations.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tutorials" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Video Tutorials</CardTitle>
              <CardDescription>
                Learn how to use the MIV Platform effectively with our video guides
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <PlayCircle className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold">Getting Started</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Learn the basics of navigating the platform and setting up your account
                  </p>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Watch Video
                  </Button>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <PlayCircle className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold">Venture Intake Process</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Step-by-step guide to adding and analyzing new ventures
                  </p>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Watch Video
                  </Button>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <PlayCircle className="h-5 w-5 text-purple-600" />
                    <h3 className="font-semibold">GEDSI Tracking</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Understanding and managing GEDSI metrics and impact measurement
                  </p>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Watch Video
                  </Button>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <PlayCircle className="h-5 w-5 text-orange-600" />
                    <h3 className="font-semibold">Advanced Analytics</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Using advanced features and generating comprehensive reports
                  </p>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Watch Video
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>
                Get in touch with our support team for personalized assistance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>support@mivplatform.com</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>+1 (555) 123-4567</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MessageCircle className="h-4 w-4 text-muted-foreground" />
                      <span>Live Chat Available 24/7</span>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <h4 className="font-semibold mb-2">Support Hours</h4>
                    <p className="text-sm text-muted-foreground">
                      Monday - Friday: 9:00 AM - 6:00 PM EST<br />
                      Saturday: 10:00 AM - 4:00 PM EST<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold">Send us a Message</h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" placeholder="Your name" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="your.email@example.com" />
                    </div>
                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input id="subject" placeholder="What can we help you with?" />
                    </div>
                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea 
                        id="message" 
                        placeholder="Describe your issue or question..."
                        rows={4}
                      />
                    </div>
                    <Button className="w-full">Send Message</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 
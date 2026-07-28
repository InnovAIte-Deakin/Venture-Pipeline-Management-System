"use client"

import { VentureIntakeForm } from "@/components/venture-intake-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { 
  Lightbulb, 
  CheckCircle2, 
  FileText, 
  Users, 
  Target, 
  Globe, 
  Shield, 
  Clock,
  TrendingUp,
  Heart,
  BookOpen,
  Phone
} from 'lucide-react'

export default function VentureIntakePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Venture Intake
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Submit your venture application for MIV support and investment readiness assessment.
          </p>
        </div>
        
        <VentureIntakeForm />
        
        {/* Guidelines and Tips Section */}
        <div className="mt-12 space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Guidelines & Tips for Success
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Maximize your venture's potential with these expert recommendations
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Step-by-Step Tips */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    <span>Step-by-Step Tips</span>
                  </CardTitle>
                  <CardDescription>
                    Best practices for each section of the intake form
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <Badge variant="outline" className="mt-0.5">1</Badge>
                      <div>
                        <h4 className="font-medium text-sm">Basic Information</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Use a clear, memorable venture name. Be specific about your sector and location to help us understand your market context.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Badge variant="outline" className="mt-0.5">2</Badge>
                      <div>
                        <h4 className="font-medium text-sm">Team & Foundation</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Highlight diverse leadership. Your pitch summary should be compelling but concise—focus on the problem you solve and your unique approach.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Badge variant="outline" className="mt-0.5">3</Badge>
                      <div>
                        <h4 className="font-medium text-sm">Market & Business</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Define your target market with specificity. Explain your revenue model clearly and be honest about challenges—this shows self-awareness.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Badge variant="outline" className="mt-0.5">4</Badge>
                      <div>
                        <h4 className="font-medium text-sm">Readiness Assessment</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Be honest about your current state. Having gaps is normal—we're here to help you bridge them.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Badge variant="outline" className="mt-0.5">5</Badge>
                      <div>
                        <h4 className="font-medium text-sm">Accessibility & DLI</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          The Washington Group questions help us design inclusive support. Answer honestly to ensure we can provide appropriate assistance.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Badge variant="outline" className="mt-0.5">6</Badge>
                      <div>
                        <h4 className="font-medium text-sm">GEDSI Goals</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Select goals that genuinely align with your venture's mission. Our AI will suggest additional relevant metrics based on your profile.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Common Mistakes to Avoid */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-red-500" />
                    <span>Common Mistakes to Avoid</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">Don't oversell or exaggerate your current state—honesty builds trust</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">Avoid vague descriptions—be specific about your target market and value proposition</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">Don't skip the inclusion focus—this is central to MIV's mission</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">Don't select GEDSI goals just to impress—choose ones you're committed to achieving</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Resources and Support */}
            <div className="space-y-6">
              {/* What Happens Next */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <span>What Happens Next?</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-1">
                        <span className="block w-2 h-2 bg-blue-500 rounded-full"></span>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Immediate AI Analysis</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Our AI system will analyze your venture and provide readiness scores and GEDSI alignment metrics.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-1">
                        <span className="block w-2 h-2 bg-blue-500 rounded-full"></span>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Expert Review (2-3 days)</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Our investment team will review your application and provide personalized feedback and recommendations.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-1">
                        <span className="block w-2 h-2 bg-blue-500 rounded-full"></span>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Initial Meeting (1 week)</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          We'll schedule a call to discuss your venture, answer questions, and outline potential support pathways.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Key Success Factors */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <span>Key Success Factors</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Heart className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Strong commitment to inclusion and social impact</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Diverse and capable founding team</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Target className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Clear value proposition and market opportunity</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Scalable business model with impact potential</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Helpful Resources */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-purple-500" />
                    <span>Helpful Resources</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <FileText className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">IRIS+ Metrics Catalog</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Learn about impact measurement standards</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <FileText className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">2X Criteria Guidelines</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Gender lens investing framework</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <FileText className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">Washington Group Questions</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Disability inclusion assessment tool</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <FileText className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">Investment Readiness Checklist</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Prepare for funding conversations</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Support */}
          <Alert>
            <Phone className="h-4 w-4" />
            <AlertDescription>
              <strong>Need Help?</strong> Our team is here to support you through the application process. 
              Contact us at <a href="mailto:support@miv.org" className="text-blue-600 hover:underline">support@miv.org</a> or 
              schedule a consultation call if you have questions about any section of the form.
            </AlertDescription>
          </Alert>

          {/* Data Privacy Notice */}
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              🔒 Your data is secure and confidential. We follow GDPR and SOC 2 standards for data protection. 
              Information submitted will only be used for assessment and support purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

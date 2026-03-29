"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Users, 
  Building2, 
  BarChart3, 
  Bell, 
  Mail, 
  Activity, 
  BookOpen,
  CheckCircle,
  XCircle,
  Loader2,
  Play,
  Database,
  TestTube
} from "lucide-react"

interface TestResult {
  test: string
  status: 'pending' | 'running' | 'success' | 'error'
  message?: string
  data?: any
}

export default function ComprehensiveTestPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [seedData, setSeedData] = useState<any>(null)

  const runTest = async (testName: string, testFunction: () => Promise<any>) => {
    setTestResults(prev => [...prev, { test: testName, status: 'running' }])
    
    try {
      const result = await testFunction()
      setTestResults(prev => 
        prev.map(t => 
          t.test === testName 
            ? { ...t, status: 'success', message: 'Success', data: result }
            : t
        )
      )
      return result
    } catch (error) {
      setTestResults(prev => 
        prev.map(t => 
          t.test === testName 
            ? { ...t, status: 'error', message: error.message }
            : t
        )
      )
      throw error
    }
  }

  const seedComprehensiveData = async () => {
    setIsLoading(true)
    setTestResults([])
    
    try {
      const result = await runTest('Seed Comprehensive Data', async () => {
        const response = await fetch('/api/seed-comprehensive-data', { method: 'POST' })
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Failed to seed data')
        return data
      })
      
      setSeedData(result.data)
      
      // Run all subsequent tests
      await runAllTests()
      
    } catch (error) {
      console.error('Error seeding data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const runAllTests = async () => {
    // Test API endpoints
    await runTest('Test Ventures API', async () => {
      const response = await fetch('/api/ventures')
      const data = await response.json()
      if (!response.ok) throw new Error('Failed to fetch ventures')
      return data
    })

    await runTest('Test GEDSI Metrics API', async () => {
      const response = await fetch('/api/gedsi-metrics')
      const data = await response.json()
      if (!response.ok) throw new Error('Failed to fetch GEDSI metrics')
      return data
    })

    await runTest('Test IRIS Metrics API', async () => {
      const response = await fetch('/api/iris/metrics')
      const data = await response.json()
      if (!response.ok) throw new Error('Failed to fetch IRIS metrics')
      return data
    })

    await runTest('Test Notifications API', async () => {
      const response = await fetch('/api/notifications')
      const data = await response.json()
      if (!response.ok) throw new Error('Failed to fetch notifications')
      return data
    })

    await runTest('Test Email Logs API', async () => {
      const response = await fetch('/api/emails/logs')
      const data = await response.json()
      if (!response.ok) throw new Error('Failed to fetch email logs')
      return data
    })

    await runTest('Test Weekly Update Email', async () => {
      const response = await fetch('/api/emails/weekly-update', { method: 'POST' })
      const data = await response.json()
      if (!response.ok) throw new Error('Failed to send weekly update email')
      return data
    })

    await runTest('Test STG Reminder Email', async () => {
      const response = await fetch('/api/emails/stg-reminder', { method: 'POST' })
      const data = await response.json()
      if (!response.ok) throw new Error('Failed to send STG reminder email')
      return data
    })

    await runTest('Test Sprint 2 Integration', async () => {
      const response = await fetch('/api/test-sprint2', { method: 'POST' })
      const data = await response.json()
      if (!response.ok) throw new Error('Failed to test Sprint 2 integration')
      return data
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />
      case 'running': return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
      default: return <div className="h-4 w-4 rounded-full bg-gray-300" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800'
      case 'error': return 'bg-red-100 text-red-800'
      case 'running': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <TestTube className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900">Comprehensive Test Suite</h1>
          </div>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Test every single function of the MIV platform with comprehensive sample data. 
            This will create test users, ventures, GEDSI metrics, notifications, and more.
          </p>
        </div>

        {/* Seed Data Button */}
        <Card className="border-2 border-dashed border-blue-300">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              <Database className="h-5 w-5" />
              <span>Comprehensive Data Seeding</span>
            </CardTitle>
            <CardDescription>
              Create comprehensive test data including users, ventures, GEDSI metrics, notifications, and more
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button 
              onClick={seedComprehensiveData}
              disabled={isLoading}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating Test Data...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-5 w-5" />
                  Seed Comprehensive Data
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Seed Data Results */}
        {seedData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Data Seeding Results</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-900">{seedData.users}</div>
                  <div className="text-sm text-blue-700">Test Users</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Building2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-900">{seedData.ventures}</div>
                  <div className="text-sm text-green-700">Ventures</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <BookOpen className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-900">{seedData.irisMetrics}</div>
                  <div className="text-sm text-purple-700">IRIS Metrics</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <Bell className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-yellow-900">{seedData.notifications}</div>
                  <div className="text-sm text-yellow-700">Notifications</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Mail className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-orange-900">{seedData.emailLogs}</div>
                  <div className="text-sm text-orange-700">Email Logs</div>
                </div>
                <div className="text-center p-4 bg-pink-50 rounded-lg">
                  <Activity className="h-8 w-8 text-pink-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-pink-900">{seedData.activities}</div>
                  <div className="text-sm text-pink-700">Activities</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Test Results */}
        {testResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Test Results</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All Tests</TabsTrigger>
                  <TabsTrigger value="success">Success</TabsTrigger>
                  <TabsTrigger value="error">Errors</TabsTrigger>
                  <TabsTrigger value="running">Running</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="space-y-3">
                  {testResults.map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(result.status)}
                        <span className="font-medium">{result.test}</span>
                      </div>
                      <Badge className={getStatusColor(result.status)}>
                        {result.status}
                      </Badge>
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="success" className="space-y-3">
                  {testResults.filter(r => r.status === 'success').map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="font-medium">{result.test}</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Success</Badge>
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="error" className="space-y-3">
                  {testResults.filter(r => r.status === 'error').map((result, index) => (
                    <div key={index} className="p-3 border rounded-lg bg-red-50">
                      <div className="flex items-center space-x-3 mb-2">
                        <XCircle className="h-4 w-4 text-red-500" />
                        <span className="font-medium">{result.test}</span>
                      </div>
                      <Alert variant="destructive">
                        <AlertDescription>{result.message}</AlertDescription>
                      </Alert>
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="running" className="space-y-3">
                  {testResults.filter(r => r.status === 'running').map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-blue-50">
                      <div className="flex items-center space-x-3">
                        <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                        <span className="font-medium">{result.test}</span>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">Running</Badge>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Test User Credentials */}
        {seedData && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Test User Credentials</span>
              </CardTitle>
              <CardDescription>
                Use these credentials to test different user roles and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg bg-blue-50">
                  <h4 className="font-semibold text-blue-900 mb-2">Admin User</h4>
                  <p className="text-sm text-blue-700"><strong>Email:</strong> sarah.chen@miv.org</p>
                  <p className="text-sm text-blue-700"><strong>Password:</strong> admin123</p>
                  <Badge className="mt-2">Full Access</Badge>
                </div>
                
                <div className="p-4 border rounded-lg bg-green-50">
                  <h4 className="font-semibold text-green-900 mb-2">Venture Manager</h4>
                  <p className="text-sm text-green-700"><strong>Email:</strong> michael.rodriguez@miv.org</p>
                  <p className="text-sm text-green-700"><strong>Password:</strong> manager123</p>
                  <Badge className="mt-2">Venture Management</Badge>
                </div>
                
                <div className="p-4 border rounded-lg bg-purple-50">
                  <h4 className="font-semibold text-purple-900 mb-2">GEDSI Analyst</h4>
                  <p className="text-sm text-purple-700"><strong>Email:</strong> aisha.patel@miv.org</p>
                  <p className="text-sm text-purple-700"><strong>Password:</strong> analyst123</p>
                  <Badge className="mt-2">GEDSI Analysis</Badge>
                </div>
                
                <div className="p-4 border rounded-lg bg-orange-50">
                  <h4 className="font-semibold text-orange-900 mb-2">Capital Facilitator</h4>
                  <p className="text-sm text-orange-700"><strong>Email:</strong> james.thompson@miv.org</p>
                  <p className="text-sm text-orange-700"><strong>Password:</strong> facilitator123</p>
                  <Badge className="mt-2">Capital Facilitation</Badge>
                </div>
                
                <div className="p-4 border rounded-lg bg-pink-50">
                  <h4 className="font-semibold text-pink-900 mb-2">External Stakeholder</h4>
                  <p className="text-sm text-pink-700"><strong>Email:</strong> maria.santos@investor.com</p>
                  <p className="text-sm text-pink-700"><strong>Password:</strong> stakeholder123</p>
                  <Badge className="mt-2">Read Only</Badge>
                </div>
                
                <div className="p-4 border rounded-lg bg-gray-50">
                  <h4 className="font-semibold text-gray-900 mb-2">Unverified User</h4>
                  <p className="text-sm text-gray-700"><strong>Email:</strong> test@example.com</p>
                  <p className="text-sm text-gray-700"><strong>Password:</strong> test123</p>
                  <Badge className="mt-2">Unverified</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Testing Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Testing Instructions</CardTitle>
            <CardDescription>
              Follow these steps to thoroughly test every function of the MIV platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Authentication & User Management</h4>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>• Test Google OAuth login/register</li>
                  <li>• Test email/password login with different roles</li>
                  <li>• Test user permissions and access control</li>
                  <li>• Test email verification flow</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Venture Management</h4>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>• Create, edit, and delete ventures</li>
                  <li>• Test venture intake form with all fields</li>
                  <li>• Test STG goals integration</li>
                  <li>• Test venture filtering and search</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">GEDSI & Impact Tracking</h4>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>• Test GEDSI metrics tracking</li>
                  <li>• Test IRIS metrics catalog</li>
                  <li>• Test impact reporting and analytics</li>
                  <li>• Test sustainability metrics</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Notifications & Communications</h4>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li>• Test notification system</li>
                  <li>• Test email automations</li>
                  <li>• Test weekly update emails</li>
                  <li>• Test STG reminder emails</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

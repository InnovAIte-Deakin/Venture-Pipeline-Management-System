import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/test-sprint2 - Test Sprint 2 integration features
export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Starting Sprint 2 Integration Test...');

    const testResults: any = {
      timestamp: new Date().toISOString(),
      tests: [],
      summary: {
        total: 0,
        passed: 0,
        failed: 0
      }
    };

    // Test 1: Email Logs API
    try {
      const emailLogsResponse = await fetch(`${request.nextUrl.origin}/api/emails/logs?limit=5`);
      const emailLogsData = await emailLogsResponse.json();
      
      if (emailLogsResponse.ok && emailLogsData.emailLogs) {
        testResults.tests.push({
          name: 'Email Logs API',
          status: 'PASSED',
          message: `Found ${emailLogsData.emailLogs.length} email logs`,
          data: { count: emailLogsData.emailLogs.length }
        });
        testResults.summary.passed++;
      } else {
        testResults.tests.push({
          name: 'Email Logs API',
          status: 'FAILED',
          message: 'Email Logs API not responding correctly',
          error: emailLogsData.error || 'Unknown error'
        });
        testResults.summary.failed++;
      }
    } catch (error) {
      testResults.tests.push({
        name: 'Email Logs API',
        status: 'FAILED',
        message: 'Email Logs API test failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      testResults.summary.failed++;
    }

    // Test 2: Notifications API
    try {
      const notificationsResponse = await fetch(`${request.nextUrl.origin}/api/notifications?limit=5`);
      const notificationsData = await notificationsResponse.json();
      
      if (notificationsResponse.ok && notificationsData.notifications) {
        testResults.tests.push({
          name: 'Notifications API',
          status: 'PASSED',
          message: `Found ${notificationsData.notifications.length} notifications`,
          data: { count: notificationsData.notifications.length }
        });
        testResults.summary.passed++;
      } else {
        testResults.tests.push({
          name: 'Notifications API',
          status: 'FAILED',
          message: 'Notifications API not responding correctly',
          error: notificationsData.error || 'Unknown error'
        });
        testResults.summary.failed++;
      }
    } catch (error) {
      testResults.tests.push({
        name: 'Notifications API',
        status: 'FAILED',
        message: 'Notifications API test failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      testResults.summary.failed++;
    }

    // Test 3: Weekly Update Email API
    try {
      // Get a user ID first
      const usersResponse = await fetch(`${request.nextUrl.origin}/api/users?limit=1`);
      const usersData = await usersResponse.json();
      
      if (usersResponse.ok && usersData.users?.length > 0) {
        const userId = usersData.users[0].id;
        const weeklyUpdateResponse = await fetch(`${request.nextUrl.origin}/api/emails/weekly-update`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: userId,
            period: 'last week',
            includeMetrics: true,
            includeVentures: true,
            includeNotifications: true
          })
        });
        
        const weeklyUpdateData = await weeklyUpdateResponse.json();
        
        if (weeklyUpdateResponse.ok && weeklyUpdateData.success) {
          testResults.tests.push({
            name: 'Weekly Update Email API',
            status: 'PASSED',
            message: `Weekly update sent to ${weeklyUpdateData.emailLog.to}`,
            data: { 
              recipient: weeklyUpdateData.emailLog.to,
              emailLogId: weeklyUpdateData.emailLog.id
            }
          });
          testResults.summary.passed++;
        } else {
          testResults.tests.push({
            name: 'Weekly Update Email API',
            status: 'FAILED',
            message: 'Weekly Update Email API not working',
            error: weeklyUpdateData.error || 'Unknown error'
          });
          testResults.summary.failed++;
        }
      } else {
        testResults.tests.push({
          name: 'Weekly Update Email API',
          status: 'FAILED',
          message: 'No users found for testing',
          error: 'Users API not responding correctly'
        });
        testResults.summary.failed++;
      }
    } catch (error) {
      testResults.tests.push({
        name: 'Weekly Update Email API',
        status: 'FAILED',
        message: 'Weekly Update Email API test failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      testResults.summary.failed++;
    }

    // Test 4: STG Reminder Email API
    try {
      // Get a user ID first
      const usersResponse = await fetch(`${request.nextUrl.origin}/api/users?limit=1`);
      const usersData = await usersResponse.json();
      
      if (usersResponse.ok && usersData.users?.length > 0) {
        const userId = usersData.users[0].id;
        const stgReminderResponse = await fetch(`${request.nextUrl.origin}/api/emails/stg-reminder`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: userId,
            reminderType: 'GENERAL',
            daysAhead: 7
          })
        });
        
        const stgReminderData = await stgReminderResponse.json();
        
        if (stgReminderResponse.ok && stgReminderData.success) {
          testResults.tests.push({
            name: 'STG Reminder Email API',
            status: 'PASSED',
            message: `STG reminder sent to ${stgReminderData.emailLog.to}`,
            data: { 
              recipient: stgReminderData.emailLog.to,
              emailLogId: stgReminderData.emailLog.id,
              venturesWithSTG: stgReminderData.stgData.ventures.withSTGGoals
            }
          });
          testResults.summary.passed++;
        } else {
          testResults.tests.push({
            name: 'STG Reminder Email API',
            status: 'FAILED',
            message: 'STG Reminder Email API not working',
            error: stgReminderData.error || 'Unknown error'
          });
          testResults.summary.failed++;
        }
      } else {
        testResults.tests.push({
          name: 'STG Reminder Email API',
          status: 'FAILED',
          message: 'No users found for testing',
          error: 'Users API not responding correctly'
        });
        testResults.summary.failed++;
      }
    } catch (error) {
      testResults.tests.push({
        name: 'STG Reminder Email API',
        status: 'FAILED',
        message: 'STG Reminder Email API test failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      testResults.summary.failed++;
    }

    // Test 5: IRIS Metrics API
    try {
      const irisResponse = await fetch(`${request.nextUrl.origin}/api/iris/metrics?limit=5`);
      const irisData = await irisResponse.json();
      
      if (irisResponse.ok && irisData.results) {
        testResults.tests.push({
          name: 'IRIS Metrics API',
          status: 'PASSED',
          message: `Found ${irisData.results.length} IRIS metrics`,
          data: { count: irisData.results.length }
        });
        testResults.summary.passed++;
      } else {
        testResults.tests.push({
          name: 'IRIS Metrics API',
          status: 'FAILED',
          message: 'IRIS Metrics API not responding correctly',
          error: irisData.error || 'Unknown error'
        });
        testResults.summary.failed++;
      }
    } catch (error) {
      testResults.tests.push({
        name: 'IRIS Metrics API',
        status: 'FAILED',
        message: 'IRIS Metrics API test failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      testResults.summary.failed++;
    }

    // Test 6: GEDSI Metrics API
    try {
      const gedsiResponse = await fetch(`${request.nextUrl.origin}/api/gedsi-metrics?limit=5`);
      const gedsiData = await gedsiResponse.json();
      
      if (gedsiResponse.ok && gedsiData.metrics) {
        testResults.tests.push({
          name: 'GEDSI Metrics API',
          status: 'PASSED',
          message: `Found ${gedsiData.metrics.length} GEDSI metrics`,
          data: { count: gedsiData.metrics.length }
        });
        testResults.summary.passed++;
      } else {
        testResults.tests.push({
          name: 'GEDSI Metrics API',
          status: 'FAILED',
          message: 'GEDSI Metrics API not responding correctly',
          error: gedsiData.error || 'Unknown error'
        });
        testResults.summary.failed++;
      }
    } catch (error) {
      testResults.tests.push({
        name: 'GEDSI Metrics API',
        status: 'FAILED',
        message: 'GEDSI Metrics API test failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      testResults.summary.failed++;
    }

    // Test 7: Ventures API
    try {
      const venturesResponse = await fetch(`${request.nextUrl.origin}/api/ventures?limit=5`);
      const venturesData = await venturesResponse.json();
      
      if (venturesResponse.ok && venturesData.ventures) {
        testResults.tests.push({
          name: 'Ventures API',
          status: 'PASSED',
          message: `Found ${venturesData.ventures.length} ventures`,
          data: { count: venturesData.ventures.length }
        });
        testResults.summary.passed++;
      } else {
        testResults.tests.push({
          name: 'Ventures API',
          status: 'FAILED',
          message: 'Ventures API not responding correctly',
          error: venturesData.error || 'Unknown error'
        });
        testResults.summary.failed++;
      }
    } catch (error) {
      testResults.tests.push({
        name: 'Ventures API',
        status: 'FAILED',
        message: 'Ventures API test failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      testResults.summary.failed++;
    }

    // Test 8: Users API
    try {
      const usersResponse = await fetch(`${request.nextUrl.origin}/api/users?limit=5`);
      const usersData = await usersResponse.json();
      
      if (usersResponse.ok && usersData.users) {
        testResults.tests.push({
          name: 'Users API',
          status: 'PASSED',
          message: `Found ${usersData.users.length} users`,
          data: { count: usersData.users.length }
        });
        testResults.summary.passed++;
      } else {
        testResults.tests.push({
          name: 'Users API',
          status: 'FAILED',
          message: 'Users API not responding correctly',
          error: usersData.error || 'Unknown error'
        });
        testResults.summary.failed++;
      }
    } catch (error) {
      testResults.tests.push({
        name: 'Users API',
        status: 'FAILED',
        message: 'Users API test failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      testResults.summary.failed++;
    }

    // Calculate total tests
    testResults.summary.total = testResults.tests.length;

    // Determine overall status
    const overallStatus = testResults.summary.failed === 0 ? 'PASSED' : 'PARTIAL';
    const successRate = (testResults.summary.passed / testResults.summary.total) * 100;

    console.log(`✅ Sprint 2 Integration Test Complete: ${testResults.summary.passed}/${testResults.summary.total} tests passed (${successRate.toFixed(1)}%)`);

    return NextResponse.json({
      success: true,
      message: `Sprint 2 Integration Test Complete: ${testResults.summary.passed}/${testResults.summary.total} tests passed`,
      status: overallStatus,
      successRate: successRate,
      testResults: testResults
    });

  } catch (error) {
    console.error('Error running Sprint 2 integration test:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

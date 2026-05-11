# Implementation of Email Notifications
Implemented option to send Venture Pipeline app Notifications via email using Nodemailer.

EMAIL SERVICE - the email core functions are implemented in the "email-service.ts" (sendEmailNotification(), logEmailStatus() etc)

TYPES OF NOTIFICATION in Venture Pipeline app as defined in ENUM in 
/api/notifications/route.ts
type: z.enum(['WELCOME', 'VENTURE_CREATED', 'VENTURE_UPDATED', 'GEDSI_ALERT', 'FUNDING_OPPORTUNITY', 'SYSTEM_UPDATE', 'REPORT_READY', 'STG_REMINDER', 'WEEKLY_UPDATE'])

EMAIL TEMPLATES have been created for each of these Types of Notifications
in the "email-templates.ts" file


## Email Server 
USING Google Gmail SMTP Server
Defined in .env
Intially configured to use Google Gmail SMPT (Using a Test/Dev account created by Joshua Erickson)


## To Do - Remaining steps
Awaiting a working backend to test functionality including Email Log data read/write.


# TESTING

```bash
bash test-email-interactive.sh
```

## Test Coverage Verification

### TEST - Completed
- Test 1: Server Connectivity
- Test 2: Send Test Email

### TESTS - To Do
Aditional tests that can be included once backend database read/write working:
'WELCOME'
'VENTURE_CREATED'
'VENTURE_UPDATED'
'GEDSI_ALERT'
'FUNDING_OPPORTUNITY'
'SYSTEM_UPDATE'
'REPORT_READY'
'STG_REMINDER'
'WEEKLY_UPDATE'

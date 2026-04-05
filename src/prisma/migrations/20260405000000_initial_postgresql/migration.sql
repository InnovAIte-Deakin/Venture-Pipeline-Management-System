-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('ADMIN', 'MANAGER', 'ANALYST', 'USER', 'VENTURE_MANAGER', 'GEDSI_ANALYST', 'CAPITAL_FACILITATOR', 'EXTERNAL_STAKEHOLDER');

-- CreateEnum
CREATE TYPE "public"."VentureStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "public"."VentureStage" AS ENUM ('INTAKE', 'SCREENING', 'DUE_DILIGENCE', 'INVESTMENT_READY', 'FUNDED', 'EXITED', 'SEED', 'SERIES_A', 'SERIES_B', 'SERIES_C');

-- CreateEnum
CREATE TYPE "public"."GEDSICategory" AS ENUM ('GENDER', 'DISABILITY', 'SOCIAL_INCLUSION', 'CROSS_CUTTING');

-- CreateEnum
CREATE TYPE "public"."MetricStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'VERIFIED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "public"."DocumentType" AS ENUM ('PITCH_DECK', 'FINANCIAL_STATEMENTS', 'BUSINESS_PLAN', 'LEGAL_DOCUMENTS', 'MARKET_RESEARCH', 'TEAM_PROFILE', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."ActivityType" AS ENUM ('VENTURE_CREATED', 'VENTURE_UPDATED', 'METRIC_ADDED', 'METRIC_UPDATED', 'DOCUMENT_UPLOADED', 'STAGE_CHANGED', 'CAPITAL_ACTIVITY', 'NOTE_ADDED');

-- CreateEnum
CREATE TYPE "public"."CapitalActivityType" AS ENUM ('GRANT', 'DEBT', 'EQUITY', 'CONVERTIBLE_NOTE', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."CapitalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('WELCOME', 'VENTURE_CREATED', 'VENTURE_UPDATED', 'GEDSI_ALERT', 'FUNDING_OPPORTUNITY', 'SYSTEM_UPDATE', 'REPORT_READY', 'STG_REMINDER', 'WEEKLY_UPDATE');

-- CreateEnum
CREATE TYPE "public"."EmailStatus" AS ENUM ('PENDING', 'SENT', 'FAILED', 'BOUNCED');

-- CreateEnum
CREATE TYPE "public"."WorkflowRunStatus" AS ENUM ('PENDING', 'RUNNING', 'SUCCEEDED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."FundStatus" AS ENUM ('FUNDRAISING', 'ACTIVE', 'CLOSED', 'WINDING_DOWN', 'LIQUIDATED');

-- CreateEnum
CREATE TYPE "public"."FundType" AS ENUM ('VENTURE', 'GROWTH', 'BUYOUT', 'IMPACT', 'DEBT', 'HYBRID');

-- CreateEnum
CREATE TYPE "public"."LPType" AS ENUM ('PENSION', 'ENDOWMENT', 'FOUNDATION', 'INSURANCE', 'SOVEREIGN', 'FAMILY_OFFICE', 'FUND_OF_FUNDS', 'CORPORATE', 'INDIVIDUAL', 'DEVELOPMENT', 'GOVERNMENT');

-- CreateEnum
CREATE TYPE "public"."LPStatus" AS ENUM ('ACTIVE', 'DEFAULTED', 'TRANSFERRED', 'WITHDRAWN', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "public"."RiskRating" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "public"."KYCStatus" AS ENUM ('APPROVED', 'PENDING', 'EXPIRED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."CapitalCallStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."DistributionType" AS ENUM ('DIVIDEND', 'CAPITAL_GAIN', 'RETURN_OF_CAPITAL', 'EXIT', 'INTERIM');

-- CreateEnum
CREATE TYPE "public"."DistributionStatus" AS ENUM ('PENDING', 'APPROVED', 'PAID', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."ProjectStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."TaskStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "public"."FundWorkflowType" AS ENUM ('CAPITAL_CALL', 'DISTRIBUTION', 'LP_ONBOARDING', 'COMPLIANCE_REVIEW', 'REPORTING', 'FUND_FORMATION', 'INVESTMENT_COMMITTEE', 'PORTFOLIO_REVIEW', 'AUDIT', 'TAX_PREPARATION', 'FUNDRAISING', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."WorkflowStatus" AS ENUM ('PENDING', 'ACTIVE', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."LifecyclePhaseType" AS ENUM ('FORMATION', 'FUNDRAISING', 'INVESTMENT', 'MANAGEMENT', 'HARVESTING', 'LIQUIDATION');

-- CreateEnum
CREATE TYPE "public"."LifecycleStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."FundTaskType" AS ENUM ('OPERATIONAL', 'COMPLIANCE', 'REPORTING', 'INVESTMENT', 'LP_RELATIONS', 'ADMINISTRATIVE', 'LEGAL', 'FINANCIAL');

-- CreateEnum
CREATE TYPE "public"."FundTaskStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."ReportType" AS ENUM ('MONTHLY', 'QUARTERLY', 'ANNUAL', 'TAX', 'COMPLIANCE', 'PERFORMANCE', 'LP_UPDATE', 'PORTFOLIO', 'CUSTOM');

-- CreateEnum
CREATE TYPE "public"."ReportStatus" AS ENUM ('DRAFT', 'GENERATED', 'PUBLISHED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "passwordHash" TEXT,
    "role" "public"."UserRole" NOT NULL DEFAULT 'USER',
    "organization" TEXT,
    "permissions" JSONB,
    "emailVerified" TIMESTAMP(3),
    "emailVerificationToken" TEXT,
    "emailVerificationExpires" TIMESTAMP(3),
    "notificationPreferences" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ventures" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sector" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "website" TEXT,
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT,
    "pitchSummary" TEXT,
    "inclusionFocus" TEXT,
    "founderTypes" TEXT NOT NULL,
    "teamSize" INTEGER,
    "foundingYear" INTEGER,
    "targetMarket" TEXT,
    "revenueModel" TEXT,
    "revenue" DOUBLE PRECISION,
    "fundingRaised" DOUBLE PRECISION,
    "lastValuation" DOUBLE PRECISION,
    "stgGoals" JSONB,
    "gedsiMetricsSummary" JSONB,
    "financials" JSONB,
    "documentsMetadata" JSONB,
    "tags" JSONB,
    "operationalReadiness" JSONB,
    "capitalReadiness" JSONB,
    "gedsiGoals" JSONB,
    "washingtonShortSet" JSONB,
    "disabilityInclusion" JSONB,
    "aiAnalysis" JSONB,
    "challenges" TEXT,
    "supportNeeded" TEXT,
    "timeline" TEXT,
    "gedsiScore" DOUBLE PRECISION,
    "socialImpactScore" DOUBLE PRECISION,
    "gedsiComplianceRate" DOUBLE PRECISION,
    "totalBeneficiaries" INTEGER,
    "jobsCreated" INTEGER,
    "womenEmpowered" INTEGER,
    "disabilityInclusive" INTEGER,
    "youthEngaged" INTEGER,
    "calculatedAt" TIMESTAMP(3),
    "status" "public"."VentureStatus" NOT NULL DEFAULT 'ACTIVE',
    "stage" "public"."VentureStage" NOT NULL DEFAULT 'INTAKE',
    "intakeDate" TIMESTAMP(3),
    "screeningDate" TIMESTAMP(3),
    "dueDiligenceStart" TIMESTAMP(3),
    "dueDiligenceEnd" TIMESTAMP(3),
    "investmentReadyAt" TIMESTAMP(3),
    "fundedAt" TIMESTAMP(3),
    "nextReviewAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,
    "assignedToId" TEXT,

    CONSTRAINT "ventures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."gedsi_metrics" (
    "id" TEXT NOT NULL,
    "ventureId" TEXT NOT NULL,
    "metricCode" TEXT NOT NULL,
    "metricName" TEXT NOT NULL,
    "category" "public"."GEDSICategory" NOT NULL,
    "targetValue" DOUBLE PRECISION NOT NULL,
    "currentValue" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "status" "public"."MetricStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "verificationDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "gedsi_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."documents" (
    "id" TEXT NOT NULL,
    "ventureId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."DocumentType" NOT NULL,
    "url" TEXT NOT NULL,
    "size" INTEGER,
    "mimeType" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."activities" (
    "id" TEXT NOT NULL,
    "ventureId" TEXT,
    "userId" TEXT NOT NULL,
    "type" "public"."ActivityType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."capital_activities" (
    "id" TEXT NOT NULL,
    "ventureId" TEXT NOT NULL,
    "type" "public"."CapitalActivityType" NOT NULL,
    "amount" DOUBLE PRECISION,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" "public"."CapitalStatus" NOT NULL DEFAULT 'PENDING',
    "description" TEXT,
    "date" TIMESTAMP(3),
    "investorName" TEXT,
    "terms" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "capital_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."iris_metrics_catalog" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "subcategory" TEXT,
    "unit" TEXT,
    "definition" TEXT,
    "example" TEXT,
    "tags" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "iris_metrics_catalog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "public"."NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."email_logs" (
    "id" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "template" TEXT,
    "status" "public"."EmailStatus" NOT NULL DEFAULT 'PENDING',
    "sentAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "public"."workflows" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "definition" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workflows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."workflow_runs" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "status" "public"."WorkflowRunStatus" NOT NULL DEFAULT 'PENDING',
    "input" JSONB,
    "output" JSONB,
    "errorMessage" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),

    CONSTRAINT "workflow_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."custom_dashboards" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "widgets" JSONB NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "tags" JSONB,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "custom_dashboards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."funds" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "vintage" TEXT NOT NULL,
    "size" DOUBLE PRECISION NOT NULL,
    "committedCapital" DOUBLE PRECISION NOT NULL,
    "calledCapital" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "distributedCapital" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "netAssetValue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "irr" DOUBLE PRECISION,
    "tvpi" DOUBLE PRECISION,
    "dpi" DOUBLE PRECISION,
    "moic" DOUBLE PRECISION,
    "status" "public"."FundStatus" NOT NULL DEFAULT 'FUNDRAISING',
    "fundType" "public"."FundType" NOT NULL DEFAULT 'VENTURE',
    "geography" TEXT,
    "sectors" JSONB,
    "investmentPeriod" TEXT,
    "fundTerm" TEXT,
    "managementFee" DOUBLE PRECISION,
    "carriedInterest" DOUBLE PRECISION,
    "hurdle" DOUBLE PRECISION,
    "benchmark" TEXT,
    "aum" DOUBLE PRECISION,
    "dryPowder" DOUBLE PRECISION,
    "leverage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "esg" BOOLEAN NOT NULL DEFAULT false,
    "regulatoryStatus" TEXT,
    "fundAdmin" TEXT,
    "auditor" TEXT,
    "legalCounsel" TEXT,
    "primeBroker" TEXT,
    "managerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "funds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."limited_partners" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."LPType" NOT NULL,
    "commitment" DOUBLE PRECISION NOT NULL,
    "called" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "distributed" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "nav" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "irr" DOUBLE PRECISION,
    "tvpi" DOUBLE PRECISION,
    "dpi" DOUBLE PRECISION,
    "country" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "contactPerson" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "status" "public"."LPStatus" NOT NULL DEFAULT 'ACTIVE',
    "investmentDate" TIMESTAMP(3),
    "lastCapitalCall" TIMESTAMP(3),
    "lastDistribution" TIMESTAMP(3),
    "riskRating" "public"."RiskRating" NOT NULL DEFAULT 'MEDIUM',
    "kycStatus" "public"."KYCStatus" NOT NULL DEFAULT 'PENDING',
    "accredited" BOOLEAN NOT NULL DEFAULT false,
    "fundId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "limited_partners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."capital_calls" (
    "id" TEXT NOT NULL,
    "callNumber" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "status" "public"."CapitalCallStatus" NOT NULL DEFAULT 'PENDING',
    "purpose" TEXT NOT NULL,
    "investments" JSONB,
    "expenses" DOUBLE PRECISION,
    "interestRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "gracePeriod" INTEGER NOT NULL DEFAULT 30,
    "defaultPenalty" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "wireInstructions" BOOLEAN NOT NULL DEFAULT false,
    "noticeDate" TIMESTAMP(3),
    "remindersSent" INTEGER NOT NULL DEFAULT 0,
    "documentsGenerated" BOOLEAN NOT NULL DEFAULT false,
    "lpsResponded" INTEGER NOT NULL DEFAULT 0,
    "totalLps" INTEGER NOT NULL,
    "fundId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "capital_calls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."distributions" (
    "id" TEXT NOT NULL,
    "distributionNumber" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "type" "public"."DistributionType" NOT NULL,
    "status" "public"."DistributionStatus" NOT NULL DEFAULT 'PENDING',
    "source" TEXT,
    "sourceVentures" JSONB,
    "taxImplications" TEXT,
    "withholding" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "exchangeRate" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "paymentMethod" TEXT,
    "taxReporting" BOOLEAN NOT NULL DEFAULT false,
    "k1Generated" BOOLEAN NOT NULL DEFAULT false,
    "recordDate" TIMESTAMP(3),
    "exDate" TIMESTAMP(3),
    "lpsPaid" INTEGER NOT NULL DEFAULT 0,
    "totalLps" INTEGER NOT NULL,
    "fundId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "distributions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."fund_investments" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "exitDate" TIMESTAMP(3),
    "exitAmount" DOUBLE PRECISION,
    "exitMultiple" DOUBLE PRECISION,
    "currentValue" DOUBLE PRECISION,
    "notes" TEXT,
    "fundId" TEXT NOT NULL,
    "ventureId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fund_investments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."projects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "public"."ProjectStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "priority" "public"."Priority" NOT NULL DEFAULT 'MEDIUM',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "dueDate" TIMESTAMP(3),
    "startDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "budget" DOUBLE PRECISION,
    "tags" JSONB,
    "metadata" JSONB,
    "leadId" TEXT NOT NULL,
    "ventureId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tasks" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "public"."TaskStatus" NOT NULL DEFAULT 'TODO',
    "priority" "public"."Priority" NOT NULL DEFAULT 'MEDIUM',
    "dueDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "estimatedHours" INTEGER,
    "actualHours" INTEGER,
    "tags" JSONB,
    "notes" TEXT,
    "projectId" TEXT NOT NULL,
    "assignedToId" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."announcements" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "priority" "public"."Priority" NOT NULL DEFAULT 'MEDIUM',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3),
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "announcements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."team_events" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT,
    "location" TEXT,
    "isAllDay" BOOLEAN NOT NULL DEFAULT false,
    "isRecurring" BOOLEAN NOT NULL DEFAULT false,
    "recurrence" JSONB,
    "organizerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "team_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."fund_workflows" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."FundWorkflowType" NOT NULL,
    "status" "public"."WorkflowStatus" NOT NULL DEFAULT 'PENDING',
    "priority" "public"."Priority" NOT NULL DEFAULT 'MEDIUM',
    "description" TEXT,
    "dueDate" TIMESTAMP(3),
    "startDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "assignedTo" TEXT,
    "fundId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fund_workflows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."fund_lifecycle_phases" (
    "id" TEXT NOT NULL,
    "phase_name" "public"."LifecyclePhaseType" NOT NULL,
    "status" "public"."LifecycleStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "startDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "duration" TEXT,
    "description" TEXT,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "milestones" JSONB,
    "fundId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fund_lifecycle_phases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."fund_operation_tasks" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "public"."FundTaskType" NOT NULL DEFAULT 'OPERATIONAL',
    "status" "public"."FundTaskStatus" NOT NULL DEFAULT 'PENDING',
    "priority" "public"."Priority" NOT NULL DEFAULT 'MEDIUM',
    "dueDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "assignedTo" TEXT,
    "createdBy" TEXT NOT NULL,
    "fundId" TEXT,
    "workflowId" TEXT,
    "tags" JSONB,
    "attachments" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fund_operation_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."reports" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "public"."ReportType" NOT NULL,
    "status" "public"."ReportStatus" NOT NULL DEFAULT 'DRAFT',
    "description" TEXT,
    "filePath" TEXT,
    "fileSize" INTEGER,
    "generatedAt" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "periodStart" TIMESTAMP(3),
    "periodEnd" TIMESTAMP(3),
    "createdBy" TEXT NOT NULL,
    "fundId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_DashboardShared" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DashboardShared_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_ProjectMembers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProjectMembers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_TaskDependencies" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TaskDependencies_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "public"."_EventAttendees" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_EventAttendees_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_emailVerificationToken_key" ON "public"."users"("emailVerificationToken");

-- CreateIndex
CREATE UNIQUE INDEX "iris_metrics_catalog_code_key" ON "public"."iris_metrics_catalog"("code");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "public"."accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "public"."sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "public"."verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "public"."verification_tokens"("identifier", "token");

-- CreateIndex
CREATE INDEX "_DashboardShared_B_index" ON "public"."_DashboardShared"("B");

-- CreateIndex
CREATE INDEX "_ProjectMembers_B_index" ON "public"."_ProjectMembers"("B");

-- CreateIndex
CREATE INDEX "_TaskDependencies_B_index" ON "public"."_TaskDependencies"("B");

-- CreateIndex
CREATE INDEX "_EventAttendees_B_index" ON "public"."_EventAttendees"("B");

-- AddForeignKey
ALTER TABLE "public"."ventures" ADD CONSTRAINT "ventures_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ventures" ADD CONSTRAINT "ventures_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."gedsi_metrics" ADD CONSTRAINT "gedsi_metrics_ventureId_fkey" FOREIGN KEY ("ventureId") REFERENCES "public"."ventures"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."gedsi_metrics" ADD CONSTRAINT "gedsi_metrics_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."documents" ADD CONSTRAINT "documents_ventureId_fkey" FOREIGN KEY ("ventureId") REFERENCES "public"."ventures"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."activities" ADD CONSTRAINT "activities_ventureId_fkey" FOREIGN KEY ("ventureId") REFERENCES "public"."ventures"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."activities" ADD CONSTRAINT "activities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."capital_activities" ADD CONSTRAINT "capital_activities_ventureId_fkey" FOREIGN KEY ("ventureId") REFERENCES "public"."ventures"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."workflows" ADD CONSTRAINT "workflows_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."workflow_runs" ADD CONSTRAINT "workflow_runs_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "public"."workflows"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."custom_dashboards" ADD CONSTRAINT "custom_dashboards_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."funds" ADD CONSTRAINT "funds_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."limited_partners" ADD CONSTRAINT "limited_partners_fundId_fkey" FOREIGN KEY ("fundId") REFERENCES "public"."funds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."capital_calls" ADD CONSTRAINT "capital_calls_fundId_fkey" FOREIGN KEY ("fundId") REFERENCES "public"."funds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."distributions" ADD CONSTRAINT "distributions_fundId_fkey" FOREIGN KEY ("fundId") REFERENCES "public"."funds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."fund_investments" ADD CONSTRAINT "fund_investments_ventureId_fkey" FOREIGN KEY ("ventureId") REFERENCES "public"."ventures"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."fund_investments" ADD CONSTRAINT "fund_investments_fundId_fkey" FOREIGN KEY ("fundId") REFERENCES "public"."funds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."projects" ADD CONSTRAINT "projects_ventureId_fkey" FOREIGN KEY ("ventureId") REFERENCES "public"."ventures"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."projects" ADD CONSTRAINT "projects_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tasks" ADD CONSTRAINT "tasks_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tasks" ADD CONSTRAINT "tasks_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."tasks" ADD CONSTRAINT "tasks_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."announcements" ADD CONSTRAINT "announcements_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."team_events" ADD CONSTRAINT "team_events_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."fund_workflows" ADD CONSTRAINT "fund_workflows_fundId_fkey" FOREIGN KEY ("fundId") REFERENCES "public"."funds"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."fund_workflows" ADD CONSTRAINT "fund_workflows_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."fund_lifecycle_phases" ADD CONSTRAINT "fund_lifecycle_phases_fundId_fkey" FOREIGN KEY ("fundId") REFERENCES "public"."funds"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."fund_operation_tasks" ADD CONSTRAINT "fund_operation_tasks_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "public"."fund_workflows"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."fund_operation_tasks" ADD CONSTRAINT "fund_operation_tasks_fundId_fkey" FOREIGN KEY ("fundId") REFERENCES "public"."funds"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."fund_operation_tasks" ADD CONSTRAINT "fund_operation_tasks_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."fund_operation_tasks" ADD CONSTRAINT "fund_operation_tasks_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reports" ADD CONSTRAINT "reports_fundId_fkey" FOREIGN KEY ("fundId") REFERENCES "public"."funds"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reports" ADD CONSTRAINT "reports_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_DashboardShared" ADD CONSTRAINT "_DashboardShared_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."custom_dashboards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_DashboardShared" ADD CONSTRAINT "_DashboardShared_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ProjectMembers" ADD CONSTRAINT "_ProjectMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_ProjectMembers" ADD CONSTRAINT "_ProjectMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_TaskDependencies" ADD CONSTRAINT "_TaskDependencies_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_TaskDependencies" ADD CONSTRAINT "_TaskDependencies_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_EventAttendees" ADD CONSTRAINT "_EventAttendees_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."team_events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_EventAttendees" ADD CONSTRAINT "_EventAttendees_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;


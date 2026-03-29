-- AlterTable
ALTER TABLE "ventures" ADD COLUMN "dueDiligenceEnd" DATETIME;
ALTER TABLE "ventures" ADD COLUMN "dueDiligenceStart" DATETIME;
ALTER TABLE "ventures" ADD COLUMN "fundedAt" DATETIME;
ALTER TABLE "ventures" ADD COLUMN "intakeDate" DATETIME;
ALTER TABLE "ventures" ADD COLUMN "investmentReadyAt" DATETIME;
ALTER TABLE "ventures" ADD COLUMN "nextReviewAt" DATETIME;
ALTER TABLE "ventures" ADD COLUMN "screeningDate" DATETIME;

-- CreateTable
CREATE TABLE "funds" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "vintage" TEXT NOT NULL,
    "size" REAL NOT NULL,
    "committedCapital" REAL NOT NULL,
    "calledCapital" REAL NOT NULL DEFAULT 0,
    "distributedCapital" REAL NOT NULL DEFAULT 0,
    "netAssetValue" REAL NOT NULL DEFAULT 0,
    "irr" REAL NOT NULL DEFAULT 0,
    "tvpi" REAL NOT NULL DEFAULT 0,
    "dpi" REAL NOT NULL DEFAULT 0,
    "moic" REAL NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'FUNDRAISING',
    "fundType" TEXT NOT NULL,
    "geography" TEXT NOT NULL,
    "sector" JSONB NOT NULL,
    "investmentPeriod" TEXT NOT NULL,
    "fundTerm" TEXT NOT NULL,
    "managementFee" REAL NOT NULL,
    "carriedInterest" REAL NOT NULL,
    "hurdle" REAL NOT NULL,
    "catchUp" REAL NOT NULL,
    "benchmark" TEXT,
    "aum" REAL NOT NULL DEFAULT 0,
    "dryPowder" REAL NOT NULL DEFAULT 0,
    "leverage" REAL NOT NULL DEFAULT 0,
    "esg" BOOLEAN NOT NULL DEFAULT false,
    "regulatoryStatus" TEXT NOT NULL,
    "fundAdmin" TEXT,
    "auditor" TEXT,
    "legalCounsel" TEXT,
    "primeBroker" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "fundManagerId" TEXT NOT NULL,
    CONSTRAINT "funds_fundManagerId_fkey" FOREIGN KEY ("fundManagerId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "limited_partners" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "commitment" REAL NOT NULL,
    "called" REAL NOT NULL DEFAULT 0,
    "distributed" REAL NOT NULL DEFAULT 0,
    "nav" REAL NOT NULL DEFAULT 0,
    "irr" REAL NOT NULL DEFAULT 0,
    "tvpi" REAL NOT NULL DEFAULT 0,
    "dpi" REAL NOT NULL DEFAULT 0,
    "country" TEXT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "contactPerson" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "investmentDate" DATETIME NOT NULL,
    "lastCapitalCall" DATETIME,
    "lastDistribution" DATETIME,
    "riskRating" TEXT NOT NULL DEFAULT 'LOW',
    "kycStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "accredited" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "fundId" TEXT NOT NULL,
    CONSTRAINT "limited_partners_fundId_fkey" FOREIGN KEY ("fundId") REFERENCES "funds" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "capital_calls" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "callNumber" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "dueDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "purpose" TEXT,
    "investments" JSONB,
    "expenses" REAL NOT NULL DEFAULT 0,
    "interestRate" REAL NOT NULL DEFAULT 0,
    "gracePeriod" TEXT,
    "defaultPenalty" REAL NOT NULL DEFAULT 0,
    "wireInstructions" BOOLEAN NOT NULL DEFAULT false,
    "noticeDate" DATETIME NOT NULL,
    "remindersSent" INTEGER NOT NULL DEFAULT 0,
    "documentsGenerated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "fundId" TEXT NOT NULL,
    CONSTRAINT "capital_calls_fundId_fkey" FOREIGN KEY ("fundId") REFERENCES "funds" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "capital_call_responses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" REAL NOT NULL,
    "responseDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "paymentDate" DATETIME,
    "reference" TEXT,
    "notes" TEXT,
    "capitalCallId" TEXT NOT NULL,
    "limitedPartnerId" TEXT NOT NULL,
    CONSTRAINT "capital_call_responses_capitalCallId_fkey" FOREIGN KEY ("capitalCallId") REFERENCES "capital_calls" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "capital_call_responses_limitedPartnerId_fkey" FOREIGN KEY ("limitedPartnerId") REFERENCES "limited_partners" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "distributions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "distributionNumber" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "date" DATETIME NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ANNOUNCED',
    "source" TEXT,
    "taxImplications" TEXT,
    "withholding" REAL NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "exchangeRate" REAL NOT NULL DEFAULT 1,
    "paymentMethod" TEXT NOT NULL DEFAULT 'WIRE',
    "taxReporting" BOOLEAN NOT NULL DEFAULT false,
    "k1Generated" BOOLEAN NOT NULL DEFAULT false,
    "recordDate" DATETIME NOT NULL,
    "exDate" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "fundId" TEXT NOT NULL,
    CONSTRAINT "distributions_fundId_fkey" FOREIGN KEY ("fundId") REFERENCES "funds" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "distribution_payments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" REAL NOT NULL,
    "paymentDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "reference" TEXT,
    "taxWithheld" REAL NOT NULL DEFAULT 0,
    "distributionId" TEXT NOT NULL,
    "limitedPartnerId" TEXT NOT NULL,
    CONSTRAINT "distribution_payments_distributionId_fkey" FOREIGN KEY ("distributionId") REFERENCES "distributions" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "distribution_payments_limitedPartnerId_fkey" FOREIGN KEY ("limitedPartnerId") REFERENCES "limited_partners" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "fund_transactions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "date" DATETIME NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "reference" TEXT,
    "counterparty" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "exchangeRate" REAL NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fundId" TEXT NOT NULL,
    CONSTRAINT "fund_transactions_fundId_fkey" FOREIGN KEY ("fundId") REFERENCES "funds" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

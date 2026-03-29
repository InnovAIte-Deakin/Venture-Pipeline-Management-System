/*
  Warnings:

  - You are about to drop the `capital_call_responses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `capital_calls` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `distribution_payments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `distributions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `fund_transactions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `funds` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `limited_partners` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "capital_call_responses";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "capital_calls";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "distribution_payments";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "distributions";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "fund_transactions";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "funds";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "limited_partners";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "venture_metrics" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ventureId" TEXT NOT NULL,
    "irisCode" TEXT NOT NULL,
    "metricName" TEXT NOT NULL,
    "targetValue" REAL,
    "currentValue" REAL,
    "reportingFrequency" TEXT NOT NULL DEFAULT 'quarterly',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "lastReported" DATETIME,
    "nextReportDue" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "venture_metrics_ventureId_fkey" FOREIGN KEY ("ventureId") REFERENCES "ventures" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "venture_metric_reports" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ventureMetricId" INTEGER NOT NULL,
    "reportedValue" REAL NOT NULL,
    "reportingPeriod" TEXT NOT NULL,
    "notes" TEXT,
    "verificationStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "reportedBy" TEXT,
    "reportedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "venture_metric_reports_ventureMetricId_fkey" FOREIGN KEY ("ventureMetricId") REFERENCES "venture_metrics" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "venture_metrics_ventureId_irisCode_key" ON "venture_metrics"("ventureId", "irisCode");

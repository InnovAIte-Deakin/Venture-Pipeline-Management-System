/*
  Warnings:

  - You are about to drop the `venture_metric_reports` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `venture_metrics` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "ventures" ADD COLUMN "calculatedAt" DATETIME;
ALTER TABLE "ventures" ADD COLUMN "disabilityInclusive" INTEGER;
ALTER TABLE "ventures" ADD COLUMN "gedsiComplianceRate" REAL;
ALTER TABLE "ventures" ADD COLUMN "gedsiScore" REAL;
ALTER TABLE "ventures" ADD COLUMN "jobsCreated" INTEGER;
ALTER TABLE "ventures" ADD COLUMN "socialImpactScore" REAL;
ALTER TABLE "ventures" ADD COLUMN "totalBeneficiaries" INTEGER;
ALTER TABLE "ventures" ADD COLUMN "womenEmpowered" INTEGER;
ALTER TABLE "ventures" ADD COLUMN "youthEngaged" INTEGER;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "venture_metric_reports";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "venture_metrics";
PRAGMA foreign_keys=on;

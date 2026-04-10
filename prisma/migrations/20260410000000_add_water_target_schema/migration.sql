-- AlterTable: Convert targetMingguan from TEXT to JSONB
ALTER TABLE "User" ALTER COLUMN "targetMingguan" TYPE JSONB USING "targetMingguan"::jsonb;

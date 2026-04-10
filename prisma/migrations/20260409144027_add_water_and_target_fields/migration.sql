-- AlterTable
ALTER TABLE "User" ADD COLUMN     "targetHarian" INTEGER,
ADD COLUMN     "targetMingguan" TEXT,
ADD COLUMN     "waterDate" TEXT,
ADD COLUMN     "waterIntake" INTEGER NOT NULL DEFAULT 0;

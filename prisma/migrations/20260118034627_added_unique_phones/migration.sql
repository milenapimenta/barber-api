/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `Barber` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `Client` will be added. If there are existing duplicate values, this will fail.
  - Made the column `phone` on table `Barber` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Barber" ALTER COLUMN "phone" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Barber_phone_key" ON "Barber"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Client_phone_key" ON "Client"("phone");

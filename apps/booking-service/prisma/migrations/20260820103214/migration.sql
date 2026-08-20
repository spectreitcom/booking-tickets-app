/*
  Warnings:

  - A unique constraint covering the columns `[bookingId]` on the table `BookingDetailsView` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bookingId` to the `BookingDetailsView` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BookingDetailsView" ADD COLUMN     "bookingId" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BookingDetailsView_bookingId_key" ON "BookingDetailsView"("bookingId");

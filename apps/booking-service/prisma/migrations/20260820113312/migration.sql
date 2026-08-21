/*
  Warnings:

  - A unique constraint covering the columns `[bookingId]` on the table `BookingProcess` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BookingProcess_bookingId_key" ON "BookingProcess"("bookingId");

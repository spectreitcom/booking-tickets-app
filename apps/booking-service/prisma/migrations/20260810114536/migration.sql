-- CreateEnum
CREATE TYPE "BookingProcessStatus" AS ENUM ('RUNNING', 'COMPENSATING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "BookingProcessStep" AS ENUM ('RESERVING_SEATS', 'CHARGING_PAYMENT', 'RELEASING_SEATS', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "BookingViewStatus" AS ENUM ('PENDING', 'SEATS_RESERVED', 'CONFIRMED', 'REJECTED');

-- CreateEnum
CREATE TYPE "OutboxStatus" AS ENUM ('PENDING', 'PROCESSING', 'PUBLISHED', 'FAILED');

-- CreateTable
CREATE TABLE "BookingDetailsView" (
    "id" UUID NOT NULL,
    "eventId" UUID NOT NULL,
    "status" "BookingViewStatus" NOT NULL,
    "seatIds" TEXT[],
    "totalAmount" INTEGER,
    "paymentId" UUID,

    CONSTRAINT "BookingDetailsView_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingProcess" (
    "id" UUID NOT NULL,
    "bookingId" UUID NOT NULL,
    "status" "BookingProcessStatus" NOT NULL,
    "currentStep" "BookingProcessStep" NOT NULL,
    "paymentId" UUID,
    "reatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "BookingProcess_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BookingDetailsView_eventId_idx" ON "BookingDetailsView"("eventId");

-- CreateIndex
CREATE INDEX "BookingDetailsView_status_idx" ON "BookingDetailsView"("status");

-- CreateIndex
CREATE INDEX "BookingProcess_status_currentStep_idx" ON "BookingProcess"("status", "currentStep");

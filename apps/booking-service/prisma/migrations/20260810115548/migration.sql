-- CreateTable
CREATE TABLE "OutboxMessage" (
    "id" UUID NOT NULL,
    "messageType" VARCHAR(255) NOT NULL,
    "exchange" VARCHAR(60) NOT NULL,
    "routingKey" VARCHAR(255) NOT NULL,
    "payload" JSONB NOT NULL,
    "headers" JSONB NOT NULL DEFAULT '{}',
    "correlationId" UUID NOT NULL,
    "causationId" UUID,
    "sagaId" UUID,
    "status" "OutboxStatus" NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OutboxMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OutboxMessage_correlationId_idx" ON "OutboxMessage"("correlationId");

-- CreateIndex
CREATE INDEX "OutboxMessage_sagaId_idx" ON "OutboxMessage"("sagaId");

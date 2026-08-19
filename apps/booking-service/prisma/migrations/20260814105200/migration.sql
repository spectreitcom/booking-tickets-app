-- CreateIndex
CREATE INDEX "OutboxMessage_status_availableAt_createdAt_idx" ON "OutboxMessage"("status", "availableAt", "createdAt");

-- Add ownership and expiry metadata for concurrent outbox processing.
ALTER TABLE "OutboxMessage"
  ADD COLUMN "lockedAt" TIMESTAMP(3),
  ADD COLUMN "lockToken" UUID;

CREATE INDEX "OutboxMessage_status_availableAt_lockedAt_idx"
  ON "OutboxMessage"("status", "availableAt", "lockedAt");

-- CreateTable
CREATE TABLE "Stream" (
    "id" UUID NOT NULL,
    "streamName" VARCHAR(255) NOT NULL,
    "aggregateType" VARCHAR(100) NOT NULL,
    "aggregateId" UUID NOT NULL,
    "currentVersion" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stream_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoredEvent" (
    "globalPosition" BIGSERIAL NOT NULL,
    "eventId" UUID NOT NULL,
    "streamId" UUID NOT NULL,
    "streamVersion" INTEGER NOT NULL,
    "eventType" VARCHAR(255) NOT NULL,
    "eventData" JSONB NOT NULL,
    "metadata" JSONB NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "storedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StoredEvent_pkey" PRIMARY KEY ("globalPosition")
);

-- CreateIndex
CREATE UNIQUE INDEX "Stream_streamName_key" ON "Stream"("streamName");

-- CreateIndex
CREATE INDEX "Stream_aggregateType_idx" ON "Stream"("aggregateType");

-- CreateIndex
CREATE UNIQUE INDEX "Stream_aggregateType_aggregateId_key" ON "Stream"("aggregateType", "aggregateId");

-- CreateIndex
CREATE UNIQUE INDEX "StoredEvent_eventId_key" ON "StoredEvent"("eventId");

-- CreateIndex
CREATE INDEX "StoredEvent_streamId_streamVersion_idx" ON "StoredEvent"("streamId", "streamVersion");

-- CreateIndex
CREATE INDEX "StoredEvent_globalPosition_idx" ON "StoredEvent"("globalPosition");

-- CreateIndex
CREATE INDEX "StoredEvent_eventType_globalPosition_idx" ON "StoredEvent"("eventType", "globalPosition");

-- CreateIndex
CREATE UNIQUE INDEX "StoredEvent_streamId_streamVersion_key" ON "StoredEvent"("streamId", "streamVersion");

-- AddForeignKey
ALTER TABLE "StoredEvent" ADD CONSTRAINT "StoredEvent_streamId_fkey" FOREIGN KEY ("streamId") REFERENCES "Stream"("id") ON DELETE CASCADE ON UPDATE CASCADE;

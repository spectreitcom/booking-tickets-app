export type EventToAppend = {
  eventId: string;
  eventType: string;
  eventVersion: number;
  data: unknown;
  occurredAt: Date;
};

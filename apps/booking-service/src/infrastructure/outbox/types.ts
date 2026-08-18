export type OutboxMessage<TPayload = Record<string, any>> = {
  messageType: string;
  exchange?: string;
  routingKey: string;
  payload: TPayload;
  metadata: { correlationId: string; causationId?: string; sagaId?: string };
};

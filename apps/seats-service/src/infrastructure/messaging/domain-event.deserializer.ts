import {
  ConsumerDeserializer,
  IncomingEvent,
  IncomingRequest,
} from '@nestjs/microservices';

interface DomainEventEnvelope {
  messageType: string;
  correlationId?: string;
  causationId?: string;
  sagaId?: string;
  payload: unknown;
  timestamp?: number;
}

function isDomainEventEnvelope(value: unknown): value is DomainEventEnvelope {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as DomainEventEnvelope).messageType === 'string' &&
    !('pattern' in value) &&
    !('data' in value)
  );
}

export class DomainEventDeserializer implements ConsumerDeserializer {
  deserialize(value: unknown): IncomingRequest | IncomingEvent {
    if (isDomainEventEnvelope(value)) {
      return {
        pattern: value.messageType,
        data: value.payload,
      };
    }

    return value as IncomingRequest | IncomingEvent;
  }
}

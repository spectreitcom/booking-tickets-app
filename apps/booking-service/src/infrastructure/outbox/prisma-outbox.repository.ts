import { Injectable } from '@nestjs/common';
import { OutboxRepository } from '../../application/ports/outbox.repository';
import { TransactionClient } from 'apps/booking-service/generated/prisma/internal/prismaNamespace';
import { OutboxMessage } from './types';

@Injectable()
export class PrismaOutboxRepository implements OutboxRepository {
  async enqueue(message: OutboxMessage, tx: TransactionClient): Promise<void> {
    await tx.outboxMessage.create({
      data: {
        messageType: message.messageType,
        exchange: message.exchange ?? 'direct',
        routingKey: message.routingKey,
        payload: message.payload,
        correlationId: message.metadata.correlationId,
        causationId: message.metadata.causationId,
        sagaId: message.metadata.sagaId,
      },
    });
  }
}

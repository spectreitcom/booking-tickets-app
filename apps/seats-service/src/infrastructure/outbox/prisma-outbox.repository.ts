import { Injectable } from '@nestjs/common';
import { OutboxRepository } from '../../application/ports/outbox.repository';
import { OutboxMessage } from './types';
import { TransactionClient } from '../../../generated/prisma/internal/prismaNamespace';

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

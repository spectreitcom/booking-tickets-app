import { Prisma } from '../../../generated/prisma/client';
import { OutboxMessage } from '../../infrastructure/outbox/types';

export abstract class OutboxRepository {
  abstract enqueue(
    message: OutboxMessage,
    tx: Prisma.TransactionClient,
  ): Promise<void>;
}

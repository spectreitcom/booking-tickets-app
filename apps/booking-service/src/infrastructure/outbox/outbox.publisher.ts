import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { randomUUID } from 'node:crypto';
import type { OutboxMessage as PrismaOutboxMessage } from '../../../generated/prisma/client';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { RabbitmqPublisher } from './rabbitmq.publisher';

const MAX_ATTEMPTS = 10;
const BATCH_SIZE = 100;
const LEASE_MS = 5 * 60 * 1000;

type ClaimedOutboxMessage = Pick<
  PrismaOutboxMessage,
  | 'id'
  | 'messageType'
  | 'exchange'
  | 'routingKey'
  | 'payload'
  | 'correlationId'
  | 'causationId'
  | 'sagaId'
  | 'attempts'
> & { lockToken: string };

@Injectable()
export class OutboxPublisher {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly rabbitmqPublisher: RabbitmqPublisher,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE, { waitForCompletion: true })
  async process() {
    const outboxMessages = await this.claimMessages();

    for (const outboxMessage of outboxMessages) {
      try {
        await this.rabbitmqPublisher.publish({
          messageType: outboxMessage.messageType,
          correlationId: outboxMessage.correlationId,
          causationId: outboxMessage.causationId,
          sagaId: outboxMessage.sagaId,
          payload: outboxMessage.payload,
          routingKey: outboxMessage.routingKey,
        });

        await this.prismaService.outboxMessage.updateMany({
          where: { id: outboxMessage.id, lockToken: outboxMessage.lockToken },
          data: { status: 'PUBLISHED', lockedAt: null, lockToken: null },
        });
      } catch {
        if (outboxMessage.attempts + 1 >= MAX_ATTEMPTS) {
          await this.prismaService.outboxMessage.updateMany({
            where: { id: outboxMessage.id, lockToken: outboxMessage.lockToken },
            data: {
              status: 'FAILED',
              attempts: { increment: 1 },
              lockedAt: null,
              lockToken: null,
            },
          });
        } else {
          await this.prismaService.outboxMessage.updateMany({
            where: { id: outboxMessage.id, lockToken: outboxMessage.lockToken },
            data: {
              attempts: { increment: 1 },
              availableAt: this.calcBackoff(outboxMessage.attempts),
              lockedAt: null,
              lockToken: null,
            },
          });
        }
      }
    }
  }

  private async claimMessages(): Promise<ClaimedOutboxMessage[]> {
    const lockToken = randomUUID();
    const leaseCutoff = new Date(Date.now() - LEASE_MS);

    return this.prismaService.$transaction(async (tx) => {
      return tx.$queryRawUnsafe<ClaimedOutboxMessage[]>(
        `
        WITH candidates AS (
          SELECT "id"
          FROM "OutboxMessage"
          WHERE "attempts" < ${MAX_ATTEMPTS}
            AND "availableAt" <= NOW()
            AND (
              "status" = 'PENDING'::"OutboxStatus"
              OR (
                "status" = 'PROCESSING'::"OutboxStatus"
                AND ("lockedAt" IS NULL OR "lockedAt" < $2)
              )
            )
          ORDER BY "createdAt" ASC
          LIMIT $3
          FOR UPDATE SKIP LOCKED
        )
        UPDATE "OutboxMessage" AS message
        SET "status" = 'PROCESSING'::"OutboxStatus",
            "lockedAt" = NOW(),
            "lockToken" = $1::uuid
        FROM candidates
        WHERE message."id" = candidates."id"
        RETURNING message."id", message."messageType", message."exchange",
          message."routingKey", message."payload", message."correlationId",
          message."causationId", message."sagaId", message."attempts",
          message."lockToken"
      `,
        lockToken,
        leaseCutoff,
        BATCH_SIZE,
      );
    });
  }

  private calcBackoff(attempts: number): Date {
    return new Date(Date.now() + Math.pow(2, attempts) * 1000);
  }
}

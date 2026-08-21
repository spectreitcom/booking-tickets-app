import { Module } from '@nestjs/common';
import { OutboxRepository } from '../../application/ports/outbox.repository';
import { PrismaOutboxRepository } from './prisma-outbox.repository';
import { ScheduleModule } from '@nestjs/schedule';
import { OutboxPublisher } from './outbox.publisher';
import { RabbitmqPublisher } from './rabbitmq.publisher';
import { PrismaModule } from '../../shared/prisma/prisma.module';

@Module({
  imports: [ScheduleModule.forRoot(), PrismaModule],
  providers: [
    {
      provide: OutboxRepository,
      useClass: PrismaOutboxRepository,
    },
    OutboxPublisher,
    RabbitmqPublisher,
  ],
  exports: [OutboxRepository],
})
export class OutboxModule {}

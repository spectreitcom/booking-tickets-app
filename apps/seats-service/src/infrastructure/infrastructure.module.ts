import { Module } from '@nestjs/common';
import { PrismaModule } from '../shared/prisma/prisma.module';
import { OutboxModule } from './outbox/outbox.module';

@Module({
  imports: [PrismaModule, OutboxModule],
  exports: [PrismaModule, OutboxModule],
})
export class InfrastructureModule {}

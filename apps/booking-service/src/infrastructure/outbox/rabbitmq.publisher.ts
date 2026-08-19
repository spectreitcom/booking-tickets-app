import { Injectable, OnModuleDestroy } from '@nestjs/common';
import {
  AmqpConnectionManager,
  ChannelWrapper,
  connect,
} from 'amqp-connection-manager';
import { ConfigService } from '@nestjs/config';
import { OutboxMessage } from '../../../generated/prisma/client';

@Injectable()
export class RabbitmqPublisher implements OnModuleDestroy {
  private connection: AmqpConnectionManager;
  private channel: ChannelWrapper;

  constructor(configService: ConfigService) {
    this.connection = connect([
      configService.getOrThrow<string>('RABBITMQ_URL'),
    ]);

    this.channel = this.connection.createChannel({
      json: true,
      confirm: true,
    });
  }

  async publish(
    message: Pick<
      OutboxMessage,
      | 'messageType'
      | 'correlationId'
      | 'causationId'
      | 'sagaId'
      | 'payload'
      | 'routingKey'
    >,
  ) {
    await this.channel.publish('', message.routingKey, {
      messageType: message.messageType,
      correlationId: message.correlationId,
      causationId: message.causationId,
      sagaId: message.sagaId,
      payload: message.payload,
      timestamp: Date.now(),
    });
  }

  async onModuleDestroy() {
    await this.channel.close();
    await this.connection.close();
  }
}

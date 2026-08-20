import { Injectable, OnModuleDestroy } from '@nestjs/common';
import {
  AmqpConnectionManager,
  ChannelWrapper,
  connect,
} from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';
import { ConfigService } from '@nestjs/config';
import { OutboxMessage } from '../../../generated/prisma/client';

@Injectable()
export class RabbitmqPublisher implements OnModuleDestroy {
  private connection: AmqpConnectionManager;
  private channel: ChannelWrapper;
  private readonly exchange: string;

  constructor(configService: ConfigService) {
    this.exchange =
      configService.get<string>('RABBITMQ_EXCHANGE') ?? 'domain_events';

    this.connection = connect([
      configService.getOrThrow<string>('RABBITMQ_URL'),
    ]);

    this.channel = this.connection.createChannel({
      json: true,
      confirm: true,
      setup: async (channel: ConfirmChannel) => {
        await channel.assertExchange(this.exchange, 'topic', {
          durable: true,
        });
      },
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
    await this.channel.publish(
      this.exchange,
      message.routingKey,
      {
        messageType: message.messageType,
        correlationId: message.correlationId,
        causationId: message.causationId,
        sagaId: message.sagaId,
        payload: message.payload,
        timestamp: Date.now(),
      },
      { persistent: true },
    );
  }

  async onModuleDestroy() {
    await this.channel.close();
    await this.connection.close();
  }
}

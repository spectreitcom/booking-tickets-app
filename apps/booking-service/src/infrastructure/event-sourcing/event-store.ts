import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../generated/prisma/client';
import { EventToAppend } from './types';
import { JsonObject } from '../../../generated/prisma/internal/prismaNamespace';
import { eventMapper } from './event-mapper';

@Injectable()
export class EventStore {
  async append(
    payload: {
      streamName: string;
      aggregateType: string;
      aggregateId: string;
      expectedVersion: number;
      events: EventToAppend[];
    },
    tx: Prisma.TransactionClient,
  ) {
    let stream = await tx.stream.findUnique({
      where: { streamName: payload.streamName },
    });

    if (!stream) {
      stream = await tx.stream.create({
        data: {
          streamName: payload.streamName,
          aggregateType: payload.aggregateType,
          aggregateId: payload.aggregateId,
          currentVersion: 1,
        },
      });
    }

    const updatedStream = await tx.stream.updateMany({
      where: { id: stream.id, currentVersion: payload.expectedVersion },
      data: {
        currentVersion: {
          increment: payload.events.length,
        },
      },
    });

    if (updatedStream.count !== 1) {
      throw new Error('Failed to update stream version');
    }

    let nextStreamVersion = payload.expectedVersion;

    for (const event of payload.events) {
      nextStreamVersion += 1;

      await tx.storedEvent.create({
        data: {
          eventId: event.eventId,
          eventType: event.eventType,
          eventData: event.data as JsonObject,
          streamVersion: nextStreamVersion,
          metadata: {},
          occurredAt: event.occurredAt,
          streamId: stream.id,
        },
      });
    }
  }

  async load(streamName: string, tx: Prisma.TransactionClient) {
    const stream = await tx.stream.findUnique({
      where: { streamName },
    });

    if (!stream) {
      throw new Error(`Stream not found: ${streamName}`);
    }

    const events = await tx.storedEvent.findMany({
      where: { streamId: stream.id },
      orderBy: {
        globalPosition: 'asc',
      },
    });

    return events.map((event) => eventMapper(event));
  }
}

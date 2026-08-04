import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetEventQuery } from '../queries/get-event.query';
import { EventReadModel } from './read-models/event.read-model';
import { PrismaService } from '../../shared/prisma/prisma.service';

@QueryHandler(GetEventQuery)
export class GetEventQueryHandler implements IQueryHandler<
  GetEventQuery,
  EventReadModel
> {
  constructor(private readonly prismaService: PrismaService) {}

  async execute(query: GetEventQuery): Promise<EventReadModel> {
    const event = await this.prismaService.event.findUnique({
      where: { id: query.eventId },
    });

    if (!event) {
      throw new Error('Event not found');
    }

    return new EventReadModel(event.id, event.name);
  }
}

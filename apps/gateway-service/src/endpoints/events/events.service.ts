import {
  Inject,
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { ClientProxy } from '@nestjs/microservices';
import { SEATS_SERVICE } from '../../constants';
import { firstValueFrom } from 'rxjs';
import { AddSeatToEventDto } from './dto/add-seat-to-event.dto';

@Injectable()
export class EventsService
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  constructor(
    @Inject(SEATS_SERVICE)
    private readonly seatsService: ClientProxy,
  ) {}

  async createEvent(dto: CreateEventDto) {
    return await firstValueFrom(
      this.seatsService.send<string>('seats.create-event', dto),
    );
  }

  async getEvent(id: string) {
    return await firstValueFrom(
      this.seatsService.send<{ id: string; name: string }>('seats.get-event', {
        eventId: id,
      }),
    );
  }

  async addSeatToEvent(eventId: string, dto: AddSeatToEventDto) {
    return await firstValueFrom(
      this.seatsService.send<string>('seats.add-seat', {
        eventId,
        ...dto,
      }),
    );
  }

  async onApplicationBootstrap() {
    await this.seatsService.connect();
  }

  async onApplicationShutdown() {
    await this.seatsService.close();
  }
}

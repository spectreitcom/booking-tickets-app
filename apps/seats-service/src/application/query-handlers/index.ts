import { GetEventQueryHandler } from './get-event.query-handler';
import { GetNotReservedSeatsByIdsQueryHandler } from './get-not-reserved-seats-by-ids.query-handler';

export const queryHandlers = [
  GetEventQueryHandler,
  GetNotReservedSeatsByIdsQueryHandler,
];

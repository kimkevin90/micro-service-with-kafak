import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from "@limkevin1313_ticket/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly topic = Subjects.TicketUpdated;
}

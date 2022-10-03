import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from "@limkevin1313_ticket/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly topic = Subjects.TicketCreated;
}

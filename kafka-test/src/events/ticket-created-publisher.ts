import { Publisher } from "./base-publisher";
import { Subjects } from "./subject";
import { TicketCreatedEvent } from "./ticket-created-events";

// base-listener에서 Event 제네릭 적용 후 topic은 T["subject"]와 일치해야함
export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly topic = Subjects.TicketCreated;
}

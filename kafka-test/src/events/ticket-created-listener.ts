import { KafkaMessage } from "kafkajs";
import { Listener } from "./base-listener";
import { Subjects } from "./subject";
import { TicketCreatedEvent } from "./ticket-created-events";

// base-listener에서 Event 제네릭 적용 후 topic은 T["subject"]와 일치해야함
export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly topic = Subjects.TicketCreated;

  onMessage(
    // TicketCreatedEvent의 데이터 형식 일치
    data: TicketCreatedEvent["data"],
    msg: KafkaMessage,
    resolveOffset: any
  ) {
    console.log("Event data!", data.id);

    resolveOffset(msg.offset);
  }
}

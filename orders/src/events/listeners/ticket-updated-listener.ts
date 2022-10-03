import { KafkaMessage } from "kafkajs";
import {
  Subjects,
  Listener,
  TicketUpdatedEvent,
} from "@limkevin1313_ticket/common";
import { Ticket } from "../../models/ticket";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly topic = Subjects.TicketUpdated;

  async onMessage(
    // TicketCreatedEvent의 데이터 형식 일치
    data: TicketUpdatedEvent["data"]
  ) {
    /* 1,2,3의 버전 1이 등록되고 2보다 3버전이 먼저들어오면 오류를 낸다  */
    try {
      const ticket = await Ticket.findByEvent(data);
      if (!ticket) {
        throw new Error("Ticket not found");
      }

      const { title, price } = data;
      ticket.set({ title, price });
      await ticket.save();
      return true;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}

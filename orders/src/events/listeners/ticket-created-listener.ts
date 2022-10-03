import { KafkaMessage } from "kafkajs";
import {
  Subjects,
  Listener,
  TicketCreatedEvent,
} from "@limkevin1313_ticket/common";
import { Ticket } from "../../models/ticket";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly topic = Subjects.TicketCreated;

  async onMessage(
    // TicketCreatedEvent의 데이터 형식 일치
    data: TicketCreatedEvent["data"]
  ) {
    try {
      console.log("생성 data---", data);
      const { id, title, price } = data;

      // 티켓서비스의 이벤트 발생 시, order 서비스의 ticket 컬렉션도 동일한 Id를 적용한다.
      const ticket = Ticket.build({
        id,
        title,
        price,
      });
      await ticket.save();

      return true;
    } catch (err) {
      throw err;
    }
  }
}

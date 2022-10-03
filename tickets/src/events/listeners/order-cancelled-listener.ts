import {
  Subjects,
  Listener,
  OrderCancelledEvent,
} from "@limkevin1313_ticket/common";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly topic = Subjects.OrderCancelled;

  async onMessage(data: OrderCancelledEvent["data"]) {
    try {
      console.log("OrderCancelledListener data", data);
      const ticket = await Ticket.findById(data.ticket.id);
      console.log("ticket----", ticket);
      if (!ticket) {
        throw new Error("Ticket not found");
      }
      console.log("어디까지 진행됐니1");

      ticket.set({ orderId: undefined });
      await ticket.save();
      console.log("어디까지 진행됐니");
      // 타서비스와 버전 동기화
      await new TicketUpdatedPublisher(this.client).publish({
        id: ticket.id,
        orderId: ticket.orderId,
        userId: ticket.userId,
        price: ticket.price,
        title: ticket.title,
        version: ticket.version,
      });
      console.log("어디까지 진행됐니3");
      return true;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}

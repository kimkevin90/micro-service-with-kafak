import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  OrderCreatedEvent,
} from "@limkevin1313_ticket/common";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly topic = Subjects.OrderCreated;

  async onMessage(data: OrderCreatedEvent["data"]) {
    try {
      console.log("OrderCreatedListener data----", data);
      // Find the ticket that the order is reserving
      const ticket = await Ticket.findById(data.ticket.id);

      // If no ticket, throw error
      if (!ticket) {
        throw new Error("Ticket not found");
      }

      // Mark the ticket as being reserved by setting its orderId property
      ticket.set({ orderId: data.id });

      // Save the ticket
      await ticket.save();
      // 타서비스와 버전 동기화
      await new TicketUpdatedPublisher(this.client).publish({
        id: ticket.id,
        price: ticket.price,
        title: ticket.title,
        userId: ticket.userId,
        orderId: ticket.orderId,
        version: ticket.version,
      });

      return true;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}

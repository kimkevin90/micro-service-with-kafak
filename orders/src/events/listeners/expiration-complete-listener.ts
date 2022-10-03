import {
  Listener,
  Subjects,
  ExpirationCompleteEvent,
  OrderStatus,
} from "@limkevin1313_ticket/common";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  readonly topic = Subjects.ExpirationComplete;

  async onMessage(data: ExpirationCompleteEvent["data"]) {
    try {
      const order = await Order.findById(data.orderId).populate("ticket");

      if (!order) {
        throw new Error("Order not found");
      }

      // Cancelled상태되면 isReserved로 인해 block 상태가 풀림
      order.set({
        status: OrderStatus.Cancelled,
      });
      await order.save();
      // Ticket 서비스와 Payment서비스에 해당 이벤트 전달
      await new OrderCancelledPublisher(this.client).publish({
        id: order.id,
        version: order.version,
        ticket: {
          id: order.ticket.id,
        },
      });

      return true;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}

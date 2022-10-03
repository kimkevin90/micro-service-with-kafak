import {
  Listener,
  OrderCreatedEvent,
  Subjects,
} from "@limkevin1313_ticket/common";
import { expirationQueue } from "../../queues/expiration-queue";
// import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly topic = Subjects.OrderCreated;

  async onMessage(data: OrderCreatedEvent["data"]) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    try {
      console.log("OrderCreatedListener data----", data, "delay---", delay);

      await expirationQueue.add(
        { orderId: data.id },
        {
          delay,
        }
      );
      return true;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}

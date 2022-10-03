import {
  Subjects,
  Publisher,
  OrderCancelledEvent,
} from "@limkevin1313_ticket/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly topic: Subjects.OrderCancelled = Subjects.OrderCancelled;
}

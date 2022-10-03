import {
  Publisher,
  OrderCreatedEvent,
  Subjects,
} from "@limkevin1313_ticket/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly topic: Subjects.OrderCreated = Subjects.OrderCreated;
}

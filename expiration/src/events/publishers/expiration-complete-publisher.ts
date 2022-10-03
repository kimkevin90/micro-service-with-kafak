import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from "@limkevin1313_ticket/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly topic = Subjects.ExpirationComplete;
}

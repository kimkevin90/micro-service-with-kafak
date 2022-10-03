import { Subjects } from "./subject";

export interface TicketCreatedEvent {
  subject: Subjects.TicketCreated;
  // publisher에서 보내는 데이타 형태 지정
  data: {
    id: string;
    title: string;
    price: number;
  };
}

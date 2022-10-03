import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version: number;
  /*
  오더 서비스에서 해당 티켓 주문 시 order 정보 기록
  오더 취소 시, orderId 삭제 하고 version업 한다.
  이떄 오더서비스의 티켓모델과 동기화를 위해 티켓서비스의 티켓 모델과
  동기화를 진행한다.
  */
  orderId?: string;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

/* 
동시성 문제 해결하기 위해 업데이트 쿼리 시 버전을 높이고
타 서비스에서 업데이트 리스너 이벤트 수령 후 버전을 기반으로,
낮은 버전 먼저 manual commit을 진행한다.

버전 증감의 경우 고민이 필요하다 가장 중요한 것은 기록을 담당하는 주요 서비스가
emit 시 버전을 증가 시킨다.
*/
ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };

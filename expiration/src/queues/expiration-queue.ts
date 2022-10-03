import Queue from "bull";
import { ExpirationCompletePublisher } from "../events/publishers/expiration-complete-publisher";
import { kafkaWrapper } from "../kafka-wrapper";

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>("order:expiration", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  console.log("expirationQueue_job.data.orderId---", job.data.orderId);
  new ExpirationCompletePublisher(kafkaWrapper.client).publish({
    orderId: job.data.orderId,
  });
});

export { expirationQueue };

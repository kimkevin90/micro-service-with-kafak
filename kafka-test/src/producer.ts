import { Kafka, logLevel, CompressionTypes } from "kafkajs";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

const kafka = new Kafka({
  logLevel: logLevel.DEBUG,
  clientId: "my-app",
  brokers: ["localhost:9092"],
});

const test = { id: "d1d333d", title: "dfad", price: 30 };
const producer = kafka.producer();

const run = async () => {
  const publisher = await new TicketCreatedPublisher(producer);
  publisher.publish(test);
};

run().catch(console.error);

const errorTypes = ["unhandledRejection", "uncaughtException"];
const signalTraps = ["SIGTERM", "SIGINT", "SIGUSR2"];

errorTypes.forEach((type) => {
  process.on(type, async () => {
    try {
      console.log(`process.on ${type}`);
      await producer.disconnect();
      process.exit(0);
    } catch (_) {
      process.exit(1);
    }
  });
});

signalTraps.forEach((type) => {
  process.once(type, async () => {
    try {
      await producer.disconnect();
    } finally {
      process.kill(process.pid, type);
    }
  });
});

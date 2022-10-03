import { logLevel, Kafka, Consumer } from "kafkajs";
import { TicketCreatedListener } from "./events/ticket-created-listener";

const kafka = new Kafka({
  logLevel: logLevel.ERROR,
  clientId: "my-consumer",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({
  groupId: "my-group",
});

const run = async () => {
  await new TicketCreatedListener(consumer).listen();
};

run().catch(console.error);

const errorTypes = ["unhandledRejection", "uncaughtException"];
const signalTraps = ["SIGTERM", "SIGINT", "SIGUSR2"];

errorTypes.forEach((type) => {
  process.on(type, async (e) => {
    try {
      console.log(`process.on ${type}`);
      console.error(e);
      await consumer.disconnect();
      process.exit(0);
    } catch (_) {
      process.exit(1);
    }
  });
});

signalTraps.forEach((type) => {
  process.once(type, async () => {
    try {
      console.log("디스커넥트 작동");
      await consumer.disconnect();
    } finally {
      process.kill(process.pid, type);
    }
  });
});

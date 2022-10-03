import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { kafkaWrapper } from "./kafka-wrapper";

// 테스팅을 위해 index.ts와 app.ts 분리
const start = async () => {
  if (!process.env.KAFKA_CLIENT_ID) {
    throw new Error("KAFKA_CLIENT_ID must be defined");
  }

  if (!process.env.KAFKA_BROKER_URL) {
    throw new Error("KAFKA_BROKER_URL must be defined");
  }

  try {
    await kafkaWrapper.connect(process.env.KAFKA_CLIENT_ID, [
      process.env.KAFKA_BROKER_URL,
    ]);
    const errorTypes = ["unhandledRejection", "uncaughtException"];
    const signalTraps = ["SIGTERM", "SIGINT", "SIGUSR2"];

    errorTypes.forEach((type) => {
      process.on(type, async (e) => {
        try {
          console.log("에러 디스커넥트 작동");
          console.log(`process.on ${type}`);
          console.error(e);
          await kafkaWrapper.client.producer().disconnect();
          await kafkaWrapper.client
            .consumer({
              groupId: "my-group",
            })
            .disconnect();
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
          await kafkaWrapper.client.producer().disconnect();
          await kafkaWrapper.client
            .consumer({
              groupId: "my-group",
            })
            .disconnect();
        } finally {
          process.kill(process.pid, type);
        }
      });
    });

    new OrderCreatedListener(kafkaWrapper.client, "my-group4").listen();
  } catch (err) {
    console.error(err);
  }
};

start();

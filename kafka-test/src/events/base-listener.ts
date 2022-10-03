import { Consumer, KafkaMessage } from "kafkajs";
import { Subjects } from "./subject";

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Listener<T extends Event> {
  abstract topic: T["subject"];
  abstract onMessage(
    data: T["data"],
    msg: KafkaMessage,
    resolveOffset: any
  ): void;
  private consumer: Consumer;

  constructor(consumer: Consumer) {
    this.consumer = consumer;
  }

  async listen() {
    await this.consumer.connect();
    await this.consumer.subscribe({
      topic: this.topic,
      fromBeginning: true,
    });

    await this.consumer.run({
      eachBatchAutoResolve: false,
      eachBatch: async ({
        batch,
        resolveOffset,
        heartbeat,
        uncommittedOffsets,
      }) => {
        batch.messages.forEach(async (message: KafkaMessage) => {
          console.log({
            topic: batch.topic,
            partition: batch.partition,
            offset: message.offset,
            key: message.key?.toString(),
            value: message.value?.toString(),
            headers: message.headers,
          });

          const parsedData = this.parseMessage(message);
          this.onMessage(parsedData, message, resolveOffset);

          await heartbeat();
          await uncommittedOffsets();
        });
      },
    });
  }

  parseMessage(message: KafkaMessage) {
    if (message.value) {
      const data = JSON.parse(message.value.toString());
      console.log("data===", data);
      return data;
    }
    return null;
  }
}

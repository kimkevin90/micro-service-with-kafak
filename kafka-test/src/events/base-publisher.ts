import { CompressionTypes, Producer } from "kafkajs";
import { Subjects } from "./subject";

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Publisher<T extends Event> {
  abstract topic: T["subject"];
  private producer: Producer;

  constructor(producer: Producer) {
    this.producer = producer;
  }

  async publish(data: T["data"]) {
    console.log("data---", data);
    await this.producer.connect();
    await this.producer
      .send({
        topic: this.topic,
        compression: CompressionTypes.GZIP,
        messages: [{ value: JSON.stringify(data) }],
      })
      .then(console.log)
      .catch((e) => console.error(`[example/producer] ${e.message}`, e));
  }
}

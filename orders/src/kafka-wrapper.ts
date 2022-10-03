import { Kafka, logLevel } from "kafkajs";

class KafkaWrapper {
  private _client?: Kafka;

  get client() {
    if (!this._client) {
      throw new Error("Cannot access Kafka client before connecting");
    }

    return this._client;
  }

  async connect(clientId: string, brokers: any) {
    try {
      this._client = new Kafka({
        // logLevel: logLevel.DEBUG,
        clientId,
        brokers,
      });
    } catch (err) {
      console.error(err);
    }
  }
}

export const kafkaWrapper = new KafkaWrapper();

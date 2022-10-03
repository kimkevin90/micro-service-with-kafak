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
        logLevel: logLevel.INFO,
        clientId,
        brokers,
      });
    } catch (err) {
      console.log("여기서 에러나니??");
      console.error(err);
    }
  }
}

export const kafkaWrapper = new KafkaWrapper();

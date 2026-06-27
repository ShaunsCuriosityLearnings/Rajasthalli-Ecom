import { Kafka, logLevel } from "kafkajs";

export const createKafkaClient = (service: string) => {
  return new Kafka({
    clientId: service,
    brokers: ["127.0.0.1:9094", "127.0.0.1:9095", "127.0.0.1:9096"],
    logLevel: logLevel.NOTHING,
  });
};
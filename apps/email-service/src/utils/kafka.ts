import { createConsumer, createKafkaClient, createProducer } from "@repo/kafka";

export const kafkaclient = createKafkaClient("email-service");

export const producer = createProducer(kafkaclient);
export const consumer = createConsumer(kafkaclient, "email-group");
export const statusConsumer = createConsumer(kafkaclient, "email-status-group");

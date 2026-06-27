import { createConsumer, createKafkaClient, createProducer } from "@repo/kafka"
const kafkaclient = createKafkaClient("payment-service")

export const producer = createProducer(kafkaclient)
export const consumer = createConsumer(kafkaclient, "payment-group")

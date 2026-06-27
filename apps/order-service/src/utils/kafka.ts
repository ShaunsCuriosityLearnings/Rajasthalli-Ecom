import { createConsumer, createKafkaClient, createProducer } from "@repo/kafka"
const kafkaclient = createKafkaClient("order-service")

export const producer = createProducer(kafkaclient)
export const consumer = createConsumer(kafkaclient, "order-group")

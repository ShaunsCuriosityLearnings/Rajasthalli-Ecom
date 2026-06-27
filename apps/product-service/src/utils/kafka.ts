import { createConsumer, createKafkaClient, createProducer } from "@repo/kafka"
const kafkaclient = createKafkaClient("product-service")

export const producer = createProducer(kafkaclient)
export const consumer = createConsumer(kafkaclient, "product-group")

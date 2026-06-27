import type { Kafka } from "kafkajs";

export const createProducer = (kafka: Kafka, service?: string) => {
    const producer = kafka.producer()

    const connect = async () => {
        await producer.connect();
    }
    const send = async (topic: string, message: object) => {
        await producer.send({
            topic,
            messages: [
                {
                    value: JSON.stringify(message),
                },
            ],
        });
    };

    const disconnect = async () => {
        await producer.disconnect();
    };

    return {
        send,
        connect,
        disconnect,
    };
};
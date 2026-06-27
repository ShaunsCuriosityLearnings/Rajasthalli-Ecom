import type { Kafka } from "kafkajs";

export const createConsumer = (kafka: Kafka, groupId: string) => {
    const consumer = kafka.consumer({ groupId })

    const connect = async () => {
        await consumer.connect()
        console.log(`consumer connected ${groupId}`)
    }

    const subscribe = async ({ topic, eachMessage }: { topic: string, eachMessage: (msg: any) => void }) => {
        await consumer.subscribe({ topic, fromBeginning: true })
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                console.log(`Message received: ${topic}`)
                const messageString = message.value?.toString() || "";
                if (messageString) {
                    try {
                        const messageObj = JSON.parse(messageString);
                        (eachMessage as any)(messageObj);
                    } catch (error) {
                        console.error(`Error parsing message for topic ${topic}:`, error);
                    }
                }
            }
        })
    }
    const disconnect = async () => {
        await consumer.disconnect();
    };

    return {
        subscribe,
        connect,
        disconnect,
    };
};
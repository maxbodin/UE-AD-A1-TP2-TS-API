import { createClient } from "redis";

const client = createClient({
  url: "redis://db:6379"
});
client.on("error", err => console.error("Redis Client Error", err));

export const redisClient = async () => {
  // Ensure client is connected before returning.
  if (!client.isOpen) {
    await client.connect();
  }
  console.log("DB status: ", client.isOpen);
  return client;
};
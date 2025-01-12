import { redisClient } from "../db";

export const checkRedisHealth = async (): Promise<boolean> => {
  const client = await redisClient();
  try {
    await client.set("health", "ok");
    const reply = await client.get("health");
    return reply === "ok";
  } catch (error) {
    console.error("Redis Health Check Failed:", error);
    return false;
  }
};
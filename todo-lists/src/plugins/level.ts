import level, {FastifyLeveldbOptions} from "@fastify/leveldb";
import fp from "fastify-plugin";

export default fp<FastifyLeveldbOptions>(async (fastify, options) => {
    fastify.register(level, {
        path: "./list.db",
        name: "listsdb"
    });
})
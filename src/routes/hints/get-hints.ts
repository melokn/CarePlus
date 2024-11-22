import type{ FastifyInstance } from "fastify";
import type{ ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";
export async function getHints(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().get(
        '/hints',
        {},
        async() => {
            const hints = await prisma.hint.findMany()
            return {hints: hints}
        }
    )
}
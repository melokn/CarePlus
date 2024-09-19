import type{ FastifyInstance } from "fastify";
import type{ ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";
export async function getUsers(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().get(
        '/users',
        {},
        async() => {
            const users = await prisma.user.findMany()
            return users
        }
    )
}
import type{ FastifyInstance } from "fastify";
import type{ ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { ClientError } from "../../errors/client-error";

export async function getUsers(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().get(
        '/users',
        {},
        async(request) => {
            const users = await prisma.user.findMany()
            return users
        }
    )
}
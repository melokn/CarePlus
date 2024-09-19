import type{ FastifyInstance } from "fastify";
import type{ ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";
export async function getPatients(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().get(
        '/patients',
        {},
        async() => {
            const patients = await prisma.patient.findMany()
            return patients
        }
    )
}
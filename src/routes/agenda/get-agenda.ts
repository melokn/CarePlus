import type{ FastifyInstance } from "fastify";
import type{ ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { ClientError } from "../../errors/client-error";

export async function getAgenda(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/agenda',
    {
      schema: {
        params: z.object({
          patientId: z.string().uuid()
        })
      }
    },
    async (request) => {
      const { patientId } = request.params
      

      const agenda = await prisma.patient.findUnique({
        where: {id: patientId},
        include: {
            appointments: true
        }
      })

      if(!agenda){
        throw new ClientError('Patient not found.')
      }

      return {agenda}
    }
  )
}
import type{ FastifyInstance } from "fastify";
import type{ ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { ClientError } from "../../errors/client-error";

export async function getUniquePatient(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/patients/:patientId',
    {
      schema: {
        params: z.object({
          patientId: z.string().uuid()
        })
      }
    },
    async (request) => {
      const { patientId } = request.params

      const patient = await prisma.patient.findUnique({
        where: {id: patientId},
          select: {
            name:true,
            age:true,
            allergies:true,
            bloodType:true,
            height:true,
            icon: true,
            observations:true
          }
      })

      if(!patient){
        throw new ClientError('User not found.')
      }

      return { patient }
    }
  )
}
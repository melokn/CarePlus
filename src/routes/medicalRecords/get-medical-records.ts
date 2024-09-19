import type{ FastifyInstance } from "fastify";
import type{ ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { ClientError } from "../../errors/client-error";

export async function getMedicalRecord(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/medicalRecord',
    {
      schema: {
        params: z.object({
          patientId: z.string().uuid()
        })
      }
    },
    async (request) => {
      const { patientId } = request.params
      

      const medicalRecord = await prisma.patient.findUnique({
        where: {id: patientId},
          include: {
            medicalRecord: true
          }
      })

      if(!medicalRecord){
        throw new ClientError('Patient not found.')
      }

      return {medicalRecord}
    }
  )
}
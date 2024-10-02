import type{ FastifyInstance } from "fastify";
import type{ ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { ClientError } from "../../errors/client-error";

export async function deletePatients(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    '/patients/delete',
    {
      schema: {
        body: z.object({
          patientId: z.string().uuid()
        })
      }
    },
    async (request) => {
      const { patientId } = request.body

      const userWithPatient = await prisma.user.findFirst({
        where: {
          patients: {
            some: { id: patientId }
          }
        }
      });

      if (!userWithPatient) {
        throw new ClientError('Patient not found.');
      }
      const deletedPatient = await prisma.patient.delete({
        where: {id: patientId}
      })
      
    
      return { patientId: deletedPatient.id }
    }
  )
}
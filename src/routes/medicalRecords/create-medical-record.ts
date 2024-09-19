import type{ FastifyInstance } from "fastify";
import type{ ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { ClientError } from "../../errors/client-error";

export async function createMedicalRecord(app: FastifyInstance){
  app.withTypeProvider<ZodTypeProvider>().post(
    '/medicalRecord/addMedicalRecord',
    {
      schema: {
        params: z.object({
          patientId: z.string().uuid()
        }),
        body: z.object({
          registerDate: z.coerce.date(),
          details: z.string()
        })
      }
    },

    async(request) => {
      const {patientId} = request.params
      const {
        registerDate,
        details
      } = request.body

      const patient = await prisma.patient.findUnique({
        where: {id: patientId},
          include: {
            medicalRecord:true
          }
      })

      if(!patient){
        throw new ClientError('Patient not found.')
      }

      const medicalRecord = await prisma.medicalRecord.create({
        data: {
          patientId,
          registerDate,
          details
        }
      })
      
      return { medicalRecord: medicalRecord.id }
    }
  )
}
import type{ FastifyInstance } from "fastify";
import type{ ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { ClientError } from "../../errors/client-error";

export async function updateMedicalRecord(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().put(
        '/medicalRecord/:medicalRecordId',
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
          async (request) => {
            const { patientId } = request.params
            const {
                registerDate, 
                details
              } = request.body
      
            const medicalRecord = await prisma.medicalRecord.update({
              where: {id: patientId},
                data: {
                  registerDate,
                  details
                }
            })
      
            if(!medicalRecord){
              throw new ClientError('Patient not found.')
            }
      
            return {medicalRecord: medicalRecord.id}
          }
    )
}
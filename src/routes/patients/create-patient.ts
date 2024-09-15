import type{ FastifyInstance } from "fastify";
import type{ ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { ClientError } from "../../errors/client-error";

export async function createPatient(app: FastifyInstance){
  app.withTypeProvider<ZodTypeProvider>().post(
    '/patients/newPatient',
    {
      schema: {
        params: z.object({
          userId: z.string().uuid()
        }),
        body: z.object({
          name: z.string(),
          birthdate: z.coerce.date()
        })
      }
    },

    async(request) => {
      const {userId} = request.params
      const {
        name,
        birthdate
      } = request.body

      const user = await prisma.user.findUnique({
        where: {id: userId},
          include: {
            patients:true
          }
      })

      if(!user){
        throw new ClientError('User not found.')
      }

      const patient = await prisma.patient.create({
        data: {
          name,
          birthdate,
          createdBy: user.id
        }
      })
      
      return { patientId: patient.id }
    }
  )
}
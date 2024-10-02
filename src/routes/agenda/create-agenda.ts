import type{ FastifyInstance } from "fastify";
import type{ ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { ClientError } from "../../errors/client-error";

export async function createAgenda(app: FastifyInstance){
  app.withTypeProvider<ZodTypeProvider>().post(
    '/agenda/addAgenda',
    {
      schema: {
        params: z.object({
          patientId: z.string().uuid()
        }),
        body: z.object({
          date: z.coerce.date(),
          description: z.string(),
          agendaType: z.string()
        })
      }
    },

    async(request) => {
      const {patientId} = request.params
      const {
        date,
        description,
        agendaType
      } = request.body

      const patient = await prisma.patient.findUnique({
        where: {id: patientId},
          include: {
            appointments:true
          }
      })

      if(!patient){
        throw new ClientError('Patient not found.')
      }

      const agenda = await prisma.agenda.create({
        data: {
          patientId,
          date,
          description,
          agendaType
        }
      })
      
      return { agenda: agenda.id }
    }
  )
}
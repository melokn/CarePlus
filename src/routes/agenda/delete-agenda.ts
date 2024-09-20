import type{ FastifyInstance } from "fastify";
import type{ ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { ClientError } from "../../errors/client-error";

export async function deleteAgenda(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    '/agenda/delete',
    {
      schema: {
        body: z.object({
          agendaId: z.string().uuid()
        })
      }
    },
    async (request) => {
      const { agendaId } = request.body

      const agenda = await prisma.agenda.findFirst({
        where: {
          id: agendaId,
        }
      });

      if (!agenda) {
        throw new ClientError('User or Patient not found.');
      }
      const deletedAgenda = await prisma.patient.delete({
        where: {id: agendaId}
      })
      
    
      return { patientId: deletedAgenda.id }
    }
  )
}
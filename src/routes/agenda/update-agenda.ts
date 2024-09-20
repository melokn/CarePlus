import type{ FastifyInstance } from "fastify";
import type{ ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { ClientError } from "../../errors/client-error";

export async function updateAgenda(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().put(
        '/agenda/update',
        {
            schema: {
              body: z.object({
                agendaId: z.string().uuid(),
                date: z.coerce.date(),
                description: z.string(),
                agendaType: z.string()
              })
            }
          },
          async (request) => {
            const {
                agendaId,
                date,
                description,
                agendaType
              } = request.body
      
            const agenda = await prisma.agenda.update({
              where: {id: agendaId},
                data: {
                    date,
                    description,
                    agendaType
                }
            })
      
            if(!agenda){
              throw new ClientError('Agenda not found.')
            }
      
            return {medicalRecord: agenda.id}
          }
    )
}
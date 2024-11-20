import type{ FastifyInstance } from "fastify";
import type{ ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { ClientError } from "../../errors/client-error";

export async function deleteNote(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/notes/delete',
    {
      schema: {
        body: z.object({
          title: z.string()
        })
      }
    },
    async (request) => {
      const { title } = request.body

      const note = await prisma.note.findFirst({
        where: {
          title: title
        }, select:{
          id:true
        }
      });

      if (!note) {
        throw new ClientError('Note not found.');
      }
      const deletedNote = await prisma.note.delete({
        where: {title: title}
      })
      
    
      return { noteId: deletedNote.id }
    }
  )
}
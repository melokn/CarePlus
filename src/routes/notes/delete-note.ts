import type{ FastifyInstance } from "fastify";
import type{ ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { ClientError } from "../../errors/client-error";

export async function deleteNotes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/notes/delete',
    {
      schema: {
        body: z.object({
          noteId: z.string().uuid()
        })
      }
    },
    async (request) => {
      const { noteId } = request.body

      const note = await prisma.note.findFirst({
        where: {
          id: noteId
        }, select:{
          id:true
        }
      });

      if (!note) {
        throw new ClientError('Note not found.');
      }
      const deletedNote = await prisma.note.delete({
        where: {id: noteId}
      })
      
    
      return { patientId: deletedNote.id }
    }
  )
}
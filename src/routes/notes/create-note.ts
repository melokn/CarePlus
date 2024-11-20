import type{ FastifyInstance } from "fastify";
import type{ ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { ClientError } from "../../errors/client-error";

export async function createNote(app: FastifyInstance){
  app.withTypeProvider<ZodTypeProvider>().post(
    '/notes/addNote',
    {
      schema: {
        params: z.object({
          userId: z.string().uuid()
        }),
        body: z.object({
          title: z.string(),
          description: z.string(),
          priority: z.string(),
          patientName: z.string(),
          content: z.string()
        })
      }
    },

    async(request) => {
      const {userId} = request.params
      const {
        title,
        description,
        priority,
        patientName,
        content
      } = request.body

      const user = await prisma.user.findUnique({
        where: {id: userId},
          select: {
            id:true
          }
      })

      if(!user){
        throw new ClientError('User not found.')
      }

      const note = await prisma.note.create({
        data: {
          title,
          description,
          priority,
          patientName,
          content,
          createdBy: userId
        }
      })
      
      return { note: note.id }
    }
  )
}
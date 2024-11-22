import type{ FastifyInstance } from "fastify";
import type{ ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { ClientError } from "../../errors/client-error";

export async function deleteHint(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/hint/delete',
    {
      schema: {
        body: z.object({
          hintId: z.string().uuid()
        })
      }
    },
    async (request) => {
      const { hintId } = request.body
      
      const hint = await prisma.hint.findFirst({
        where: {
          id: hintId
        }, select:{
          id:true
        }
      });

      if (!hint) {
        throw new ClientError('hint not found.');
      }
      const deletedHint = await prisma.hint.delete({
        where: {id: hintId}
      })
      
    
      return { hintId: deletedHint.id }
    }
  )
}
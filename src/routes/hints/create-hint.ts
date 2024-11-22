import type{ FastifyInstance } from "fastify";
import type{ ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { ClientError } from "../../errors/client-error";

export async function createHint(app: FastifyInstance){
  app.withTypeProvider<ZodTypeProvider>().post(
    '/hint/addHint',
    {
      schema: {
        body: z.object({
          author: z.string(),
          content: z.string()
        })
      }
    },
    async(request) => {
      const {
      author,
      content 
      } = request.body


      const hint = await prisma.hint.create({
        data: {
          author,
          content
        }
      })
      
      return { hint: hint.id }
    }
  )
}
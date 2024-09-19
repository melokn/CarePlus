import type{ FastifyInstance } from "fastify";
import type{ ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { ClientError } from "../../errors/client-error";

export async function getSpecificPatients(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/patients',
    {
      schema: {
        params: z.object({
          userId: z.string().uuid()
        })
      }
    },
    async (request) => {
      const { userId } = request.params

      const user = await prisma.user.findUnique({
        where: {id: userId},
          include: {
            patients:true
          }
      })

      if(!user){
        throw new ClientError('User not found.')
      }

      return { patients: user.patients}
    }
  )
}
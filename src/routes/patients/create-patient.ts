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
          age: z.number(),
          icon: z.string(),
          observations: z.string(),
          height: z.number(),
          bloodType: z.string(),
          allergies: z.string(),
        })
      }
    },

    async(request) => {
      const {userId} = request.params
      const {
        name,
        age,
        icon,
        observations,
        height,
        bloodType,
        allergies
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

      try {
        const patient = await prisma.patient.create({
          data: {
            name,
            age,
            icon,
            observations,
            height,
            bloodType,
            allergies,
            createdBy: user.id,
          },
        });
        return { patientId: patient.id };
      } catch (error) {
        console.error("Erro ao criar o paciente:", error);
        throw new Error("Erro interno ao criar o paciente.");
      }
      
    }
  )
}
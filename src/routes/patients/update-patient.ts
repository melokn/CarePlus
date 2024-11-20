import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { ClientError } from "../../errors/client-error";

export async function updatePatient(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    '/patients/update',
    {
      schema: {
        body: z.object({
          patientId: z.string().uuid(),
          name: z.string(),
          age: z.number().positive("Age must be a positive number"),
          observations: z.string(),
          height: z.number().positive("Height must be a positive number"),
          bloodType: z.string(),
          allergies: z.string(),
        })
      }
    },
    async (request, reply) => {
      const {
        patientId,
        name,
        age,
        observations,
        height,
        bloodType,
        allergies
      } = request.body;

      try {
        const existingPatient = await prisma.patient.findUnique({
          where: { id: patientId },
        });

        if (!existingPatient) {
          throw new ClientError("Patient not found.");
        }

        
        const updatedPatient = await prisma.patient.update({
          where: { id: patientId },
          data: {
            name,
            age,
            observations,
            height,
            bloodType,
            allergies,
          },
        });

        return { patient: updatedPatient.id, message: "Patient updated successfully" };

      } catch (error) {
        if (error instanceof ClientError) {
          reply.status(404).send({ message: error.message });
        } else {
          console.error("Erro ao atualizar o paciente:", error);
          reply.status(500).send({ message: "Internal server error" });
        }
      }
    }
  );
}

import { FastifyInstance } from "fastify";

export async function ping(app: FastifyInstance){
  app.get('/ping', async (request, reply) => {
    reply.send({ message: 'pong' })
  })
}
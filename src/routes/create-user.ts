import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { ClientError } from '../errors/client-error'
import bcrypt from 'bcrypt'

export async function createUser(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().post(
        '/users', 
        {
            schema: {
                body: z.object({
                    name: z.string(),
                    email: z.string().email(),
                    password: z.string().min(8),
                    userFunction: z.string(),
                }),
            },
        },
        async (request) => {
            const {
                name,
                email,
                password,
                userFunction
            } = request.body

            const hashedPassword = await bcrypt.hash(password, 10)

            const emailAlreadyExists = await prisma.user.findUnique({
                where: {email: email}
            })

            if(!emailAlreadyExists){
                throw new ClientError('User already exists!')
            }

            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    function: userFunction
                }
            })
            return { userId: user.id }
        }
    )
}
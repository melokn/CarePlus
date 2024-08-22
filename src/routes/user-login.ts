import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { ClientError } from '../errors/client-error'
import bcrypt from 'bcrypt'

export async function userLogin(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().post(
        '/users/login', {
            schema: {
                body: z.object({
                    email: z.string().email(),
                    password: z.string()
                }) 
            },
        },

        async(request) => {
            const {
                email,
                password
            } = request.body

            const userPassword = await prisma.user.findUnique({
                where: {email: email},
                select: {password: true}
            })
            
            if (!userPassword) {
                throw new ClientError('User not found')
              }
            
              const hashedPassword = userPassword.password
                const isPasswordCorrect = await bcrypt.compare(password, hashedPassword)
                if (!isPasswordCorrect) {
                  throw new ClientError('Invalid credentials')
                }

            
        } 
        
        
    )
}
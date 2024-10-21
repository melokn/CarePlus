import type{ FastifyInstance, FastifyTypeProvider } from "fastify";
import type{ ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { cognito } from "../../lib/cognito";
import { ClientError } from "../../errors/client-error";
import bcrypt from 'bcrypt'


import {
    AdminCreateUserCommand,
    AdminSetUserPasswordCommand,
    MessageActionType,
} from '@aws-sdk/client-cognito-identity-provider';

// Cria um usuário no Cognito
async function createUserInCognito(email: string, password: string) {
    const params = {
        UserPoolId: 'us-east-1_pWW7QLgWV',
        Username: email,
        UserAttributes: [
            {
                Name: 'email',
                Value: email,
            },
            {
                Name: 'email_verified',
                Value: 'true'
            }
        ],
        MessageAction: MessageActionType.SUPPRESS // Use a enum correta para suprimir o email
    };

    try {
        // Cria o usuário
        const command = new AdminCreateUserCommand(params);
        await cognito.send(command);

        // Define a senha do usuário sem forçar a mudança
        const setPasswordCommand = new AdminSetUserPasswordCommand({
            UserPoolId: 'us-east-1_pWW7QLgWV',
            Username: email,
            Password: password,
            Permanent: true, // Define a senha como permanente
        });

        await cognito.send(setPasswordCommand);
        
        return { success: true };
    } catch (error) {
        console.error(error); 
        throw new ClientError('Error creating user in Cognito'); 
    }
}




export async function createUser(app: FastifyInstance){
    app.withTypeProvider<ZodTypeProvider>().post(
        '/users', 
        {
            schema: {
                body: z.object({
                    name: z.string(),
                    email: z.string().email(),
                    password: z.string().refine((password) => {
                        const hasUpperCase = /[A-Z]/.test(password);
                        const hasLowerCase = /[a-z]/.test(password);
                        const hasNumber = /[0-9]/.test(password);
                        const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
                        return (
                            password.length >= 8 &&
                            hasUpperCase &&
                            hasLowerCase &&
                            hasNumber &&
                            hasSymbol
                        );
                    }, {
                        message: "A senha deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma letra minúscula, um número e um símbolo."
                    }),
                    userFunction: z.string(),
                }),
            }
        },
        async (request) => {
            const {
                name,
                email,
                password,
                userFunction
            } = request.body

            await createUserInCognito(email, password);

            const hashedPassword = await bcrypt.hash(password, 10)

            const emailAlreadyExists = await prisma.user.findUnique({
                where: {email: email}
            })

            if(emailAlreadyExists){
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
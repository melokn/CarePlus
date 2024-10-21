import { CognitoIdentityProviderClient, InitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { ClientError } from "../../errors/client-error";
import { cognito } from "../../lib/cognito";

export async function userLogin(app: FastifyInstance) {
  

  app.withTypeProvider<ZodTypeProvider>().post(
    '/users/login', {
      schema: {
        body: z.object({
          email: z.string().email(),
          password: z.string(),
        }),
      },
    },
    async (request) => {
      const { email, password } = request.body;

      try {
        // Autenticar o usuário com Cognito
        const authCommand = new InitiateAuthCommand({
          AuthFlow: "USER_PASSWORD_AUTH",
          ClientId: "1ckon32hg88d3cv1opo8bm1b4", 
          AuthParameters: {
            USERNAME: email,
            PASSWORD: password,
          },
        });

        const authResponse = await cognito.send(authCommand);
        console.log('Resposta do Cognito:', authResponse)
        // Retornar tokens JWT ou informações de usuário conforme necessário
        return {
          accessToken: authResponse.AuthenticationResult?.AccessToken,
          idToken: authResponse.AuthenticationResult?.IdToken,
          refreshToken: authResponse.AuthenticationResult?.RefreshToken,
        };
      } catch (error) {
        console.error(error);
        throw new ClientError("Invalid credentials or Cognito error");
      }
    }
  );
}

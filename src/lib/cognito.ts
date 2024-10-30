import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';
import { env } from '../env';

const cognitoClient = new CognitoIdentityProviderClient({
    region: 'us-east-1',
    credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY
    }
});

export const cognito = cognitoClient;

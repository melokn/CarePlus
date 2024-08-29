import fastify from 'fastify'
import cors from '@fastify/cors'
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { env } from './env'
import { errorHandler } from './error-handler'
import { createUser } from './routes/create-user'
import { userLogin } from './routes/user-login'
import { createPatient } from './routes/create-patient'
import { getPatients } from './routes/get-patients'
import { deletePatients } from './routes/delete-patient'

const app = fastify()

app.register(cors, {
  origin: '*'
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.setErrorHandler(errorHandler)
app.register(createUser)
app.register(userLogin)
app.register(createPatient, { prefix: '/users/:userId' })
app.register(getPatients, { prefix: '/users/:userId' })
app.register(deletePatients, { prefix: '/users/:userId' })

app.listen({ port: env.PORT }, () => {
  console.log(`Server running on port ${env.PORT}!`)
})
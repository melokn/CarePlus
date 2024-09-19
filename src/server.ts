import fastify from 'fastify'
import cors from '@fastify/cors'
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { env } from './env'
import { errorHandler } from './error-handler'
import { createUser } from './routes/users/create-user'
import { userLogin } from './routes/users/user-login'
import { getUsers } from './routes/users/get-users'
import { createPatient } from './routes/patients/create-patient'
import { getPatients } from './routes/patients/get-patients'
import { deletePatients } from './routes/patients/delete-patient'
import { ping } from './routes/ping'

const app = fastify()

app.register(cors, {
  origin: '*'
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

// app.setErrorHandler(errorHandler)
app.register(createUser)
app.register(userLogin)
app.register(getUsers)
app.register(createPatient, { prefix: '/users/:userId' })
app.register(getPatients, { prefix: '/users/:userId' })
app.register(deletePatients, { prefix: '/users/:userId' })
app.register(ping)

app.listen({
  port: 4060,
}).then(() => {
  console.log("Server running on port 4060");
})
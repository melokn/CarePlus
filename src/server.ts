import fastify from 'fastify'
import cors from '@fastify/cors'
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { errorHandler } from './error-handler'
import { createUser } from './routes/users/create-user'
import { userLogin } from './routes/users/user-login'
import { getUsers } from './routes/users/get-users'
import { createPatient } from './routes/patients/create-patient'
import { getSpecificPatients } from './routes/patients/get-specific-patients'
import { deletePatients } from './routes/patients/delete-patient'
import { ping } from './routes/ping'
import { getPatients } from './routes/patients/get-patients'
import { getUniquePatient } from './routes/patients/get-unique-patient'
import { updatePatient } from './routes/patients/update-patient'
import { createNote } from './routes/notes/create-note'
import { deleteNote } from './routes/notes/delete-note'
import { getNotes } from './routes/notes/get-notes'
import { createHint } from './routes/hints/create-hint'
import { getHints } from './routes/hints/get-hints'
import { deleteHint } from './routes/hints/delete-hint'

const app = fastify()

app.register(cors, {
  origin: '*'
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.setErrorHandler(errorHandler)

app.register(createUser)
app.register(userLogin)
app.register(getUsers)

app.register(createPatient, { prefix: '/users/:userId' })
app.register(getSpecificPatients, { prefix: '/users/:userId' })
app.register(deletePatients)
app.register(getPatients)
app.register(getUniquePatient)
app.register(updatePatient)

app.register(createNote, {prefix: '/users/:userId'})
app.register(deleteNote, {prefix: '/users/:userId'})
app.register(getNotes, {prefix: '/users/:userId'})

app.register(createHint)
app.register(getHints)
app.register(deleteHint)


app.register(ping)

app.listen({
  port: 4060,
}).then(() => {
  console.log("Server running on port 4060");
})
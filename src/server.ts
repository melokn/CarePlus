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
import { getMedicalRecord } from './routes/medicalRecords/get-medical-records'
import { getPatients } from './routes/patients/get-patients'
import { createMedicalRecord } from './routes/medicalRecords/create-medical-record'


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
app.register(deletePatients, { prefix: '/users/:userId' })
app.register(getPatients)

app.register(getMedicalRecord)
app.register(createMedicalRecord, { prefix: '/patients/:patientId' })

app.register(ping)

app.listen({
  port: 4060,
}).then(() => {
  console.log("Server running on port 4060");
})
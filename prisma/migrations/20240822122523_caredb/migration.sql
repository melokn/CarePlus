-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "function" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Paciente" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "birthdate" DATETIME NOT NULL,
    "createdBy" TEXT NOT NULL,
    CONSTRAINT "Paciente_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Prontuario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patientId" TEXT NOT NULL,
    "registerDate" DATETIME NOT NULL,
    "details" TEXT NOT NULL,
    CONSTRAINT "Prontuario_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Paciente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Anotacao" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patientId" TEXT NOT NULL,
    "noteDate" DATETIME NOT NULL,
    "content" TEXT NOT NULL,
    CONSTRAINT "Anotacao_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Paciente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Dica" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Agenda" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patientId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "description" TEXT NOT NULL,
    "agendaType" TEXT NOT NULL,
    CONSTRAINT "Agenda_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Paciente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Prontuario_patientId_key" ON "Prontuario"("patientId");

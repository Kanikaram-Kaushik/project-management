const { createClient } = require('@libsql/client');
require('dotenv').config();

async function run() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  const statements = [
    `CREATE TABLE IF NOT EXISTS "User" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "email" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      "password" TEXT NOT NULL,
      "role" TEXT NOT NULL DEFAULT 'PENDING',
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL
    )`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email")`,
    `CREATE TABLE IF NOT EXISTS "Project" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "title" TEXT NOT NULL,
      "description" TEXT,
      "progress" INTEGER NOT NULL DEFAULT 0,
      "checklist" TEXT,
      "totalBudget" REAL NOT NULL DEFAULT 0,
      "fundsPooled" REAL NOT NULL DEFAULT 0,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL,
      "clientId" TEXT NOT NULL,
      "supervisorId" TEXT,
      CONSTRAINT "Project_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
      CONSTRAINT "Project_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS "Update" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "description" TEXT NOT NULL,
      "imageUrl" TEXT,
      "stage" TEXT NOT NULL DEFAULT 'General',
      "manpowerMestri" INTEGER NOT NULL DEFAULT 0,
      "manpowerHelper" INTEGER NOT NULL DEFAULT 0,
      "progress" INTEGER NOT NULL DEFAULT 0,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "remarks" TEXT,
      "projectId" TEXT NOT NULL,
      CONSTRAINT "Update_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
    )`,
    `CREATE TABLE IF NOT EXISTS "Payment" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "amount" REAL NOT NULL,
      "status" TEXT NOT NULL DEFAULT 'PENDING',
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "projectId" TEXT NOT NULL,
      CONSTRAINT "Payment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
    )`,
  ];

  console.log(`Running ${statements.length} statements on Turso...`);
  for (const sql of statements) {
    await client.execute(sql);
    console.log('OK:', sql.trim().substring(0, 50));
  }

  // Create admin user
  const { randomUUID } = require('crypto');
  const now = new Date().toISOString();
  await client.execute({
    sql: 'INSERT OR IGNORE INTO "User" (id, email, name, password, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
    args: [randomUUID(), 'admin@luxe.com', 'Admin', 'admin123', 'ADMIN', now, now],
  });

  console.log('Schema and admin user created successfully!');
}

run().catch(console.error);

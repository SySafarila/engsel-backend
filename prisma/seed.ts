import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { v7 as UUIDV7 } from "uuid";

const prisma = new PrismaClient();

async function main() {
  await prisma.permission.createMany({
    data: [
      {
        name: "admin-access",
        id: String(UUIDV7()),
      },
      {
        name: "permissions-create",
        id: String(UUIDV7()),
      },
      {
        name: "permissions-read",
        id: String(UUIDV7()),
      },
      {
        name: "permissions-update",
        id: String(UUIDV7()),
      },
      {
        name: "permissions-delete",
        id: String(UUIDV7()),
      },
      {
        name: "roles-create",
        id: String(UUIDV7()),
      },
      {
        name: "roles-read",
        id: String(UUIDV7()),
      },
      {
        name: "roles-update",
        id: String(UUIDV7()),
      },
      {
        name: "roles-delete",
        id: String(UUIDV7()),
      },
    ],
  });

  await prisma.role.create({
    data: {
      id: String(UUIDV7()),
      name: "super-admin",
      level: 0,
      permissions: {
        connect: {
          name: "admin-access",
        },
      },
    },
  });

  await prisma.role.create({
    data: {
      id: String(UUIDV7()),
      name: "admin",
      level: 1,
      permissions: {
        connect: [
          {
            name: "admin-access",
          },
          {
            name: "roles-create",
          },
          {
            name: "roles-read",
          },
          {
            name: "roles-update",
          },
          {
            name: "roles-delete",
          },
        ],
      },
    },
  });

  await prisma.user.create({
    data: {
      id: String(UUIDV7()),
      email: "super.admin@admin.com",
      username: "_SUPERADMIN",
      password: bcrypt.hashSync("password", 10),
      name: "Super Admin",
      roles: {
        connectOrCreate: {
          create: {
            id: String(UUIDV7()),
            name: "super-admin",
          },
          where: {
            name: "super-admin",
          },
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      id: String(UUIDV7()),
      email: "admin@admin.com",
      username: "_ADMIN",
      password: bcrypt.hashSync("password", 10),
      name: "Admin",
      roles: {
        connectOrCreate: {
          create: {
            id: String(UUIDV7()),
            name: "admin",
          },
          where: {
            name: "admin",
          },
        },
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

import bcrypt from "bcrypt";
import { v7 as UUIDV7 } from "uuid";
import PrismaClient from "../src/utils/Database";

const prisma = PrismaClient;

async function main() {
  await prisma.permission.createMany({
    data: [
      {
        name: "admin-access",
        id: UUIDV7(),
      },
      {
        name: "permissions-create",
        id: UUIDV7(),
      },
      {
        name: "permissions-read",
        id: UUIDV7(),
      },
      {
        name: "permissions-update",
        id: UUIDV7(),
      },
      {
        name: "permissions-delete",
        id: UUIDV7(),
      },
      {
        name: "roles-create",
        id: UUIDV7(),
      },
      {
        name: "roles-read",
        id: UUIDV7(),
      },
      {
        name: "roles-update",
        id: UUIDV7(),
      },
      {
        name: "roles-delete",
        id: UUIDV7(),
      },
    ],
  });

  await prisma.role.create({
    data: {
      id: UUIDV7(),
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
      id: UUIDV7(),
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

  await prisma.role.create({
    data: {
      id: UUIDV7(),
      name: "user",
      level: 10,
    },
  });

  await prisma.user.create({
    data: {
      id: UUIDV7(),
      email: "super.admin@admin.com",
      username: "_SUPERADMIN",
      password: bcrypt.hashSync("password", 10),
      name: "Super Admin",
      verified_at: new Date(),
      roles: {
        connectOrCreate: {
          create: {
            id: UUIDV7(),
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
      id: UUIDV7(),
      email: "admin@admin.com",
      username: "_ADMIN",
      password: bcrypt.hashSync("password", 10),
      name: "Admin",
      verified_at: new Date(),
      roles: {
        connectOrCreate: {
          create: {
            id: UUIDV7(),
            name: "admin",
          },
          where: {
            name: "admin",
          },
        },
      },
    },
  });

  await prisma.user.create({
    data: {
      id: UUIDV7(),
      email: "sysafarila@mail.com",
      username: "SySafarila",
      password: bcrypt.hashSync("password", 10),
      name: "SySafarila",
      balance: 10000,
      verified_at: new Date(),
      roles: {
        connect: {
          name: "user",
        },
      },
      banks: {
        create: {
          bank: "bca",
          id: UUIDV7(),
          number: "121212",
          verified_at: new Date(),
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

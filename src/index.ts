import express from "./server";
import { httpServer as socketIo } from "./socketio";
import PrismaClient from "./utils/Database";

const port = process.env.APP_PORT ?? 3000;

express.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

process.on("beforeExit", async () => {
  const prisma = PrismaClient;
  await prisma.$disconnect();
});

// websocket
socketIo.listen(3030);

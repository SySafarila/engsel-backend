import { PrismaClient as PC } from "@prisma/client";

class Database {
  private static instance: PC;

  public static getInstance(): PC {
    if (!Database.instance) {
      Database.instance = new PC();
    }
    return Database.instance;
  }
}

const PrismaClient = Database.getInstance();
export default PrismaClient;

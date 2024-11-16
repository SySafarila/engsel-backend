export const getMidtransServerKey = (): string => {
  if (process.env.MIDTRANS_SERVER_KEY) {
    return process.env.MIDTRANS_SERVER_KEY;
  }
  throw new Error("Server key not set");
};

export const getMidtransServerKey = (): string => {
  if (process.env.MIDTRANS_SERVER_KEY) {
    return process.env.MIDTRANS_SERVER_KEY;
  }
  throw new Error("Server key not set");
};

export const getMidtransEndpoint = (): string => {
  return "https://api.sandbox.midtrans.com/v2/charge";
};

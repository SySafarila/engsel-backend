export type LoginParams = {
  email: string;
  password: string;
};

export type LoginResponseSuccess = {
  message: string;
  token: string;
};

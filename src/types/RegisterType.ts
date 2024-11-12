export type RegisterParams = {
  email: string;
  password: string;
  name: string;
};

export type RegisterResponseSuccess = {
  message: string;
  user: {
    name: string;
  };
};

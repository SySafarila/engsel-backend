export type CurrentUserResponseSuccess = {
  message: string;
  user: {
    id?: number;
    name?: string;
    email?: string;
    verified_at?: Date;
    updated_at?: Date;
    created_at?: Date;
  };
};

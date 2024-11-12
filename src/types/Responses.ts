export type LoginSuccess = {
  message: string;
  token: string;
};

export type RegisterSuccess = {
  message: string;
  user: {
    name: string;
  };
};

export type User = {
  id: number;
  name: string;
  email: string;
  verified_at: Date;
  updated_at: Date;
  created_at: Date;
};

export type CurrentUserSuccess = {
  message: string;
  user: User;
};

export type LogoutSuccess = {
  message: string;
};

export type PermissionCreateSuccess = {
  message: string;
  data: Permission;
};

export type PermissionDeleteSuccess = {
  message: string;
};

export type Permission = {
  id: number;
  name: string;
  updated_at: Date;
  created_at: Date;
};

export type PermissionReadSuccess = {
  message: string;
  data: Permission[];
};

export type Role = {
  id: number;
  name: string;
  level: number;
  updated_at: Date;
  created_at: Date;
  permissions?: {
    name: string;
  }[];
};

export type RoleCreateSuccess = {
  message: string;
  data: Role;
};

export type RoleUpdateSuccess = {
  message: string;
  data: Role;
};

export type RoleDeleteSuccess = {
  message: string;
};

export type RoleReadSuccess = {
  message: string;
  data: Role[];
};

export type ErrorResponse = {
  message: string;
};

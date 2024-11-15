export type Login = {
  email: string;
  password: string;
};

export type Register = {
  email: string;
  password: string;
  name: string;
  username: string;
};

export type PermissionCreate = {
  name: string;
};

export type PermissionUpdate = {
  name: string;
  new_name: string;
};

export type PermissionDelete = {
  name: string;
};

export type RoleCreate = {
  name: string;
  level: number;
  permissions: string[];
};

export type RoleUpdate = {
  name: string;
  new_name?: string;
  new_level?: number;
  new_permissions?: string[];
};

export type RoleDelete = {
  name: string;
};

export type SendDonate = {
  donator_name: string;
  donator_email?: string;
  message: string;
  payment_method: PaymentMethod;
  amount: number;
};

export type PaymentMethod =
  | "qris"
  | "bca virtual account"
  | "permata virtual account";

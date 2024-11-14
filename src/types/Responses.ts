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
  id: string;
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
  id: string;
  name: string;
  updated_at: Date;
  created_at: Date;
};

export type PermissionReadSuccess = {
  message: string;
  data: Permission[];
};

export type Role = {
  id: string;
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

type VirtualAccount = {
  number: string;
  bank: string;
};

export type DonateSuccess = {
  message: string;
  qris?: string;
  virtual_account: null | VirtualAccount;
};

export type MidtransQrisSuccess = {
  status_code: string;
  status_message: string;
  transaction_id: string;
  order_id: string;
  merchant_id: string;
  gross_amount: string;
  currency: string;
  payment_type: string;
  transaction_time: string;
  transaction_status: string;
  fraud_status: string;
  acquirer: string;
  actions: {
    name: string;
    method: string;
    url: string;
  }[];
};

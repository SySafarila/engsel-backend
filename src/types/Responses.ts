export type LoginSuccess = {
  message: string;
  token: string;
};

export type RegisterSuccess = {
  message: string;
  user: {
    name: string;
    username: string;
  };
};

export type User = {
  id: string;
  name: string;
  username: string;
  email: string;
  verified_at?: Date;
  updated_at: Date;
  created_at: Date;
  balance: number;
};

export type CurrentUserSuccess = {
  message: string;
  user: User;
  roles: {
    name: string;
    level: number;
  }[];
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

export type VirtualAccount = {
  number: string;
  bank: string;
};

export type Qris = string;

export type DonateSuccess = {
  message: string;
  qris?: Qris;
  virtual_account?: VirtualAccount;
  amount: number;
  expired_at?: number;
  transaction_id: string;
};

export type DetailTransaction = {
  message: string;
  qris?: Qris;
  virtual_account?: VirtualAccount;
  amount: number;
  expired_at?: number;
  transaction_id: string;
  is_paid: boolean;
};

export type UserDetail = {
  message: string;
  user: {
    id: string;
    name: string;
    username: string;
    balance: number;
    email: string;
    roles: {
      level: number;
      name: string;
    }[];
  };
};

export type UserDetailPublic = {
  message: string;
  user: {
    id: string;
    name: string;
    username: string;
  };
  minTts: number;
};

export type Users = {
  message: string;
  users: {
    id: string;
    name: string;
    username: string;
    email: string;
    balance: number;
    roles: {
      name: string;
      level: number;
    }[];
  }[];
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
  expired_at?: number;
};

export type MidtransBcaVaSuccess = {
  status_code: string;
  status_message: string;
  transaction_id: string;
  order_id: string;
  gross_amount: string;
  payment_type: string;
  transaction_time: string;
  transaction_status: string;
  va_numbers: {
    bank: "BCA";
    va_number: string;
  }[];
  fraud_status: string;
  currency: string;
};

export type DonationSocket = {
  amount: number;
  donator_name: string;
  id: string;
  message: string;
  is_test: boolean;
  is_replay: boolean;
  is_media_share: boolean;
  is_tts: boolean;
  currency: string;
  tts?: string[];
};

export type Withdraw = {
  id: string;
  amount: number;
  created_at: string;
  updated_at: string;
  is_pending: boolean;
  user: {
    id: string;
    name: string;
    username: string;
    email: string;
  };
};

export type Withdraws = Withdraw[];

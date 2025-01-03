export type UpdateAccount = {
  name: string;
  username: string;
  email: string;
  password?: string;
};

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
  level?: number;
  permissions?: string[];
};

// export type RoleDelete = {
//   name: string;
// };

export type SendDonate = {
  donator_name: string;
  donator_email: string;
  message: string;
  payment_method: PaymentMethod;
  amount: number;
};

export type PaymentMethod =
  | "qris"
  | "bca-virtual-account"
  | "permata-virtual-account";

export type MidtransWebhookQrisSettlement = {
  transaction_type: string;
  transaction_time: string;
  transaction_status:
    | "capture"
    | "pending"
    | "settlement"
    | "cancel"
    | "deny"
    | "expire";
  transaction_id: string;
  status_message: string;
  status_code: string;
  signature_key: string;
  settlement_time: string;
  payment_type: string;
  order_id: string;
  merchant_id: string;
  issuer: string;
  gross_amount: string;
  fraud_status: string;
  currency: string;
  acquirer: string;
  shopeepay_reference_number: string;
  reference_id: string;
};

export type UpdateUser = {
  name: string;
  username: string;
  roles: string[];
  email: string;
  balance: number;
};

export type BankCreate = {
  bank: string;
  number: string;
};

export type SendNotificationToCreator = {
  creatorId: string;
  donatorName: string;
  amount: number;
  currency: string;
  message: string;
  id: string;
};
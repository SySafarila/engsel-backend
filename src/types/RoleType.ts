export type StoreParams = {
  name: string;
  level: number;
  permissions: string[];
};

export type StoreResponseSuccess = {
  message: string;
  data: {
    id: number;
    name: string;
    level: number;
    updated_at: Date;
    created_at: Date;
  };
};

export type UpdateParams = {
  name: string;
  new_name?: string;
  new_level?: number;
  new_permissions?: string[];
};

export type UpdateResponseSuccess = {
  message: string;
  data: {
    level: number;
    id: number;
    name: string;
    updated_at: Date;
    created_at: Date;
    permissions: {
      name: string;
    }[];
  };
};

export type DeleteParams = {
  name: string;
};

export type DeleteResponseSuccess = {
  message: string;
};

export type ReadResponseSuccess = {
  message: string;
  data: {
    id: number;
    name: string;
    level: number;
    updated_at: Date;
    created_at: Date;
    permissions: {
      name: string;
    }[];
  }[];
};

export type StoreParams = {
  name: string;
};

export type StoreResponseSuccess = {
  message: string;
  data: {
    id: number;
    name: string;
    created_at: Date;
    updated_at: Date;
  };
};

export type UpdateParams = {
  name: string;
  new_name: string;
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
    updated_at: Date;
    created_at: Date;
  }[];
};

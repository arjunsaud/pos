export type ISTATUS = 'ACTIVE' | 'DISABLED';

export type IFile = {
  id: string;
  name: string;
  path: string;
  filename: string;
  isFeatured: boolean;
  mime: string;
  index?: number;
  description?: string;
};

export enum STATUS_ENUM {
  ACTIVE = 'ACTIVE',
  DISABLED = 'DISABLED',
}

export enum MODE {
  ADD = 'ADD',
  EDIT = 'EDIT',
}

export type FormStatus = boolean;

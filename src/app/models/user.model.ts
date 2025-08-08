export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  companyId: number;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface User {
  id: number;
  email: string;
  userName: string;
  admin: boolean;
  password: string;
  messages:string[],
  createdAt: Date;
  updatedAt?: Date;
}

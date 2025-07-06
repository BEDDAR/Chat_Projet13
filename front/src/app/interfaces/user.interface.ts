import { Contact } from "./contact.interface";

export interface User {
  id: number;
  email: string;
  userName: string;
  admin: boolean;
  password: string;
  contacts:Contact[],
  createdAt: Date;
  updatedAt?: Date;
}

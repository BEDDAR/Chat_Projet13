import { User } from "./user.interface";
import { Message } from './message.interface';
export interface Contact {
  id: number,
  owner: User,
  contactUser: User,
  messages: Message[]
}

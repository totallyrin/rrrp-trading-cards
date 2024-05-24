import { User as DefaultUser } from "next-auth";

interface User extends DefaultUser {
  role: string;
  guild: any;
}

declare module "next-auth" {
  interface Session {
    user: User;
  }
}

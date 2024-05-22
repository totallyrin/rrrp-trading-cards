import { User as DefaultUser } from "next-auth";

interface User extends DefaultUser {
  role: string;
}

declare module "next-auth" {
  interface Session {
    user: User;
  }

  export interface AdapterUser extends User {
    id: string;
    email: string;
    emailVerified: Date | null;
    role: string;
  }
}

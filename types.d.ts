import { User as DefaultUser } from "next-auth";

interface CustomUser extends DefaultUser {
  id: number;
  name: string;
  image: string;
  admin: boolean;
  allowlisted: boolean;
}

declare module "next-auth" {
  interface Session {
    user: CustomUser;
  }
}

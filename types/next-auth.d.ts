import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "STUDENT" | "FORMATEUR" | "ADMIN";
    } & DefaultSession["user"];
  }
}

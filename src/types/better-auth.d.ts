/// <reference types="better-auth" />

declare module "better-auth" {
  interface User {
    role: "ADMIN" | "REGULAR";
  }

  interface Session {
    user: User;
  }
}
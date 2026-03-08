// ensure the original library declarations are loaded so we can augment them
import "better-auth";

// augment the library's types rather than replace them
declare module "better-auth" {
  interface User {
    role: "ADMIN" | "REGULAR";
  }

  interface Session {
    user: User;
  }
}

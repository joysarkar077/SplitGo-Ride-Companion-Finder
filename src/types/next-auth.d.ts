import "next-auth";

declare module "next-auth" {
  interface User {
    user_id?: string;
    username?: string;
    verified?: boolean;
  }

  interface Session {
    user: User & {
      user_id?: string;
      username?: string;
      verified?: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user_id?: string;
    username?: string;
    verified?: boolean;
  }
}

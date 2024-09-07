import NextAuth from "next-auth/next";
import { authOptions } from "./option";

const handerler = NextAuth(authOptions);

export { handerler as GET, handerler as POST };

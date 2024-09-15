import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnection from "@/lib/dbConnection"; // Ensure this is set up for pooling if necessary

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Identifier", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        const connection = await dbConnection();
        try {
          if (!credentials?.identifier || !credentials?.password) {
            throw new Error("Invalid credentials");
          }

          const query =
            "SELECT user_id, username, email, password, verified FROM users WHERE (username = ? OR email = ?) AND verified = 1";
          const [rows]: any[] = await connection.execute(query, [
            credentials.identifier,
            credentials.identifier,
          ]);

          if (rows.length === 0) {
            throw new Error("user not found");
          }

          const user = rows[0];
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordCorrect) {
            throw new Error("Incorrect password");
          }

          // Ensure you return all needed fields
          return {
            id: user.user_id,
            username: user.username, // Assuming 'username' field is used as 'name'
            email: user.email,
            verified: user.verified,
          };
        } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(`Authorization failed: ${error.message}`);
          } else {
            throw new Error("Authorization failed due to an unexpected error");
          }
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username as string;
        token._id = user.id.toString();
        token.verified = user.verified as boolean;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token._id as string;
        session.user.verified = token.verified as boolean;
        session.user.username = token.username as string;
      }
      return session;
    },
  },
};

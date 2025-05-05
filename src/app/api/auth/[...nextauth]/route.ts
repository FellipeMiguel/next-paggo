// pages/api/auth/[...nextauth].ts (ou no local onde o NextAuth é configurado)
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import jwt from "jsonwebtoken";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXTAUTH_SECRET } from "@/config/env";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.id = profile.sub;
        token.email = profile.email;
        token.name = profile.name;
        token.image = profile.image as string;
        token.internalToken = jwt.sign(
          {
            sub: profile.sub,
            email: profile.email,
            name: profile.name,
            image: profile.image,
          },
          NEXTAUTH_SECRET,
          { expiresIn: "1h" }
        );
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        name: token.name,
        email: token.email as string,
        image: token.image as string,
        accessToken: token.internalToken as string,
      };
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
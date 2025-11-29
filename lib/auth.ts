import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });

          if (!user || !user.password) {
            return null;
          }

          const isCorrectPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isCorrectPassword) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            onboardingCompleted: user.onboardingCompleted,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
    CredentialsProvider({
      id: "admin-credentials",
      name: "Admin",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.username || !credentials?.password) {
            return null;
          }

          const admin = await prisma.adminUser.findUnique({
            where: {
              username: credentials.username,
            },
          });

          if (!admin || !admin.isActive || !admin.password) {
            return null;
          }

          const isCorrectPassword = await bcrypt.compare(
            credentials.password,
            admin.password
          );

          if (!isCorrectPassword) {
            return null;
          }

          return {
            id: admin.id,
            email: admin.email || admin.username,
            name: admin.name || admin.username,
            role: "admin",
          };
        } catch (error) {
          console.error("Admin auth error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/login",
    error: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string | null | undefined;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};


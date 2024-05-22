import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";
import { Pool } from "pg";
import PostgresAdapter from "@auth/pg-adapter";
import { Adapter } from "next-auth/adapters";

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  ssl: true,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PostgresAdapter(pool) as Adapter,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    updateAge: 60 * 60 * 24, // 24 hours
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      allowDangerousEmailAccountLinking: true,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: "user",
        };
      },
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID ?? "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET ?? "",
      allowDangerousEmailAccountLinking: true,
      profile(profile) {
        return {
          id: profile.id,
          name: profile.username,
          email: profile.email,
          image: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`,
          role: "user",
        };
      },
    }),
  ],
  callbacks: {
    session({ session, user }) {
      session.user.role = user?.role ?? "user";
      return session;
    },
  },
});

export { handler as POST, handler as GET };

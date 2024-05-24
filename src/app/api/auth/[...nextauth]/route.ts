import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { Pool } from "pg";
import PostgresAdapter from "@auth/pg-adapter";
import { Adapter } from "next-auth/adapters";
import { sql } from "@vercel/postgres";
import { getUserGuild } from "@/utils/api";

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
  // pages: {
  //   signIn: "/auth/signin",
  // },
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID ?? "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET ?? "",
      authorization: process.env.DISCORD_URL ?? "",
      allowDangerousEmailAccountLinking: true,
      profile(profile) {
        return {
          ...profile,
          id: profile.id,
          name: profile.username,
          image: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`,
          role: "user",
          guild: {},
        };
      },
    }),
  ],
  callbacks: {
    async session({ session }) {
      const role =
        await sql`SELECT role FROM users WHERE name = ${session.user.name}`;
      session.user.role = role?.rows[0]?.role ?? "user";
      const userId =
        await sql`SELECT id FROM users WHERE name = ${session.user.name}`;
      const token =
        await sql`SELECT access_token, "providerAccountId" FROM accounts WHERE "userId" = ${userId.rows[0]?.id}`.then();
      getUserGuild(token?.rows[0]?.access_token).then((guild) => {
        session.user.guild = guild;
        console.log(guild);
      });
      return session;
    },
  },
});

export { handler as POST, handler as GET };

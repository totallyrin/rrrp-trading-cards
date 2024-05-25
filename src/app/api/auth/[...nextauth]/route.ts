import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { Pool } from "pg";
import PostgresAdapter from "@auth/pg-adapter";
import { Adapter } from "next-auth/adapters";
import { sql } from "@vercel/postgres";
import { DiscordProfile, DiscordUser } from "@/utils/types";
import { CustomUser } from "../../../../../types";

const guildId = "821379192092229672";
const roles = {
  allowlisted: "1124039992696655953",
  super_admin: "1119433578095333376",
};

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
      userinfo: `https://discord.com/api/users/@me/guilds/${guildId}/member`,
      profile(profile) {
        return {
          // ...profile,
          id: profile.user.id,
          name: profile.user.username,
          image: `https://cdn.discordapp.com/avatars/${profile.user.id}/${profile.user.avatar}.png`,
          role: "user",
          allowlisted: profile.roles.includes(roles.allowlisted),
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      if (!profile || !(profile as DiscordProfile)?.user) return false;
      try {
        const allowlisted = (profile as DiscordProfile).roles.includes(
          roles.allowlisted,
        );
        const avatar = `https://cdn.discordapp.com/avatars/${((profile as DiscordProfile).user as DiscordUser).id}/${((profile as DiscordProfile).user as DiscordUser).avatar}.png`;
        await sql`
        INSERT INTO users (name, image, role, allowlisted)
        VALUES (${((profile as DiscordProfile).user as DiscordUser).username}, ${avatar}, ${"user"}, ${allowlisted})
        ON CONFLICT (name) DO UPDATE SET image = ${avatar}, allowlisted = ${allowlisted}
        `;
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    async session({ session }) {
      const user =
        await sql`SELECT * FROM users WHERE name = ${session.user.name}`;
      session.user = user.rows[0] as CustomUser;
      return session;
    },
  },
});

export { handler as POST, handler as GET };

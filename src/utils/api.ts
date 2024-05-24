export async function getUserGuild(token: string) {
  return await fetch(
    "https://discord.com/api/users/@me/guilds/821379192092229672/member",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
}

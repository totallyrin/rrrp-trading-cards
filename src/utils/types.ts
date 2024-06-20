export type Card = {
  name: string;
  pronouns: string | undefined;
  strength: number;
  comedic_timing: number;
  dirty_minded: number;
  accident_prone: number;
  rizz: number;
  serving_cunt: number;
  image: string | undefined;
  newimage?: string | undefined;
  id: number;
  residence: string | undefined;
  occupation: string | undefined;
  quote: string | undefined;
  special_interest: string | undefined;
  owner: string | undefined;
};

export type DiscordUser = {
  id: string;
  username: string;
  avatar: string;
};

export type DiscordProfile = {
  joined_at: string | undefined;
  nick: string | undefined;
  roles: string[];
  user: DiscordUser;
  bio: string | undefined;
};

export type User = {
  id: number;
  name: string;
  image: string;
  admin: boolean;
  allowlisted: boolean;
};

export type VerifyImage = {
  id: number;
  user: string;
  character: string;
  image: string;
};

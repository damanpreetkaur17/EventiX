import type { UserModel as User } from "../../generated/prisma/models.js";

export interface PublicUser {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  provider: string;
  createdAt: string;
}

export function publicUser(user: User): PublicUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
    provider: user.provider,
    createdAt: user.createdAt.toISOString(),
  };
}

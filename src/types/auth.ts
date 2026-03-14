export type UserRole = "viewer" | "admin";

export type AuthUser = {
  id: number;
  username: string;
  role: UserRole;
};

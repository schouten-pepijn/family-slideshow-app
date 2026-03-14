import type { AuthUser, UserRole } from "../types/auth";

type MockUser = {
  id: number;
  username: string;
  password: string;
  role: UserRole;
};

const mockUsers: MockUser[] = [
  {
    id: 1,
    username: "admin",
    password: "admin123",
    role: "admin",
  },
  {
    id: 2,
    username: "viewer",
    password: "viewer123",
    role: "viewer",
  },
];

let currentUser: AuthUser | null = null;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function login(
  username: string,
  password: string,
): Promise<AuthUser> {
  await wait(200); // Simulate network delay

  const user = mockUsers.find(
    (item) => item.username === username && item.password === password,
  );

  if (!user) throw new Error("Invalid username or password");

  currentUser = {
    id: user.id,
    username: user.username,
    role: user.role,
  };

  return currentUser;
}

export async function logout(): Promise<void> {
  await wait(200); // Simulate network delay
  currentUser = null;
}

export async function fetchCurrentUser(): Promise<AuthUser | null> {
  await wait(200); // Simulate network delay
  return currentUser;
}

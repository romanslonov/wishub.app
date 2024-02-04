import { Argon2id } from "oslo/password";

export function hashPassword(password: string) {
  return new Argon2id().hash(password);
}

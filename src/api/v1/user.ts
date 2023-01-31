import { User } from "../../../schemas/user";
import { UserValidationResult } from "../../validateUser";

// const resultToString = async (res: Response) =>
//   res.status === 200 ? "" : (await res.text()) ?? `Error ${res.status}`;

export const register = async (
  facialId: string,
  name: string,
  email: string,
) => {
  const res = await fetch("/api/v1/user/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      facialId,
      name,
      email,
    }),
  });

  return parseInt(await res.text()) as UserValidationResult;
};

export const apiLogin = async (facialId: string) => {
  const res = await fetch("/api/v1/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      facialId,
    }),
  });

  return res.status;
};

export const apiLogout = async () => {
  const res = await fetch("/api/v1/user/logout", {
    method: "POST",
  });

  return res.status;
};

export const apiCurrentUser = async () => {
  const res = await fetch("/api/v1/user/currentUser", { method: "POST" });
  return res.status === 200 ? ((await res.json()) as User) : null;
};


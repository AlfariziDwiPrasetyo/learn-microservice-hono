import { Hono } from "hono";
import { db } from "./config/db";

const app = new Hono();

db.run(`CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT UNIQUE NOT NULL,
  bio TEXT NOT NULL
)`);

app.get("/", (c) => {
  return c.text("User Service");
});

app.post("/user/create", async (c) => {
  const { id, email, name }: { id: string; email: string; name: string } =
    await c.req.json();

  try {
    db.run("INSERT INTO users (id, email, name, bio) VALUES (?, ?, ?, ?)", [
      id,
      email,
      name,
      "",
    ]);
    return c.json({ message: "User profile created" });
  } catch (err) {
    return c.json({ error: "Failed to register user" }, 500);
  }
});

app.get("/user/me", async (c) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  try {
    const response = await fetch("http://service-auth:4000/auth/validate", {
      method: "GET",
      headers: { Authorization: authHeader },
    });

    if (!response.ok) {
      throw new Error("Unauthorized");
    }

    const account = await response.json();

    const user = db
      .query("SELECT * FROM users WHERE id = ?")
      .get(account.user.id);

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    return c.json(user);
  } catch (err) {
    return c.json(
      {
        error: err instanceof Error ? err.message : "Failed to validate user",
      },
      401
    );
  }
});

export default {
  port: process.env.PORT,
  fetch: app.fetch,
};

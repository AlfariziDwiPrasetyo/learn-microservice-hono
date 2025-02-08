import { Hono } from "hono";
import { jwt } from "hono/jwt";
import { sign } from "jsonwebtoken";
import { db } from "./config/db";

const app = new Hono();

db.run(`CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
)`);

if (!process.env.secret_key) {
  throw new Error("SECRET_KEY is not defined in environment variables");
}

const SECRET_KEY: string = process.env.secret_key; // Ganti dengan env

interface User {
  id: string;
  email: string;
  password: string;
}

app.get("/", (c) => {
  return c.text("Auth service");
});

// Register User
app.post("/auth/register", async (c) => {
  const { email, password }: { email: string; password: string } =
    await c.req.json();
  console.log(email, password);
  const hashedPassword = await Bun.password.hash(password, {
    algorithm: "bcrypt",
    cost: 4,
  });

  try {
    db.run("INSERT INTO users (id, email, password) VALUES (?, ?, ?)", [
      crypto.randomUUID(),
      email,
      hashedPassword,
    ]);
    return c.json({ message: "User registered successfully" });
  } catch (err) {
    return c.json({ error: "Email already exists" }, 400);
  }
});

// Login User
app.post("/auth/login", async (c) => {
  const { email, password }: { email: string; password: string } =
    await c.req.json();

  const user = db
    .query("SELECT * FROM users WHERE email = ?")
    .get(email) as User | null;

  if (!user) return c.json({ error: "Invalid credentials" }, 401);

  const validPassword = await Bun.password.verify(password, user.password);
  if (!validPassword) return c.json({ error: "Invalid credentials" }, 401);

  const token = sign({ id: user.id, email: user.email }, SECRET_KEY, {
    expiresIn: "1h",
  });
  return c.json({ token });
});

// Middleware untuk validasi JWT
const authMiddleware = jwt({ secret: SECRET_KEY });

// Validasi token
app.get("/auth/validate", authMiddleware, async (c) => {
  return c.json({ user: c.get("jwtPayload") });
});

export default {
  port: process.env.port,
  fetch: app.fetch,
};
console.log(`Auth service running on ${process.env.port} `);

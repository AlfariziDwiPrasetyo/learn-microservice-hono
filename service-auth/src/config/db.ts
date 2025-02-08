import { Database } from "bun:sqlite";

export const db = new Database("auth.db");

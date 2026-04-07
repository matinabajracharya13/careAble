import type { Knex } from "knex";
import dotenv from "dotenv";

dotenv.config();

const config: { [key: string]: Knex.Config } = {
  local: {
    client: "better-sqlite3",
    connection: {
      filename: "./dev.sqlite3",
    },
    useNullAsDefault: true, // required for SQLite
    migrations: {
      directory: "./migrations",
      extension: "ts",
    }
  },
  development: {
    client: "mysql2", // swap to 'pg' for PostgreSQL, 'better-sqlite3' for SQLite
    connection: {
      host: process.env.DB_HOST || "127.0.0.1",
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "your_database",
    },
    migrations: {
      directory: "./migrations",
      extension: "ts",
    },
  },

  production: {
    client: "mysql2",
    connection: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    migrations: {
      directory: "./migrations",
      extension: "ts",
    },
    pool: { min: 2, max: 10 },
  },
};

export default config;

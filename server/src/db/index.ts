import knex from "knex";
import knexConfig from "./../config/knexfile";

const env = process.env.NODE_ENV || "development";

// 👇 handle both ES + CommonJS
const config = (knexConfig as any).default || knexConfig;

const db = knex(config[env]);

export default db;
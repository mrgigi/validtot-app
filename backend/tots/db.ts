import { SQLDatabase } from "encore.dev/storage/sqldb";

export const totsDB = new SQLDatabase("tots", {
  migrations: "./migrations",
});

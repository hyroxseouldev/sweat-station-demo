import { config } from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

// Load environment variables
config({ path: ".env.local" });

// Create connection
const sql = neon(process.env.DATABASE_URL!);

// Create drizzle instance
export const db = drizzle(sql, { schema });

// Export schema for use in other files
export { schema };

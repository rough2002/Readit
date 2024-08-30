//postgresql://postgres.qxmsaxwgwhokjqjofpqy:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
import pg from "pg";
const { Client } = pg;

// Replace 'your_postgres_connection_string' with your actual PostgreSQL connection string
const connectionString = `postgresql://postgres.qxmsaxwgwhokjqjofpqy:${
  process.env.DB_PASSWORD as String
}@aws-0-ap-south-1.pooler.supabase.com:6543/postgres`;

export const client = new Client({
  connectionString: connectionString,
});

(async function connect() {
  try {
    await client.connect();
    // console.log(await client.query("select * from users"));
    console.log("Connected to PostgreSQL database");
  } catch (err) {
    console.error("Error connecting to PostgreSQL database:", err);
  }
})();

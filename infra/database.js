import { Client } from "pg";

async function query(queryObject) {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSLConfig(),
  });

  try {
    await client.connect();
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    console.error(error);
  } finally {
    await client.end();
  }

}

export default {
  query,
};

function getSSLConfig() {
  if (process.env.CA) {
    return {
      rejectUnauthorized: true,
      ca: process.env.CA,
    };
  }
  // The actual Subapase configuration isn't requiring SSL in production.
  return process.env.NODE_ENV === "development" ? false : true;
}
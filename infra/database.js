import { Client } from "pg";

async function query(queryObject) {
  let client;

  try {
    client = await getNewClient();
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    console.error(error);
  } finally {
    await client.end();
  }

}

async function getNewClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSLConfig(),
  });

  await client.connect();
  return client;
}

export default {
  getNewClient,
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
  return process.env.NODE_ENV === "production" ? true : false;
}
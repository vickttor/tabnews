import database from "../../../../infra/database.js"

export default async function onRequest(request, response) {
  const result = await database.query('SELECT 1 + 1 as sum;')
  console.log(result.rows);
  response.status(200).json({
    message: "Endpoint de Status"
  })
}
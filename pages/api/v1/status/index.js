export default function onRequest(request, response) {
  response.status(200).json({
    message: "Endpoint de Status"
  })
}
const WebSocket = require('ws')
const http = require('http')
const { setupWSConnection } = require('y-websocket/bin/utils')

const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 1234

const server = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.end('okay')
})

const wss = new WebSocket.Server({ server })

wss.on('connection', (ws, req) => {
  console.log('New WebSocket connection from:', req.url)
  setupWSConnection(ws, req)
})

wss.on('error', (error) => {
  console.error('WebSocket server error:', error)
})

server.listen(port, host, () => {
  console.log(`WebSocket server running on ws://${host}:${port}`)
  console.log('Ready for collaborative editing!')
})

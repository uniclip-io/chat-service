import http from 'http'
import * as WebSocket from 'ws'

const server = http.createServer()
const wss = new WebSocket.Server({ server })

wss.on('connection', (ws: WebSocket) => {
	ws.on('message', (message: string) => {
		console.log(JSON.parse(message))

		wss.clients.forEach(client => {
			if (client.readyState && client != ws) {
				client.send(message)
			}
		})
	})
})

server.listen(8000, () => console.log('Started!'))

import http from 'http'
import * as WebSocket from 'ws'

const server = http.createServer()
const wss = new WebSocket.Server({ server })

wss.on('connection', (ws: WebSocket) => {
	ws.send('Hi there, I am a WebSocket server')

	ws.on('message', (message: string) => {
		console.log(message.toString())

		wss.clients.forEach(client => {
			if (client.readyState && client != ws) {
				client.send(message)
			}
		})
	})
})

server.listen(8000, '192.168.0.200', () => console.log('Started!'))

import http from 'http'
import * as WebSocket from 'ws'
import amqp from 'amqplib'

const clipboardQueue = 'clipboard-queue'
const clipboardMessage = 'clipboard-message'

const main = async () => {
	const connection = await amqp.connect('amqp://localhost')
	const channel = await connection.createChannel()

	await channel.assertQueue(clipboardQueue)

	const server = http.createServer()
	const wss = new WebSocket.Server({ server })

	wss.on('connection', (ws: WebSocket) => {
		ws.on('message', (message: string) => {
			console.log(JSON.parse(message))

			wss.clients.forEach(async client => {
				if (client.readyState && client != ws) {
					channel.publish(clipboardMessage, 'clipboard', Buffer.from(message))
					client.send(message)
				}
			})
		})
	})

	server.listen(8000)
}

main()

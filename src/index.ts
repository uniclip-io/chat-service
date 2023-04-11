import http from 'http'
import * as WebSocket from 'ws'
import amqp from 'amqplib'
import Clipboard from './types/clipboard'
import { File } from './types/clipboard'

const clipboardQueue = 'clipboard-queue'
const clipboardExchange = 'clipboard-message'

const main = async () => {
	const connection = await amqp.connect('amqp://localhost')
	const channel = await connection.createChannel()
	await channel.assertQueue(clipboardQueue)
	await channel.assertExchange(clipboardExchange, 'topic')

	const server = http.createServer()
	const wss = new WebSocket.Server({ server })

	wss.on('connection', (ws: WebSocket) => {
		ws.on('message', (message: string) => {
			const clipboard = JSON.parse(message) as Clipboard

			const { type, content } = clipboard
			const dto = {
				type,
				content: type === 'text' ? content : (content as File).contentId
			}
			const buffer = Buffer.from(JSON.stringify(dto))
			channel.publish(clipboardExchange, 'clipboard', buffer)

			wss.clients.forEach(async client => {
				if (client.readyState && client != ws) {
					client.send(message)
				}
			})
		})
	})

	server.listen(8000, '192.168.0.200', () => console.log('Started!'))
}

main()

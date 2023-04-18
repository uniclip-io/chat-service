import express from 'express'
import addWsRoute from 'express-ws'
import { ExpressWebSocket } from './global'
import amqp from 'amqplib'
import Record from './types/record'
import Client from './types/client'

const clipboardQueue = 'clipboard-queue'

const app = express() as ExpressWebSocket
const wss = addWsRoute(app).getWss()
app.use(express.json())

const clients: Client[] = []

const main = async () => {
	const { RABBITMQ_USERNAME, RABBITMQ_PASSWORD, RABBITMQ_HOSTNAME } = process.env
	const uri = `amqps://${RABBITMQ_USERNAME}:${RABBITMQ_PASSWORD}@${RABBITMQ_HOSTNAME}`
	const connection = await amqp.connect(uri)

	const channel = await connection.createChannel()
	await channel.assertQueue(clipboardQueue)

	channel.consume(clipboardQueue, message => {
		if (message.fields.routingKey === 'record.created') {
			const raw = message.content.toString()
			const record = JSON.parse(raw) as Record
			console.log(record)

			const sender = '3fa85f64-5717-4562-b3fc-2c963f66afa6' // TODO - record.userId

			for (const client of clients) {
				if (client.id === sender) {
					client.socket.send(raw)
				}
			}
			channel.ack(message)
		}
	})

	app.ws('/:id', (ws, req) => {
		console.log('New connection:', req.params.id)
		clients.push({
			id: req.params.id,
			socket: ws
		})
	})

	app.listen(8000, () => console.log('Started!'))
}

main()

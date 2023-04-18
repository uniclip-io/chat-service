import http from 'http'
import * as WebSocket from 'ws'
import amqp from 'amqplib'

const clipboardQueue = 'clipboard-queue'

const main = async () => {
	const { RABBITMQ_USERNAME, RABBITMQ_PASSWORD, RABBITMQ_HOSTNAME } = process.env
	const uri = `amqps://${RABBITMQ_USERNAME}:${RABBITMQ_PASSWORD}@${RABBITMQ_HOSTNAME}`
	const connection = await amqp.connect(uri)

	const channel = await connection.createChannel()
	await channel.assertQueue(clipboardQueue)

	const server = http.createServer()
	const wss = new WebSocket.Server({ server })

	channel.consume(clipboardQueue, message => {
		if (message.fields.routingKey === 'record.created') {
			console.log(JSON.parse(message.content.toString()))

			for (const client of wss.clients) {
				client.send(message.content.toString())
			}
			channel.ack(message)
		}
	})

	server.listen(8000, () => console.log('Started!'))
}

main()

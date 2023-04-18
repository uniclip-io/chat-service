import { WebSocket } from 'ws'

export default interface Client {
	id: string
	socket: WebSocket
}

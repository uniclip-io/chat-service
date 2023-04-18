import { Express } from 'express-serve-static-core'
import { WithWebsocketMethod } from 'express-ws'

export type ExpressWebSocket = Express & WithWebsocketMethod

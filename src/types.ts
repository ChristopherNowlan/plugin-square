import type { Payload } from 'payload'
import type { Config as PayloadConfig } from 'payload/config'
import type {Client } from "square";

export type SquareWebhookHandler<T = any> = (args: {
  config: PayloadConfig
  event: T
  payload: Payload
  square: Client
  squareConfig?: SquareConfig
}) => void

export interface SquareWebhookHandlers {
  [webhookName: string]: SquareWebhookHandler
}


export interface FieldSyncConfig {
  fieldPath: string
  squareProperty: string
}
// @todo update this for square
export interface SyncConfig {
  collection: string
  fields: FieldSyncConfig[]
  squareResourceType: 'customersApi' | 'catalogApi' | 'ordersApi'
  squareResourceTypeSingular: 'customer' | 'catalog' | 'order' // TODO: there must be a better way to do this // use webhooks
}



export interface SquareConfig {
  isTestKey?: boolean
  logs?: boolean
  squareAccessToken: string
  squareEnvironment:  'Production' |
    'Sandbox' |
    'Custom'
  sync?: SyncConfig[]
  webhooks?: SquareWebhookHandler | SquareWebhookHandlers
}

export type SanitizedSquareConfig = SquareConfig & {
  sync: SyncConfig[] // convert to required
}


export type SquareProxy = (args: {
  squareArgs: any[]
  squareMethod: string
  squareAccessToken: string
  squareEnvironment:  'Production' |
  'Sandbox' |
  'Custom'
}) => Promise<{
  data?: any
  message?: string
  status: number
}>

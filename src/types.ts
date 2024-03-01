import type { Payload } from 'payload'
import type { Config as PayloadConfig } from 'payload/config'
import type {WebhooksHelper} from "square";

export interface PluginTypes {
  /**
   * Enable or disable plugin
   * @default false
   */
  enabled?: boolean
}

export type SquareWebhookHandler<T = any> = (args: {
  config: PayloadConfig
  event: T
  payload: Payload
  square: WebhooksHelper
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
  squareResourceTypeSingular: 'customer'  // TODO: there must be a better way to do this // use webhooks
}



export interface SquareConfig {
  isTestKey?: boolean
  logs?: boolean
  squareAccessToken: string
  squareWebhooksEndpointSecret?: string
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

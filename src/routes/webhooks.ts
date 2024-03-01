import type { Response } from 'express'
import type { Config as PayloadConfig } from 'payload/config'
import type { PayloadRequest } from 'payload/dist/types'

import {Client, WebhooksHelper} from 'square'

import type { SquareConfig } from '../types'

import { handleWebhooks } from '../webhooks'

export const squareWebhooks = async (args: {
  config: PayloadConfig
  next: any
  req: PayloadRequest
  res: Response
  squareConfig: SquareConfig
}): Promise<any> => {
  const { config, req, res, squareConfig } = args

  const { squareAccessToken, squareWebhooksEndpointSecret, webhooks } = squareConfig

  if (squareWebhooksEndpointSecret) {
    const square = new Client({
      bearerAuthCredentials: {
        accessToken: squareAccessToken || ''
      },
    })



    const squareSignature = ''

    if (squareSignature) {
      let event: WebhooksHelper | undefined

      try {

        event = WebhooksHelper.isValidWebhookEventSignature(
          req.body,
          squareSignature,
          squareWebhooksEndpointSecret,
          ''
        )

      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : err
        req.payload.logger.error(`Error constructing Square event: ${msg}`)
        res.status(400)
      }

      if (event) {
        handleWebhooks({
          config,
          event,
          payload: req.payload,
          square,
          squareConfig,
        })

        // Fire external webhook handlers if they exist
        if (typeof webhooks === 'function') {
          webhooks({
            config,
            event,
            payload: req.payload,
            square,
            squareConfig,
          })
        }

        if (typeof webhooks === 'object') {
          const webhookEventHandler = webhooks[event.type]
          if (typeof webhookEventHandler === 'function') {
            webhookEventHandler({
              config,
              event,
              payload: req.payload,
              square,
              squareConfig,
            })
          }
        }
      }
    }
  }

  res.json({ received: true })
}

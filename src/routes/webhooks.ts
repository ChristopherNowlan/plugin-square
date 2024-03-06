import type {Response} from 'express'
import type {Config as PayloadConfig} from 'payload/config'
import type {PayloadRequest} from 'payload/dist/types'

import {Client, Environment, Event} from 'square'

import type {SquareConfig} from '../types'

import {handleWebhooks} from '../webhooks'
import {isFromSquare} from "../utilities/isFromSquare";

export const squareWebhooks = async (args: {
  config: PayloadConfig
  next: any
  req: PayloadRequest
  res: Response
  squareConfig: SquareConfig
}): Promise<any> => {
  const { config, req, res, squareConfig } = args

  const { squareAccessToken,squareEnvironment, webhooks } = squareConfig
  const squareSignature = req.headers['x-square-hmacsha256-signature']

  // Need to test
  if (isFromSquare(req.body, squareSignature as string )) {
    const square = new Client({
      bearerAuthCredentials: {
        accessToken: squareAccessToken || ''
      },
      environment: Environment[squareEnvironment]
    })


    if (squareSignature) {
      let event: Event | undefined

      try {

        // Not sure if this correct
        event = JSON.parse(req.body)


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

       //  Fire external webhook handlers if they exist
        if (typeof webhooks === 'function') {
          webhooks({
            config,
            event,
            payload: req.payload,
            square,
            squareConfig,
          })
        }

        if (typeof webhooks === 'object' && event.type) {
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

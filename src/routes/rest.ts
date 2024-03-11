import type { Response } from 'express'
import type { PayloadRequest } from 'payload/types'

import { Forbidden } from 'payload/errors'

import type { SquareConfig } from '../types'

import { squareProxy } from '../utilities/squareProxy'

export const squareREST = async (args: {
  next: any
  req: PayloadRequest
  res: Response
  squareConfig: SquareConfig
}): Promise<any> => {
  const { req, res, squareConfig } = args

  const {
    body: {
      squareArgs, // example: ['cus_MGgt3Tuj3D66f2'] or [{ limit: 100 }, { squareAccount: 'acct_1J9Z4pKZ4Z4Z4Z4Z' }]
      squareMethod, // example: 'subscriptions.list',
    },
    payload,
    user,
  } = req

  const { squareAccessToken, squareEnvironment, squareIdempotencyKey } = squareConfig

  try {
    if (!user) {
      // TODO: make this customizable from the config
      throw new Forbidden()
    }

    const pluginRes = await squareProxy({
      squareArgs,
      squareMethod,
      squareAccessToken,
      squareEnvironment,
      squareIdempotencyKey,
    })

    const { status } = pluginRes

    res.status(status).json(pluginRes)
  } catch (error: unknown) {
    const message = `An error has occurred in the Square plugin REST handler: '${error}'`
    payload.logger.error(message)
    return res.status(500).json({
      message,
    })
  }
}

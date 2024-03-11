import lodashGet from 'lodash.get'
import {Client, Environment} from 'square'

import type { SquareProxy } from '../types'

// @TODO only need if I use rest
export const squareProxy: SquareProxy = async ({ squareArgs, squareMethod, squareAccessToken, squareEnvironment, squareIdempotencyKey}) => {
  const square = new Client({
      bearerAuthCredentials: {
        accessToken: squareAccessToken || ''
      },
      squareVersion: '',
      environment: Environment[squareEnvironment],
      // customUrl: ''

    }

  )

  if (typeof squareMethod === 'string') {
    const topLevelMethod = squareMethod.split('.')[0] as keyof Client
    const contextToBind = square[topLevelMethod]
    // NOTE: 'lodashGet' uses dot notation to get the property of an object
    // NOTE: Square API methods using reference "this" within their functions, so we need to bind context
    const foundMethod = lodashGet(square, squareMethod).bind(contextToBind)

    if (typeof foundMethod === 'function') {
      if (Array.isArray(squareArgs)) {
        try {
          const squareResponse = await foundMethod(...squareArgs)
          return {
            data: squareResponse,
            status: 200,
          }
        } catch (error: unknown) {
          return {
            message: `A Square API error has occurred: ${error}`,
            status: 404,
          }
        }
      } else {
        throw new Error(`Argument 'squareArgs' must be an array.`)
      }
    } else {
      throw Error(
        `The provided Square method of '${squareMethod}' is not a part of the Square API.`,
      )
    }
  } else {
    throw Error('You must provide a Square method to call.')
  }
}

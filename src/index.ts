import type {Config, Endpoint} from 'payload/config'
import type {PayloadRequest} from "payload/types";
import type {NextFunction, Response} from 'express'
import express from 'express'

import type { SanitizedSquareConfig, SquareConfig } from './types'

import { extendWebpackConfig } from './extendWebpackConfig'
import { getFields } from './fields/getFields'
import { createNewInSquare } from './hooks/createNewInSquare'
import { deleteFromSquare } from './hooks/deleteFromSquare'
import { syncExistingWithSquare } from './hooks/syncExistingWithSquare'
import { squareWebhooks } from './routes/webhooks'
import {squareREST} from "./routes/rest";


const squarePlugin =
  (incomingSquareConfig: SquareConfig) =>
    (config: Config): Config => {
      const { collections } = config

      // set config defaults here
      const squareConfig: SanitizedSquareConfig = {
        ...incomingSquareConfig,
        rest: incomingSquareConfig?.rest ?? true,
        sync: incomingSquareConfig?.sync || [],
      }

      // NOTE: env variables are never passed to the client, but we need to know if `squareSecretKey` is a test key
      // unfortunately we must set the 'isTestKey' property on the config instead of using the following code:
      // const isTestKey = squareConfig.squareSecretKey?.startsWith('sk_test_');

      return {
        ...config,
        admin: {
          ...config.admin,
          webpack: extendWebpackConfig(config),
        },
        collections: collections?.map((collection) => {
          const { hooks: existingHooks } = collection

          const syncConfig = squareConfig.sync?.find((sync) => sync.collection === collection.slug)

          if (syncConfig) {
            const fields = getFields({
              collection,
              squareConfig,
              syncConfig,
            })
            return {
              ...collection,
              fields,
              hooks: {
                ...collection.hooks,
                afterDelete: [
                  ...(existingHooks?.afterDelete || []),
                  (args) =>
                    deleteFromSquare({
                      ...args,
                      collection,
                      squareConfig,
                    }),
                ],
                beforeChange: [
                  ...(existingHooks?.beforeChange || []),
                  (args) =>
                    syncExistingWithSquare({
                      ...args,
                      collection,
                      squareConfig,
                    }),
                ],
                beforeValidate: [
                  ...(existingHooks?.beforeValidate || []),
                  (args) =>
                    createNewInSquare({
                      ...args,
                      collection,
                      squareConfig,
                    }),
                ],
              },
            }
          }

          return collection
        }),
        endpoints: [
          ...(config?.endpoints || []),
          {
            handler: [
              express.raw({ type: 'application/json' }),
              async (req, res, next) => {
                await squareWebhooks({
                  config,
                  next,
                  req,
                  res,
                  squareConfig,
                })
              },
            ],
            method: 'get',
            path: '/square/webhooks',
            root: true,
          },
          ...(incomingSquareConfig?.rest
            ? [
              {
                handler: async (req: PayloadRequest, res: Response, next: NextFunction) => {
                  await squareREST({
                    next,
                    req,
                    res,
                    squareConfig,
                  })
                },
                method: 'post' as Endpoint['method'],
                path: '/square/rest',
              },
            ]
            : []),
        ],
      }
    }

export default squarePlugin

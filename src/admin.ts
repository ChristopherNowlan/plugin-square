import type { Config } from 'payload/config'

import type { SanitizedSquareConfig, SquareConfig } from './types'

import { getFields } from './fields/getFields'

const squarePlugin =
  (incomingSquareConfig: SquareConfig) =>
    (config: Config): Config => {
      const { collections } = config

      // set config defaults here
      const squareConfig: SanitizedSquareConfig = {
        ...incomingSquareConfig,
        sync: incomingSquareConfig?.sync || [],
      }

      // NOTE: env variables are never passed to the client, but we need to know if `squareSecretKey` is a test key
      // unfortunately we must set the 'isTestKey' property on the config instead of using the following code:
      // const isTestKey = squareConfig.squareSecretKey?.startsWith('sk_test_');

      return {
        ...config,
        collections: collections?.map((collection) => {
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
            }
          }

          return collection
        }),
      }
    }

export default squarePlugin

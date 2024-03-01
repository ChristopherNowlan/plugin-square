import {CollectionAfterDeleteHook, CollectionConfig} from "payload/types";
import {APIError} from 'payload/errors'
import {Client, Environment} from "square";

import type {SquareConfig} from '../types'

const squareAccessToken = process.env.SQUARE_ACCESS_TOKEN
const squareEnvironment = process.env.SQUARE_EVIRONMENT

const square = new Client({
  bearerAuthCredentials: {
    accessToken: squareAccessToken || ''
  },
  environment: squareEnvironment ? Environment[squareEnvironment as keyof typeof Environment] : Environment.Sandbox
})
type HookArgsWithCustomCollection = Omit<Parameters<CollectionAfterDeleteHook>[0], 'collection'> & {
  collection: CollectionConfig
}

export type CollectionAfterDeleteHookWithArgs = (
  args: HookArgsWithCustomCollection & {
    collection?: CollectionConfig
    squareConfig?: SquareConfig
  },
) => void

export const deleteFromSquare: CollectionAfterDeleteHookWithArgs = async (args) => {
  const {collection, doc, req, squareConfig} = args

  const {logs, sync} = squareConfig || {}

  const {payload} = req
  const {slug: collectionSlug} = collection || {}

  if (logs)
    payload.logger.info(
      `Document with ID: '${doc?.id}' in collection: '${collectionSlug}' has been deleted, deleting from Square...`,
    )

  if (process.env.NODE_ENV !== 'test') {
    if (logs) payload.logger.info(`- Deleting Square document with ID: '${doc.squareID}'...`)

    const syncConfig = sync?.find((conf) => conf.collection === collectionSlug)

    if (syncConfig) {
      try {

        let found
        // Has to be a better way
        switch (syncConfig.squareResourceType ) {
          // case 'ordersApi' :
          //   found = await square?.[syncConfig.squareResourceType]?.retrieveOrder(doc.squareID)
          //   break
          case 'customersApi':
            found = await square?.[syncConfig.squareResourceType]?.retrieveCustomer(doc.squareID)
            break
          default:
            break

        }

        // @TODO extend past delete customer
        if (found) {
          switch (syncConfig.squareResourceType ) {
            case 'customersApi':
              await square?.[syncConfig.squareResourceType]?.deleteCustomer(doc.squareID)
              break
            default:
              break
          }

          if (logs)
            payload.logger.info(
              `✅ Successfully deleted Square document with ID: '${doc.squareID}'.`,
            )
        } else {
          if (logs)
            payload.logger.info(
              `- Square document with ID: '${doc.squareID}' not found, skipping...`,
            )
        }
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : error
        throw new APIError(`Failed to delete Square document with ID: '${doc.squareID}': ${msg}`)
      }
    }
  }
}

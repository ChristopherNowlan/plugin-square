import {
  CollectionBeforeChangeHook,
  CollectionConfig
} from "payload/types";
import {APIError} from 'payload/errors'
import {Client, Environment} from "square";

import type {SquareConfig} from '../types'
import {deepen} from "../utilities/deepen";

const squareAccessToken = process.env.SQUARE_ACCESS_TOKEN

const square = new Client({
  bearerAuthCredentials: {
    accessToken: squareAccessToken || ''
  },
})
type HookArgsWithCustomCollection = Omit<
  Parameters<CollectionBeforeChangeHook>[0],
  'collection'
> & {
  collection: CollectionConfig
}

export type CollectionBeforeChangeHookWithArgs = (
  args: HookArgsWithCustomCollection & {
    collection?: CollectionConfig
    squareConfig?: SquareConfig
  },
) => void

export const syncExistingWithSquare: CollectionBeforeChangeHookWithArgs = async (args) => {
  const {collection, data, operation, originalDoc, req, squareConfig} = args

  const {logs, sync} = squareConfig || {}

  const {payload} = req

  const {slug: collectionSlug} = collection || {}

  if (process.env.NODE_ENV !== 'test' && !data.skipSync) {
    const syncConfig = sync?.find((conf) => conf.collection === collectionSlug)

    if (syncConfig) {
      if (operation === 'update') {
        // combine all fields of this object and match their respective values within the document
        let syncedFields = syncConfig.fields.reduce(
          (acc, field) => {
            const {fieldPath, squareProperty} = field

            acc[squareProperty] = data[fieldPath]
            return acc
          },
          {} as Record<string, any>,
        )

        syncedFields = deepen(syncedFields)

        if (logs)
          payload.logger.info(
            `A '${collectionSlug}' document has changed in Payload with ID: '${originalDoc?._id}', syncing with Square...`,
          )

        if (!data.squareID) {
          // NOTE: the "beforeValidate" hook populates this
          if (logs) payload.logger.error(`- There is no Square ID for this document, skipping.`)
        } else {
          if (logs)
            payload.logger.info(`- Syncing to Square resource with ID: '${data.squareID}'...`)

          try {

            let squareResource
            let squareResourceID
            // Has to be a better way
            switch (syncConfig.squareResourceType) {
              case 'ordersApi' :
                squareResource = await square?.[syncConfig?.squareResourceType]?.updateOrder(
                  data.squareID,
                  syncedFields,
                )
                squareResourceID = squareResource.result.order?.id
                break
              case 'customersApi' :
                squareResource = await square?.[syncConfig?.squareResourceType]?.updateCustomer(
                  data.squareID,
                  syncedFields,
                )
                squareResourceID = squareResource.result.customer?.id
                break
              default:
                break

            }


            if (logs) {
              payload.logger.info(
                `✅ Successfully synced Square resource with ID: '${squareResourceID}'.`,
              )
            }

          } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : error
            throw new APIError(`Failed to sync document with ID: '${data.id}' to Square: ${msg}`)
          }
        }
      }
    }
  }

  // Set back to 'false' so that all changes continue to sync to Square, see note in './createNewInSquare.ts'
  data.skipSync = false

  return data
}

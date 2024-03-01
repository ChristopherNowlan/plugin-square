import {CollectionBeforeValidateHook, CollectionConfig} from "payload/types";
import { APIError } from 'payload/errors'
import { Client, Environment } from "square";

import type { SquareConfig } from '../types'
import {deepen} from "../utilities/deepen";

const squareAccessToken = process.env.SQUARE_ACCESS_TOKEN
const square = new Client({
  bearerAuthCredentials: {
    accessToken: squareAccessToken || ''
  },
})
type HookArgsWithCustomCollection = Omit<
  Parameters<CollectionBeforeValidateHook>[0],
  'collection'
> & {
  collection: CollectionConfig
}

export type CollectionBeforeValidateHookWithArgs = (
  args: HookArgsWithCustomCollection & {
    collection?: CollectionConfig
    squareConfig?: SquareConfig
  },
) => void


export const createNewInSquare: CollectionBeforeValidateHookWithArgs = async ( args ) => {
  const  {collection, data, operation, req, squareConfig } = args

  const {logs, sync} = squareConfig || {}
  const payload = req?.payload

  const dataRef = data || {}

  if (process.env.NODE_ENV === 'test') {
    dataRef.squareID = 'test'
    return dataRef
  }


  if ( payload ) {
    if (data?.skipSync) {
      if (logs) {
        payload.logger.info(`Bypassing collection-level hooks.`)
      }
    } else  {

      // initialize as 'false' so that all Payload admin events sync to Square
      // then conditionally set to 'true' to for events that originate from webhooks
      // this will prevent webhook events from triggering an unnecessary sync / infinite loop
      dataRef.skipSync = false

      const { slug: collectionSlug } = collection || {}
      const syncConfig = sync?.find((conf) => conf.collection === collectionSlug)

      if ( syncConfig ) {
        // combine all fields of this object and match their respective values within the document
        let syncedFields = syncConfig.fields.reduce(
          (acc, field) => {
            const { fieldPath, squareProperty } = field

            acc[squareProperty] = dataRef[fieldPath]
            return acc
          },
          {} as Record<string, any>,
        )

        syncedFields = deepen(syncedFields)

        if (operation === 'update') {

          if (logs) {
            payload.logger.info(
              `A '${collectionSlug}' document has changed in Payload with ID: '${data?.id}', syncing with Square...`,
            )
          }
          // NOTE: the Square document will be created in the "afterChange" hook, so create a new square document here if no squareID exists

          if ( !dataRef.squareID ) {
            try {
              let squareResourceID
              let squareResource

              // Has to be a better way
              switch (syncConfig.squareResourceType ) {
                case 'ordersApi' :

                  squareResource = await square?.[syncConfig.squareResourceType].createOrder(
                    syncedFields as any
                  )
                  squareResourceID = squareResource.result.order?.id
                  break
                case 'customersApi':

                  squareResource = await square?.[syncConfig.squareResourceType].createCustomer(
                    syncedFields as any
                  )
                  squareResourceID = squareResource.result.customer?.id
                  break
                default:
                  break
              }


              if (logs) {
                payload.logger.info(
                  `✅ Successfully created new '${syncConfig.squareResourceType}' resource in Square with ID: '${squareResourceID}'.`,
                )
              }

              dataRef.squareID = squareResourceID

              // IMPORTANT: this is to prevent sync in the "afterChange" hook
              dataRef.skipSync = true

            } catch (error: unknown) {
              const msg = error instanceof Error ? error.message : error
              throw new APIError(
                `Failed to create new '${syncConfig.squareResourceType}' resource in Square: ${msg}`,
              )
            }
          }

        }

      }

    }
  }

  return dataRef

}

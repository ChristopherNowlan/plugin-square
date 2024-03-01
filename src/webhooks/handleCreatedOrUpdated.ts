import { v4 as uuid } from 'uuid'
import type { SanitizedSquareConfig, SquareWebhookHandler } from "../types"
import {deepen} from "../utilities/deepen"

type HandleCreatedOrUpdated = (
  args: Parameters<SquareWebhookHandler>[0] & {
    resourceType: string
    syncConfig: SanitizedSquareConfig['sync'][0]
  },
) => void

export const handleCreatedOrUpdated: HandleCreatedOrUpdated = async (args) => {
  const { config: payloadConfig, event, payload, resourceType, squareConfig, syncConfig } = args

  const { logs } = squareConfig || {}

  const squareDoc: any = event?.data?.object || {}

  const { id: squareID, object: eventObject } = squareDoc

  // NOTE: the Square API does not nest fields, everything is an object at the top level
  // if the event object and resource type don't match, this change was not top-level
  const isNestedChange = eventObject !== resourceType

  // let squareID = docID;
  // if (isNestedChange) {
  //   const parentResource = squareDoc[resourceType];
  //   squareID = parentResource;
  // }

  if (isNestedChange) {
    if (logs)
      payload.logger.info(
        `- This change occurred on a nested field of ${resourceType}. Nested fields are not yet supported in auto-sync but can be manually setup.`,
      )
  }

  if (!isNestedChange) {
    if (logs)
      payload.logger.info(
        `- A new document was created or updated in Square, now syncing to Payload...`,
      )

    const collectionSlug = syncConfig?.collection

    const isAuthCollection = Boolean(
      payloadConfig?.collections?.find((collection) => collection.slug === collectionSlug)?.auth,
    )

    // First, search for an existing document in Payload
    const payloadQuery = await payload.find({
      collection: collectionSlug,
      where: {
        squareID: {
          equals: squareID,
        },
      },
    })

    const foundDoc = payloadQuery.docs[0] as any

    // combine all properties of the Square doc and match their respective fields within the document
    let syncedData = syncConfig.fields.reduce(
      (acc, field) => {
        const { fieldPath, squareProperty } = field

        acc[fieldPath] = squareDoc[squareProperty]
        return acc
      },
      {} as Record<string, any>,
    )

    syncedData = deepen({
      ...syncedData,
      skipSync: true,
      squareID,
    })

    if (!foundDoc) {
      if (logs)
        payload.logger.info(
          `- No existing '${collectionSlug}' document found with Square ID: '${squareID}', creating new...`,
        )

      // auth docs must use unique emails
      let authDoc = null

      if (isAuthCollection) {
        try {
          if (squareDoc?.email) {
            const authQuery = await payload.find({
              collection: collectionSlug,
              where: {
                email: {
                  equals: squareDoc.email,
                },
              },
            })

            authDoc = authQuery.docs[0] as any

            if (authDoc) {
              if (logs)
                payload.logger.info(
                  `- Account already exists with e-mail: ${squareDoc.email}, updating now...`,
                )

              // account exists by email, so update it instead
              try {
                await payload.update({
                  id: authDoc.id,
                  collection: collectionSlug,
                  data: syncedData,
                })

                if (logs)
                  payload.logger.info(
                    `✅ Successfully updated '${collectionSlug}' document in Payload with ID: '${authDoc.id}.'`,
                  )
              } catch (err: unknown) {
                const msg = err instanceof Error ? err.message : err
                if (logs)
                  payload.logger.error(
                    `- Error updating existing '${collectionSlug}' document: ${msg}`,
                  )
              }
            }
          } else {
            if (logs)
              payload.logger.error(
                `No email was provided from Square, cannot create new '${collectionSlug}' document.`,
              )
          }
        } catch (error: unknown) {
          const msg = error instanceof Error ? error.message : error
          if (logs)
            payload.logger.error(`Error looking up '${collectionSlug}' document in Payload: ${msg}`)
        }
      }

      if (!isAuthCollection || (isAuthCollection && !authDoc)) {
        try {
          if (logs)
            payload.logger.info(
              `- Creating new '${collectionSlug}' document in Payload with Square ID: '${squareID}'.`,
            )

          // generate a strong, unique password for the new user
          const password: string = uuid()

          await payload.create({
            collection: collectionSlug,
            data: {
              ...syncedData,
              password,
              passwordConfirm: password,
            },
            disableVerificationEmail: isAuthCollection ? true : undefined,
          })

          if (logs)
            payload.logger.info(
              `✅ Successfully created new '${collectionSlug}' document in Payload with Square ID: '${squareID}'.`,
            )
        } catch (error: unknown) {
          const msg = error instanceof Error ? error.message : error
          if (logs) payload.logger.error(`Error creating new document in Payload: ${msg}`)
        }
      }
    } else {
      if (logs)
        payload.logger.info(
          `- Existing '${collectionSlug}' document found in Payload with Square ID: '${squareID}', updating now...`,
        )

      try {
        await payload.update({
          id: foundDoc.id,
          collection: collectionSlug,
          data: syncedData,
        })

        if (logs)
          payload.logger.info(
            `✅ Successfully updated '${collectionSlug}' document in Payload from Square ID: '${squareID}'.`,
          )
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : error
        if (logs)
          payload.logger.error(`Error updating '${collectionSlug}' document in Payload: ${msg}`)
      }
    }
  }
}

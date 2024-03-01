import type { SquareWebhookHandler } from '../types'

import { handleCreatedOrUpdated } from './handleCreatedOrUpdated'
import { handleDeleted } from './handleDeleted'

export const handleWebhooks: SquareWebhookHandler = async (args) => {
  const { event, payload, squareConfig } = args

  if (squareConfig?.logs)
    payload.logger.info(`🪝 Received Square '${event.type}' webhook event with ID: '${event.id}'.`)

  // could also traverse into event.data.object.object to get the type, but that seems unreliable
  // use cli: `square resources` to see all available resources
  const resourceType = event.type.split('.')[0]
  const method = event.type.split('.').pop()

  const syncConfig = squareConfig?.sync?.find(
    (sync) => sync.squareResourceTypeSingular === resourceType,
  )

  if (syncConfig) {
    switch (method) {
      case 'created': {
        await handleCreatedOrUpdated({
          ...args,
          resourceType,
          squareConfig,
          syncConfig,
        })
        break
      }
      case 'updated': {
        await handleCreatedOrUpdated({
          ...args,
          resourceType,
          squareConfig,
          syncConfig,
        })
        break
      }
      case 'deleted': {
        await handleDeleted({
          ...args,
          resourceType,
          squareConfig,
          syncConfig,
        })
        break
      }
      default: {
        break
      }
    }
  }
}

import type { CollectionConfig, Field } from 'payload/types'

import type { SanitizedSquareConfig } from '../types'

import { LinkToDoc } from '../ui/LinkToDoc'

interface Args {
  collection: CollectionConfig
  squareConfig: SanitizedSquareConfig
  syncConfig: {
    squareResourceType: string
  }
}

export const getFields = ({ collection, squareConfig, syncConfig }: Args): Field[] => {
  const squareIDField: Field = {
    name: 'squareID',
    admin: {
      position: 'sidebar',
      readOnly: true,
    },
    label: 'Square ID',
    saveToJWT: true,
    type: 'text',
  }

  const skipSyncField: Field = {
    name: 'skipSync',
    admin: {
      position: 'sidebar',
      readOnly: true,
    },
    label: 'Skip Sync',
    type: 'checkbox',
  }

  const docUrlField: Field = {
    name: 'docUrl',
    admin: {
      components: {
        Field: (args) =>
          LinkToDoc({
            ...args,
            isTestKey: squareConfig.isTestKey,
            nameOfIDField: 'squareID',
            squareResourceType: syncConfig.squareResourceType,
          }),
      },
      position: 'sidebar',
    },
    type: 'ui',
  }

  const fields = [...collection.fields, squareIDField, skipSyncField, docUrlField]

  return fields
}

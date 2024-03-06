import type { UIField } from 'payload/dist/fields/config/types'

import { useFormFields } from 'payload/components/forms'
// TODO: fix this import to work in dev mode within the monorepo in a way that is backwards compatible with 1.x
// import CopyToClipboard from 'payload/dist/admin/components/elements/CopyToClipboard'
import React from 'react'

export const LinkToDoc: React.FC<
  UIField & {
  isTestKey: boolean
  nameOfIDField: string
  squareResourceType: string
}
> = (props) => {
  const { isTestKey, nameOfIDField, squareResourceType } = props

  const field = useFormFields(([fields]) => fields[nameOfIDField])
  const { value: squareID } = field || {}

  const href = `https://squareup.com/dashboard/${squareResourceType}/${squareID}`

  if (squareID) {
    return (
      <div>
        <div>
          <span
            className="label"
            style={{
              color: '#9A9A9A',
            }}
          >
            View in Square
          </span>
          {/* @ts-ignore */}
          {/* <CopyToClipboard value={href} /> */}
        </div>
        <div
          style={{
            fontWeight: '600',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          <a href={href} rel="noreferrer noopener" target="_blank">
            {href}
          </a>
        </div>
      </div>
    )
  }

  return null
}

# Payload Square Plugin

A plugin for [Payload](https://github.com/payloadcms/payload) to connect [Square](https://squareup.com) and Payload.


## Basic Usage

In the `plugins` array of your [Payload config](https://payloadcms.com/docs/configuration/overview), call the plugin with [options](#options):

```ts
import {buildConfig} from 'payload/config'
import squarePlugin from 'plugin-square' // @TODO Update to be correct
import {Environment} from "square";

const config = buildConfig({
  plugins: [
    squarePlugin({
      squareAccessToken: process.env.SQUARE_ACCESS_TOKEN,
      squareEnvironment: process.env.SQUARE_EVIRONMENT as keyof typeof Environment,
    }),
  ],
})

export default config
```

### Options
| Option     | Type               | Default     | Description                                                                                                              |
|------------|--------------------|-------------|--------------------------------------------------------------------------------------------------------------------------|
| `webhooks` | object \| function | `undefined` | Either a function to handle all webhooks events, or an object of Square webhook handlers, keyed to the name of the event |
| `sync`     | array              | `undefined` | An array of sync configs                                                                                                 |
| `logs`     | boolean            | `false`     | When `true`, logs sync events to the console as they happen                                                              |

_\* An asterisk denotes that a property is required._

## Endpoints

The following custom endpoints are automatically opened for you:

| Endpoint               | Method | Description                       |
|------------------------|--------|-----------------------------------|
| `/api/square/webhooks` | `POST` | Handles all Square webhook events |

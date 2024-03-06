import {WebhooksHelper} from "square";

const SIGNATURE_KEY = ''
const NOTIFICATION_URL = '/square/webhooks'
export const isFromSquare = (signature: string, body: string) => {
  return WebhooksHelper.isValidWebhookEventSignature(
    body,
    signature,
    SIGNATURE_KEY,
    NOTIFICATION_URL
  )
}

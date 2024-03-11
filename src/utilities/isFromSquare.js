"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFromSquare = void 0;
var square_1 = require("square");
var SIGNATURE_KEY = '';
var NOTIFICATION_URL = '/square/webhooks';
var isFromSquare = function (signature, body) {
    return square_1.WebhooksHelper.isValidWebhookEventSignature(body, signature, SIGNATURE_KEY, NOTIFICATION_URL);
};
exports.isFromSquare = isFromSquare;

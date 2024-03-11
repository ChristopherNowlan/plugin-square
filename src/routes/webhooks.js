"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.squareWebhooks = void 0;
var square_1 = require("square");
var webhooks_1 = require("../webhooks");
var isFromSquare_1 = require("../utilities/isFromSquare");
var squareWebhooks = function (args) { return __awaiter(void 0, void 0, void 0, function () {
    var config, req, res, squareConfig, squareAccessToken, squareEnvironment, webhooks, squareSignature, square, event_1, msg, webhookEventHandler;
    return __generator(this, function (_a) {
        config = args.config, req = args.req, res = args.res, squareConfig = args.squareConfig;
        squareAccessToken = squareConfig.squareAccessToken, squareEnvironment = squareConfig.squareEnvironment, webhooks = squareConfig.webhooks;
        squareSignature = req.headers['x-square-hmacsha256-signature'];
        // Need to test
        if ((0, isFromSquare_1.isFromSquare)(req.body, squareSignature)) {
            square = new square_1.Client({
                bearerAuthCredentials: {
                    accessToken: squareAccessToken || ''
                },
                environment: square_1.Environment[squareEnvironment]
            });
            if (squareSignature) {
                try {
                    // Not sure if this correct
                    event_1 = JSON.parse(req.body);
                }
                catch (err) {
                    msg = err instanceof Error ? err.message : err;
                    req.payload.logger.error("Error constructing Square event: ".concat(msg));
                    res.status(400);
                }
                if (event_1) {
                    (0, webhooks_1.handleWebhooks)({
                        config: config,
                        event: event_1,
                        payload: req.payload,
                        square: square,
                        squareConfig: squareConfig,
                    });
                    //  Fire external webhook handlers if they exist
                    if (typeof webhooks === 'function') {
                        webhooks({
                            config: config,
                            event: event_1,
                            payload: req.payload,
                            square: square,
                            squareConfig: squareConfig,
                        });
                    }
                    if (typeof webhooks === 'object' && event_1.type) {
                        webhookEventHandler = webhooks[event_1.type];
                        if (typeof webhookEventHandler === 'function') {
                            webhookEventHandler({
                                config: config,
                                event: event_1,
                                payload: req.payload,
                                square: square,
                                squareConfig: squareConfig,
                            });
                        }
                    }
                }
            }
        }
        res.json({ received: true });
        return [2 /*return*/];
    });
}); };
exports.squareWebhooks = squareWebhooks;

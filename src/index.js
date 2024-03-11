"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var extendWebpackConfig_1 = require("./extendWebpackConfig");
var getFields_1 = require("./fields/getFields");
var createNewInSquare_1 = require("./hooks/createNewInSquare");
var deleteFromSquare_1 = require("./hooks/deleteFromSquare");
var syncExistingWithSquare_1 = require("./hooks/syncExistingWithSquare");
var webhooks_1 = require("./routes/webhooks");
var squarePlugin = function (incomingSquareConfig) {
    return function (config) {
        var collections = config.collections;
        // set config defaults here
        var squareConfig = __assign(__assign({}, incomingSquareConfig), { sync: (incomingSquareConfig === null || incomingSquareConfig === void 0 ? void 0 : incomingSquareConfig.sync) || [] });
        // NOTE: env variables are never passed to the client, but we need to know if `squareSecretKey` is a test key
        // unfortunately we must set the 'isTestKey' property on the config instead of using the following code:
        // const isTestKey = squareConfig.squareSecretKey?.startsWith('sk_test_');
        return __assign(__assign({}, config), { admin: __assign(__assign({}, config.admin), { webpack: (0, extendWebpackConfig_1.extendWebpackConfig)(config) }), collections: collections === null || collections === void 0 ? void 0 : collections.map(function (collection) {
                var _a;
                var existingHooks = collection.hooks;
                var syncConfig = (_a = squareConfig.sync) === null || _a === void 0 ? void 0 : _a.find(function (sync) { return sync.collection === collection.slug; });
                if (syncConfig) {
                    var fields = (0, getFields_1.getFields)({
                        collection: collection,
                        squareConfig: squareConfig,
                        syncConfig: syncConfig,
                    });
                    return __assign(__assign({}, collection), { fields: fields, hooks: __assign(__assign({}, collection.hooks), { afterDelete: __spreadArray(__spreadArray([], ((existingHooks === null || existingHooks === void 0 ? void 0 : existingHooks.afterDelete) || []), true), [
                                function (args) {
                                    return (0, deleteFromSquare_1.deleteFromSquare)(__assign(__assign({}, args), { collection: collection, squareConfig: squareConfig }));
                                },
                            ], false), beforeChange: __spreadArray(__spreadArray([], ((existingHooks === null || existingHooks === void 0 ? void 0 : existingHooks.beforeChange) || []), true), [
                                function (args) {
                                    return (0, syncExistingWithSquare_1.syncExistingWithSquare)(__assign(__assign({}, args), { collection: collection, squareConfig: squareConfig }));
                                },
                            ], false), beforeValidate: __spreadArray(__spreadArray([], ((existingHooks === null || existingHooks === void 0 ? void 0 : existingHooks.beforeValidate) || []), true), [
                                function (args) {
                                    return (0, createNewInSquare_1.createNewInSquare)(__assign(__assign({}, args), { collection: collection, squareConfig: squareConfig }));
                                },
                            ], false) }) });
                }
                return collection;
            }), endpoints: __spreadArray(__spreadArray([], ((config === null || config === void 0 ? void 0 : config.endpoints) || []), true), [
                {
                    handler: [
                        express_1.default.raw({ type: 'application/json' }),
                        function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, (0, webhooks_1.squareWebhooks)({
                                            config: config,
                                            next: next,
                                            req: req,
                                            res: res,
                                            squareConfig: squareConfig,
                                        })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); },
                    ],
                    method: 'get',
                    path: '/square/webhooks',
                    root: true,
                },
            ], false) });
    };
};
exports.default = squarePlugin;

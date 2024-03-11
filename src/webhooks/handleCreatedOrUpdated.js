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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCreatedOrUpdated = void 0;
var uuid_1 = require("uuid");
var deepen_1 = require("../utilities/deepen");
var handleCreatedOrUpdated = function (args) { return __awaiter(void 0, void 0, void 0, function () {
    var payloadConfig, event, payload, resourceType, squareConfig, syncConfig, logs, squareDoc, squareID, eventObject, isNestedChange, collectionSlug_1, isAuthCollection, payloadQuery, foundDoc, syncedData, authDoc, authQuery, err_1, msg, error_1, msg, password, error_2, msg, error_3, msg;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                payloadConfig = args.config, event = args.event, payload = args.payload, resourceType = args.resourceType, squareConfig = args.squareConfig, syncConfig = args.syncConfig;
                logs = (squareConfig || {}).logs;
                squareDoc = ((_a = event === null || event === void 0 ? void 0 : event.data) === null || _a === void 0 ? void 0 : _a.object) || {};
                squareID = squareDoc.id, eventObject = squareDoc.object;
                isNestedChange = eventObject !== resourceType;
                // let squareID = docID;
                // if (isNestedChange) {
                //   const parentResource = squareDoc[resourceType];
                //   squareID = parentResource;
                // }
                if (isNestedChange) {
                    if (logs)
                        payload.logger.info("- This change occurred on a nested field of ".concat(resourceType, ". Nested fields are not yet supported in auto-sync but can be manually setup."));
                }
                if (!!isNestedChange) return [3 /*break*/, 20];
                if (logs)
                    payload.logger.info("- A new document was created or updated in Square, now syncing to Payload...");
                collectionSlug_1 = syncConfig === null || syncConfig === void 0 ? void 0 : syncConfig.collection;
                isAuthCollection = Boolean((_c = (_b = payloadConfig === null || payloadConfig === void 0 ? void 0 : payloadConfig.collections) === null || _b === void 0 ? void 0 : _b.find(function (collection) { return collection.slug === collectionSlug_1; })) === null || _c === void 0 ? void 0 : _c.auth);
                return [4 /*yield*/, payload.find({
                        collection: collectionSlug_1,
                        where: {
                            squareID: {
                                equals: squareID,
                            },
                        },
                    })];
            case 1:
                payloadQuery = _d.sent();
                foundDoc = payloadQuery.docs[0];
                syncedData = syncConfig.fields.reduce(function (acc, field) {
                    var fieldPath = field.fieldPath, squareProperty = field.squareProperty;
                    acc[fieldPath] = squareDoc[squareProperty];
                    return acc;
                }, {});
                syncedData = (0, deepen_1.deepen)(__assign(__assign({}, syncedData), { skipSync: true, squareID: squareID }));
                if (!!foundDoc) return [3 /*break*/, 16];
                if (logs)
                    payload.logger.info("- No existing '".concat(collectionSlug_1, "' document found with Square ID: '").concat(squareID, "', creating new..."));
                authDoc = null;
                if (!isAuthCollection) return [3 /*break*/, 11];
                _d.label = 2;
            case 2:
                _d.trys.push([2, 10, , 11]);
                if (!(squareDoc === null || squareDoc === void 0 ? void 0 : squareDoc.email)) return [3 /*break*/, 8];
                return [4 /*yield*/, payload.find({
                        collection: collectionSlug_1,
                        where: {
                            email: {
                                equals: squareDoc.email,
                            },
                        },
                    })];
            case 3:
                authQuery = _d.sent();
                authDoc = authQuery.docs[0];
                if (!authDoc) return [3 /*break*/, 7];
                if (logs)
                    payload.logger.info("- Account already exists with e-mail: ".concat(squareDoc.email, ", updating now..."));
                _d.label = 4;
            case 4:
                _d.trys.push([4, 6, , 7]);
                return [4 /*yield*/, payload.update({
                        id: authDoc.id,
                        collection: collectionSlug_1,
                        data: syncedData,
                    })];
            case 5:
                _d.sent();
                if (logs)
                    payload.logger.info("\u2705 Successfully updated '".concat(collectionSlug_1, "' document in Payload with ID: '").concat(authDoc.id, ".'"));
                return [3 /*break*/, 7];
            case 6:
                err_1 = _d.sent();
                msg = err_1 instanceof Error ? err_1.message : err_1;
                if (logs)
                    payload.logger.error("- Error updating existing '".concat(collectionSlug_1, "' document: ").concat(msg));
                return [3 /*break*/, 7];
            case 7: return [3 /*break*/, 9];
            case 8:
                if (logs)
                    payload.logger.error("No email was provided from Square, cannot create new '".concat(collectionSlug_1, "' document."));
                _d.label = 9;
            case 9: return [3 /*break*/, 11];
            case 10:
                error_1 = _d.sent();
                msg = error_1 instanceof Error ? error_1.message : error_1;
                if (logs)
                    payload.logger.error("Error looking up '".concat(collectionSlug_1, "' document in Payload: ").concat(msg));
                return [3 /*break*/, 11];
            case 11:
                if (!(!isAuthCollection || (isAuthCollection && !authDoc))) return [3 /*break*/, 15];
                _d.label = 12;
            case 12:
                _d.trys.push([12, 14, , 15]);
                if (logs)
                    payload.logger.info("- Creating new '".concat(collectionSlug_1, "' document in Payload with Square ID: '").concat(squareID, "'."));
                password = (0, uuid_1.v4)();
                return [4 /*yield*/, payload.create({
                        collection: collectionSlug_1,
                        data: __assign(__assign({}, syncedData), { password: password, passwordConfirm: password }),
                        disableVerificationEmail: isAuthCollection ? true : undefined,
                    })];
            case 13:
                _d.sent();
                if (logs)
                    payload.logger.info("\u2705 Successfully created new '".concat(collectionSlug_1, "' document in Payload with Square ID: '").concat(squareID, "'."));
                return [3 /*break*/, 15];
            case 14:
                error_2 = _d.sent();
                msg = error_2 instanceof Error ? error_2.message : error_2;
                if (logs)
                    payload.logger.error("Error creating new document in Payload: ".concat(msg));
                return [3 /*break*/, 15];
            case 15: return [3 /*break*/, 20];
            case 16:
                if (logs)
                    payload.logger.info("- Existing '".concat(collectionSlug_1, "' document found in Payload with Square ID: '").concat(squareID, "', updating now..."));
                _d.label = 17;
            case 17:
                _d.trys.push([17, 19, , 20]);
                return [4 /*yield*/, payload.update({
                        id: foundDoc.id,
                        collection: collectionSlug_1,
                        data: syncedData,
                    })];
            case 18:
                _d.sent();
                if (logs)
                    payload.logger.info("\u2705 Successfully updated '".concat(collectionSlug_1, "' document in Payload from Square ID: '").concat(squareID, "'."));
                return [3 /*break*/, 20];
            case 19:
                error_3 = _d.sent();
                msg = error_3 instanceof Error ? error_3.message : error_3;
                if (logs)
                    payload.logger.error("Error updating '".concat(collectionSlug_1, "' document in Payload: ").concat(msg));
                return [3 /*break*/, 20];
            case 20: return [2 /*return*/];
        }
    });
}); };
exports.handleCreatedOrUpdated = handleCreatedOrUpdated;

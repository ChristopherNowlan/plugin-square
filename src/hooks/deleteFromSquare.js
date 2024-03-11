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
exports.deleteFromSquare = void 0;
var errors_1 = require("payload/errors");
var square_1 = require("square");
var squareAccessToken = process.env.SQUARE_ACCESS_TOKEN;
var squareEnvironment = process.env.SQUARE_EVIRONMENT;
var square = new square_1.Client({
    bearerAuthCredentials: {
        accessToken: squareAccessToken || ''
    },
    environment: squareEnvironment ? square_1.Environment[squareEnvironment] : square_1.Environment.Sandbox
});
var deleteFromSquare = function (args) { return __awaiter(void 0, void 0, void 0, function () {
    var collection, doc, req, squareConfig, _a, logs, sync, payload, collectionSlug, syncConfig, found, _b, _c, error_1, msg;
    var _d, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                collection = args.collection, doc = args.doc, req = args.req, squareConfig = args.squareConfig;
                _a = squareConfig || {}, logs = _a.logs, sync = _a.sync;
                payload = req.payload;
                collectionSlug = (collection || {}).slug;
                if (logs)
                    payload.logger.info("Document with ID: '".concat(doc === null || doc === void 0 ? void 0 : doc.id, "' in collection: '").concat(collectionSlug, "' has been deleted, deleting from Square..."));
                if (!(process.env.NODE_ENV !== 'test')) return [3 /*break*/, 13];
                if (logs)
                    payload.logger.info("- Deleting Square document with ID: '".concat(doc.squareID, "'..."));
                syncConfig = sync === null || sync === void 0 ? void 0 : sync.find(function (conf) { return conf.collection === collectionSlug; });
                if (!syncConfig) return [3 /*break*/, 13];
                _f.label = 1;
            case 1:
                _f.trys.push([1, 12, , 13]);
                found = void 0;
                _b = syncConfig.squareResourceType;
                switch (_b) {
                    case 'customers': return [3 /*break*/, 2];
                }
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, ((_d = square === null || square === void 0 ? void 0 : square.customersApi) === null || _d === void 0 ? void 0 : _d.retrieveCustomer(doc.squareID))];
            case 3:
                found = _f.sent();
                return [3 /*break*/, 5];
            case 4: return [3 /*break*/, 5];
            case 5:
                if (!found) return [3 /*break*/, 10];
                _c = syncConfig.squareResourceType;
                switch (_c) {
                    case 'customers': return [3 /*break*/, 6];
                }
                return [3 /*break*/, 8];
            case 6: return [4 /*yield*/, ((_e = square === null || square === void 0 ? void 0 : square.customersApi) === null || _e === void 0 ? void 0 : _e.deleteCustomer(doc.squareID))];
            case 7:
                _f.sent();
                return [3 /*break*/, 9];
            case 8: return [3 /*break*/, 9];
            case 9:
                if (logs)
                    payload.logger.info("\u2705 Successfully deleted Square document with ID: '".concat(doc.squareID, "'."));
                return [3 /*break*/, 11];
            case 10:
                if (logs)
                    payload.logger.info("- Square document with ID: '".concat(doc.squareID, "' not found, skipping..."));
                _f.label = 11;
            case 11: return [3 /*break*/, 13];
            case 12:
                error_1 = _f.sent();
                msg = error_1 instanceof Error ? error_1.message : error_1;
                throw new errors_1.APIError("Failed to delete Square document with ID: '".concat(doc.squareID, "': ").concat(msg));
            case 13: return [2 /*return*/];
        }
    });
}); };
exports.deleteFromSquare = deleteFromSquare;

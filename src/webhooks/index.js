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
exports.handleWebhooks = void 0;
var handleCreatedOrUpdated_1 = require("./handleCreatedOrUpdated");
var handleDeleted_1 = require("./handleDeleted");
var handleWebhooks = function (args) { return __awaiter(void 0, void 0, void 0, function () {
    var event, payload, squareConfig, resourceType, method, syncConfig, _a;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                event = args.event, payload = args.payload, squareConfig = args.squareConfig;
                if (squareConfig === null || squareConfig === void 0 ? void 0 : squareConfig.logs)
                    payload.logger.info("\uD83E\uDE9D Received Square '".concat(event.type, "' webhook event with ID: '").concat(event.eventId, "'."));
                resourceType = event.type.split('.')[0];
                method = event.type.split('.').pop();
                syncConfig = (_b = squareConfig === null || squareConfig === void 0 ? void 0 : squareConfig.sync) === null || _b === void 0 ? void 0 : _b.find(function (sync) { return sync.squareResourceTypeSingular === resourceType; });
                if (!syncConfig) return [3 /*break*/, 8];
                _a = method;
                switch (_a) {
                    case 'created': return [3 /*break*/, 1];
                    case 'updated': return [3 /*break*/, 3];
                    case 'deleted': return [3 /*break*/, 5];
                }
                return [3 /*break*/, 7];
            case 1: return [4 /*yield*/, (0, handleCreatedOrUpdated_1.handleCreatedOrUpdated)(__assign(__assign({}, args), { resourceType: resourceType, squareConfig: squareConfig, syncConfig: syncConfig }))];
            case 2:
                _c.sent();
                return [3 /*break*/, 8];
            case 3: return [4 /*yield*/, (0, handleCreatedOrUpdated_1.handleCreatedOrUpdated)(__assign(__assign({}, args), { resourceType: resourceType, squareConfig: squareConfig, syncConfig: syncConfig }))];
            case 4:
                _c.sent();
                return [3 /*break*/, 8];
            case 5: return [4 /*yield*/, (0, handleDeleted_1.handleDeleted)(__assign(__assign({}, args), { resourceType: resourceType, squareConfig: squareConfig, syncConfig: syncConfig }))];
            case 6:
                _c.sent();
                return [3 /*break*/, 8];
            case 7:
                {
                    return [3 /*break*/, 8];
                }
                _c.label = 8;
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.handleWebhooks = handleWebhooks;

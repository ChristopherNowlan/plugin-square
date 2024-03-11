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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extendWebpackConfig = void 0;
var path_1 = __importDefault(require("path"));
var extendWebpackConfig = function (config) {
    return function (webpackConfig) {
        var _a;
        var _b, _c;
        var existingWebpackConfig = typeof ((_b = config.admin) === null || _b === void 0 ? void 0 : _b.webpack) === 'function'
            ? config.admin.webpack(webpackConfig)
            : webpackConfig;
        var mockModulePath = path_1.default.resolve(__dirname, './mocks/mockFile.js');
        var newWebpack = __assign(__assign({}, existingWebpackConfig), { resolve: __assign(__assign({}, (existingWebpackConfig.resolve || {})), { alias: __assign(__assign({}, (((_c = existingWebpackConfig.resolve) === null || _c === void 0 ? void 0 : _c.alias) ? existingWebpackConfig.resolve.alias : {})), (_a = { 
                        // Add additional aliases here like so:
                        '@payloadcms/plugin-square': path_1.default.resolve(__dirname, './admin.js'), express: mockModulePath, stream: mockModulePath }, _a[path_1.default.resolve(__dirname, './hooks/createNewInSquare')] = mockModulePath, _a[path_1.default.resolve(__dirname, './hooks/deleteFromSquare')] = mockModulePath, _a[path_1.default.resolve(__dirname, './hooks/syncExistingWithSquare')] = mockModulePath, _a[path_1.default.resolve(__dirname, './routes/webhooks')] = mockModulePath, _a)) }) });
        return newWebpack;
    };
};
exports.extendWebpackConfig = extendWebpackConfig;

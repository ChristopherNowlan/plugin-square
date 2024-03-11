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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFields = void 0;
var LinkToDoc_1 = require("../ui/LinkToDoc");
var getFields = function (_a) {
    var collection = _a.collection, squareConfig = _a.squareConfig, syncConfig = _a.syncConfig;
    var squareIDField = {
        name: 'squareID',
        admin: {
            position: 'sidebar',
            readOnly: true,
        },
        label: 'Square ID',
        saveToJWT: true,
        type: 'text',
    };
    var skipSyncField = {
        name: 'skipSync',
        admin: {
            position: 'sidebar',
            readOnly: true,
        },
        label: 'Skip Sync',
        type: 'checkbox',
    };
    var docUrlField = {
        name: 'docUrl',
        admin: {
            components: {
                Field: function (args) {
                    return (0, LinkToDoc_1.LinkToDoc)(__assign(__assign({}, args), { isTestKey: squareConfig.isTestKey, nameOfIDField: 'squareID', squareResourceType: syncConfig.squareResourceType }));
                },
            },
            position: 'sidebar',
        },
        type: 'ui',
    };
    var fields = __spreadArray(__spreadArray([], collection.fields, true), [squareIDField, skipSyncField, docUrlField], false);
    return fields;
};
exports.getFields = getFields;

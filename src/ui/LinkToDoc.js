"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkToDoc = void 0;
var forms_1 = require("payload/components/forms");
// TODO: fix this import to work in dev mode within the monorepo in a way that is backwards compatible with 1.x
// import CopyToClipboard from 'payload/dist/admin/components/elements/CopyToClipboard'
var react_1 = __importDefault(require("react"));
var LinkToDoc = function (props) {
    var isTestKey = props.isTestKey, nameOfIDField = props.nameOfIDField, squareResourceType = props.squareResourceType;
    var field = (0, forms_1.useFormFields)(function (_a) {
        var fields = _a[0];
        return fields[nameOfIDField];
    });
    var squareID = (field || {}).value;
    var href = "https://squareup.com/dashboard/".concat(squareResourceType, "/").concat(squareID);
    if (squareID) {
        return (react_1.default.createElement("div", null,
            react_1.default.createElement("div", null,
                react_1.default.createElement("span", { className: "label", style: {
                        color: '#9A9A9A',
                    } }, "View in Square")),
            react_1.default.createElement("div", { style: {
                    fontWeight: '600',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                } },
                react_1.default.createElement("a", { href: href, rel: "noreferrer noopener", target: "_blank" }, href))));
    }
    return null;
};
exports.LinkToDoc = LinkToDoc;

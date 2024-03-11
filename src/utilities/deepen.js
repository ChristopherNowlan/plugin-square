"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepen = void 0;
// converts an object of dot notation keys to a nested object
// i.e. { 'price.squarePriceID': '123' } to { price: { squarePriceID: '123' } }
var deepen = function (obj) {
    var result = {};
    var _loop_1 = function (key) {
        var value = obj[key];
        var keys = key.split('.');
        var current = result;
        keys.forEach(function (k, index) {
            if (index === keys.length - 1) {
                current[k] = value;
            }
            else {
                current[k] = current[k] || {};
                current = current[k];
            }
        });
    };
    for (var key in obj) {
        _loop_1(key);
    }
    return result;
};
exports.deepen = deepen;

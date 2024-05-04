"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Component = (function () {
    function Component(raw, extra) {
        if (raw === void 0) { raw = ""; }
        if (extra === void 0) { extra = {}; }
        this.raw = raw;
        this.data = extra;
    }
    Component.prototype.toString = function () {
        return this.raw;
    };
    return Component;
}());
exports.default = Component;

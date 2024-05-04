"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var readline = require("readline");
function prompt(query) {
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise(function (resolve) { return rl.question(query, function (ans) {
        rl.close();
        resolve(ans);
    }); });
}
exports.default = prompt;

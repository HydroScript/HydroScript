"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ChildProcess = require("child_process");
var fs = require("fs");
var execute_1 = require("../error/execute");
var index_1 = require("../index");
var throw_1 = require("../utils/throw");
function run() {
    var time = Date.now();
    var path = process.argv[2];
    var output_path = "".concat(path, "\\..\\hydroscript-execute-").concat(time, ".js");
    if (!path)
        throw new execute_1.default("No file path specified");
    try {
        fs.writeFileSync(output_path, (0, index_1.compile)(fs.readFileSync(path, "utf-8"), path));
    }
    catch (error) {
        (0, throw_1.default)(error);
    }
    var cp = ChildProcess.fork(output_path, {
        stdio: "inherit"
    });
    cp.on("error", function (error) {
        var _a;
        throw new execute_1.default((_a = error.stack) !== null && _a !== void 0 ? _a : error.message);
    });
    cp.on("exit", function () { return fs.unlinkSync(output_path); });
}
exports.default = run;

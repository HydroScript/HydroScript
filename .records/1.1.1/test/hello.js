"use strict";
var cp;
cp = (require("child_process"));
cp["execSync"]("gcc hello.c -o hello.exe");

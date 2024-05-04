"use strict";
var wait, ms;
(wait = ((ms) => (new Promise((function (resolve) {return (setTimeout(resolve,ms));})))));(ms = 5000);((async function () {(await (wait(ms)));(console[(([ "g", "o", "l" ][(([ "e", "s", "r", "e", "v", "e", "r" ]["reverse"]())["join"](""))]())["join"](""))]((("I have just waited " + ms) + " milliseconds!")));})());

export default wait;
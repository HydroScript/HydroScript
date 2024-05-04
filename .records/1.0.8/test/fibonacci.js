"use strict";
const __to=(e,o,t)=>"number"!=typeof e||"number"!=typeof o||"number"!=typeof t?NaN:Array.from({length:(o-e)/t+1},(_,i)=>e+i*t);
var fibonacci, values, pull;
(fibonacci = ((n) => {if (n <= 0) {throw (new Error("n cannot be less than 0!"));}(values = [ 1, 1 ]);for (var c of __to(3, n, 1)) {(pull = values[0]);(values[0] = (values[0] + values[1]));(values[1] = pull);}return values[0];}));(console["log"]((fibonacci(3))));(console["log"]((fibonacci(5))));(console["log"]((fibonacci(7))));

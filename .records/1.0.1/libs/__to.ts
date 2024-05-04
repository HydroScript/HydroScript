export default
    `const __to=(e,o,t)=>"number"!=typeof e||"number"!=typeof o||"number"!=typeof t?NaN:Array.from({length:(o-e)/t+1},(_,i)=>e+i*t);`
import TestError from "./error.mjs";
var Animal;
(Animal = (class {age;constructor(age) {(this["age"] = age);};alive = true;action(string) {if (this["alive"]) {(console["log"](string));} else {throw (new TestError("The animal is not alive"));};};make_sound() {return (this["action"]("An animal made a sound..."));};}));

export default Animal;
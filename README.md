# HydroScript

HydroScript is a dynamically-typed programming language compiled to JavaScript.

Contributions through posting issues are appreciated.

You can contact me through contact@hydroscript.hyperknf.com

## Installation

``npm install --global hydroscript``

## Usage

### Repl

JavaScript:

```
const HydroScript = require("hydroscript")
HydroScript.repl()
```

Command line:

```
hydroscript
hys
```

### Compile

JavaScript:

```
const HydroScript = require("hydroscript")
HydroScript.compile("source code goes here")
```

Command line:

```
hydroscript path/to/source/file.hys
hydroscript path/to/source/file.hys path/to/output/file.js
hys path/to/source/file.hys
hys path/to/source/file.hys path/to/output/file.js
```

### Run

JavaScript:

```
// command: node "path/to/javascript/file.js" "path/to/hydroscript/file.js"
const HydroScript = require("hydroscript")
HydroScript.run()
```

Command line:

```
hydroscript_run path/to/source/file.hys
hys_run path/to/source/file.hys
```

## License

` - ` ISC License

**This README file and all potential markdown files are parts of the project, and therefore is subject to protection of the license.**
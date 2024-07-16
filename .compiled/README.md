# HydroScript

HydroScript is a dynamically-typed programming language compiled to JavaScript.

Contributions through posting issues are appreciated.

You can contact me through sending an email to contact@hydroscript.hyperknf.com

## Installation

``npm install --global hydroscript``

The global flag is needed if you want to be able to use command line commands anywhere.

Remove the `--global` flag if HydroScript should be installed as a dependency of your project.

To install HydroScript as a development dependency (a.k.a dev dependency), run `npm install --save-dev hydroscript`.

## Usage

### Repl

JavaScript:

```
const HydroScript = require("HydroScript")
HydroScript.repl()
```

Command line:

```
HydroScript
hys
```

**All command line commands are not case-sensitive**

### Compile

JavaScript:

```
const HydroScript = require("HydroScript")
HydroScript.compile("source code goes here")
```

Command line:

```
HydroScript path/to/source/file.hys
HydroScript path/to/source/file.hys path/to/output/file.js
hys path/to/source/file.hys
hys path/to/source/file.hys path/to/output/file.js
```

### Run

JavaScript:

```
// command: node "path/to/javascript/file.js" "path/to/source/file.js"
const HydroScript = require("HydroScript")
HydroScript.run()
```

Command line:

```
HydroScript_run path/to/source/file.hys
hys_run path/to/source/file.hys
```

## License

` - ` ISC License

**This README file and all existing and potential markdown files are parts of the project, and therefore is subject to protection of the license.**
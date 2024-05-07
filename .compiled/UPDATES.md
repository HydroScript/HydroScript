# Updates

### 1.1.0

` - ` Added call expressions with `=>`

### 1.0.9

` - ` Improved compiled for loops

### 1.0.8

` - ` Static declarations now don't use the `=` operator

` - ` Added getters and setters

` - ` Fixed static properties of class having extra `_1` when using a JavaScript reserved word

` - ` Split the README into two markdown files

### 1.0.7

` - ` Improved statement detection without `{` in function literals

### 1.0.6

` - ` Fixed function literals not properly parsing

### 1.0.5

` - ` Fixed function literals having multiple semicolons

### 1.0.4

` - ` Removed some unnecessary parenthesis of the compiled code

### 1.0.3

` - ` Added local assignment expression and declaration expression

` - ` Improved readability on compiled code

### 1.0.2

` - ` Improved `hydroscript_run` command

### 1.0.1

` - ` Added continue and break statements

### 1.0.0

` - ` Release

### 0.0.25 (beta 25)

` - ` Added to (`x..y`) expression, generates an array from `x` to `y`

` - ` Added for loops

` - ` Function literals now forbid the use of parentheses, instead uses repeat check of identifiers

` - ` In expressions

` - ` Bug fix

### 0.0.24 (beta 24)

` - ` Changed the GitHub repository link

### 0.0.23 (beta 23)

` - ` Fixed my even lower IQ mistakes

### 0.0.22 (beta 22)

` - ` Fixed my low IQ mistakes

### 0.0.21 (beta 21)

` - ` Fixed some expressions failed to compile when being a condition in if or while statement

### 0.0.20 (beta 20)

` - ` Fixed `++n` not working within expressions (e.g. `t *= ++n`)

` - ` Fixed a typo in a declaration file

### 0.0.19 (beta 19)

` - ` Added support for non-latin characters as identifiers

### 0.0.18 (beta 18)

` - ` Fixed wrong error names in `hydroscript_run` command

` - ` Fixed wrong HydroScript package directory in HydroScriptSyntaxError error

` - ` Fixed conditional expression not allowed in expression expectations

` - ` `hydroscript_run` now generates log files

### 0.0.17 (beta 17)

` - ` Function literals are set to always be compiled to arrow functions

` - ` Added try..catch..finally statement

` - ` Added `hydroscript_run` console command

` - ` Included descriptions in declaration files

### 0.0.16 (beta 16)

` - ` Added regular expressions

### 0.0.15 (beta 15)

` - ` Added `else` to short if/unless statements

` - ` Added type declarations to most of the sub-modules

### 0.0.14 (beta 14)

` - ` Added short if/unless statements and unless statement

` - ` Added void expression

` - ` Added `++` and `--` operator

### 0.0.13 (beta 13)

` - ` Added `strict` option, defaults to true

` - ` Fixed version code import

` - ` Improved error displays

` - ` Fixed extra "compiling" console output when compiling

### 0.0.12 (beta 12)

` - ` Fixed infinite loop when compiling identifier

### 0.0.11 (beta 11)

` - ` Fixed the possibility of multiple export statements

### 0.0.10 (beta 10)

` - ` Removed export token, instead uses top-level return statement as export statement

` - ` Improved class extending

` - ` Improved detection of reserved words

### 0.0.9 (beta 9)

` - ` Added `force_init_var` option, defaults to `false`

` - ` Fixed string keys in object literals

### 0.0.8 (beta 8)

` - ` Updated index.d.ts declaration

### 0.0.7 (beta 7)

` - ` Added support for comma expressions

` - ` Removes unnecessary comma tokens from statements

` - ` Fixed wrong line number when showing error

### 0.0.6 (beta 6)

` - ` Added support for arrays

` - ` Included the license
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var token_type_1 = require("../lexer/token_type");
exports.default = {
    "+": token_type_1.TokenType.BinaryOperator,
    "-": token_type_1.TokenType.BinaryOperator,
    "*": token_type_1.TokenType.BinaryOperator,
    "/": token_type_1.TokenType.BinaryOperator,
    "**": token_type_1.TokenType.BinaryOperator,
    "%": token_type_1.TokenType.BinaryOperator,
    "++": token_type_1.TokenType.ArithmeticAssignment,
    "--": token_type_1.TokenType.ArithmeticAssignment,
    "[": token_type_1.TokenType.OpenSquareBracket,
    "]": token_type_1.TokenType.CloseSquareBracket,
    "{": token_type_1.TokenType.OpenCurlyBracket,
    "}": token_type_1.TokenType.CloseCurlyBracket,
    ",": token_type_1.TokenType.Comma,
    ".": token_type_1.TokenType.Dot,
    "(": token_type_1.TokenType.OpenParenthesis,
    ")": token_type_1.TokenType.CloseParenthesis,
    "?": token_type_1.TokenType.QuestionMark,
    "#?": token_type_1.TokenType.ShortIfOperator,
    "!?": token_type_1.TokenType.Unless,
    "#!": token_type_1.TokenType.ShortUnlessOperator,
    "-?": token_type_1.TokenType.Loop,
    ":": token_type_1.TokenType.Colon,
    "<": token_type_1.TokenType.ComparisonOperator,
    ">": token_type_1.TokenType.ComparisonOperator,
    "<=": token_type_1.TokenType.ComparisonOperator,
    "==": token_type_1.TokenType.ComparisonOperator,
    ">=": token_type_1.TokenType.ComparisonOperator,
    "!=": token_type_1.TokenType.ComparisonOperator,
    "===": token_type_1.TokenType.ComparisonOperator,
    "!==": token_type_1.TokenType.ComparisonOperator,
    "=": token_type_1.TokenType.AssignmentOperator,
    "+=": token_type_1.TokenType.AssignmentOperator,
    "-=": token_type_1.TokenType.AssignmentOperator,
    "*=": token_type_1.TokenType.AssignmentOperator,
    "/=": token_type_1.TokenType.AssignmentOperator,
    "%=": token_type_1.TokenType.AssignmentOperator,
    "**=": token_type_1.TokenType.AssignmentOperator,
    "<<=": token_type_1.TokenType.AssignmentOperator,
    ">>=": token_type_1.TokenType.AssignmentOperator,
    ">>>=": token_type_1.TokenType.AssignmentOperator,
    "&=": token_type_1.TokenType.AssignmentOperator,
    "|=": token_type_1.TokenType.AssignmentOperator,
    "^=": token_type_1.TokenType.AssignmentOperator,
    "&&=": token_type_1.TokenType.AssignmentOperator,
    "||=": token_type_1.TokenType.AssignmentOperator,
    "??=": token_type_1.TokenType.AssignmentOperator,
    "%%%": token_type_1.TokenType.Declarator,
    "%%": token_type_1.TokenType.Local,
    "&&": token_type_1.TokenType.LogicalOperator,
    "||": token_type_1.TokenType.LogicalOperator,
    "??": token_type_1.TokenType.LogicalOperator,
    "!": token_type_1.TokenType.LogicalNot,
    "~": token_type_1.TokenType.BitwiseNot,
    "&": token_type_1.TokenType.BitwiseOperator,
    "|": token_type_1.TokenType.BitwiseOperator,
    "^": token_type_1.TokenType.BitwiseOperator,
    "<<": token_type_1.TokenType.BitwiseOperator,
    ">>": token_type_1.TokenType.BitwiseOperator,
    ">>>": token_type_1.TokenType.BitwiseOperator,
    ";": token_type_1.TokenType.TypeOf,
    "@": token_type_1.TokenType.InstanceOf,
    "<~": token_type_1.TokenType.In,
    "<:": token_type_1.TokenType.Of,
    "..": token_type_1.TokenType.To,
    "^^": token_type_1.TokenType.Increment,
    "=>": token_type_1.TokenType.Call,
    "#": token_type_1.TokenType.Import,
    "->": token_type_1.TokenType.Await,
    ">>-": token_type_1.TokenType.AsyncFunction,
    ">-": token_type_1.TokenType.Function,
    ";?": token_type_1.TokenType.Try,
    ";:": token_type_1.TokenType.Catch,
    ";>": token_type_1.TokenType.Finally,
    "~>": token_type_1.TokenType.Continue,
    "!;": token_type_1.TokenType.Break,
    "<-": token_type_1.TokenType.Return,
    "\"": token_type_1.TokenType.QuotationMark,
    "'": token_type_1.TokenType.QuotationMark,
    ",,": token_type_1.TokenType.RegularExpressionMark,
    "::": token_type_1.TokenType.Class,
    "*>": token_type_1.TokenType.Static,
    "<.": token_type_1.TokenType.Get,
    ">.": token_type_1.TokenType.Set,
    "@@": token_type_1.TokenType.New,
    "/\\": token_type_1.TokenType.Void,
    ";;": token_type_1.TokenType.Throw
};

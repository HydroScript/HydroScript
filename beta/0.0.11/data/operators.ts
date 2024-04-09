import { TokenType } from "../lexer/token_type"

export default {
    "+": TokenType.BinaryOperator,
    "-": TokenType.BinaryOperator,
    "*": TokenType.BinaryOperator,
    "/": TokenType.BinaryOperator,
    "**": TokenType.BinaryOperator,
    "%": TokenType.BinaryOperator,

    "++": TokenType.ArithmeticAssignment,
    "--": TokenType.ArithmeticAssignment,
    
    "[": TokenType.OpenSquareBracket,
    "]": TokenType.CloseSquareBracket,
    "{": TokenType.OpenCurlyBracket,
    "}": TokenType.CloseCurlyBracket,

    ",": TokenType.Comma,
    ".": TokenType.Dot,
    
    "(": TokenType.OpenParenthesis,
    ")": TokenType.CloseParenthesis,
    "?": TokenType.QuestionMark,
    "-?": TokenType.While,
    ":": TokenType.Colon,

    "<": TokenType.ComparisonOperator,
    ">": TokenType.ComparisonOperator,
    "<=": TokenType.ComparisonOperator,
    "==": TokenType.ComparisonOperator,
    ">=": TokenType.ComparisonOperator,
    "!=": TokenType.ComparisonOperator,
    "===": TokenType.ComparisonOperator,
    "!==": TokenType.ComparisonOperator,

    "=": TokenType.AssignmentOperator,
    "+=": TokenType.AssignmentOperator,
    "-=": TokenType.AssignmentOperator,
    "*=": TokenType.AssignmentOperator,
    "/=": TokenType.AssignmentOperator,
    "%=": TokenType.AssignmentOperator,
    "**=": TokenType.AssignmentOperator,
    "<<=": TokenType.AssignmentOperator,
    ">>=": TokenType.AssignmentOperator,
    ">>>=": TokenType.AssignmentOperator,
    "&=": TokenType.AssignmentOperator,
    "|=": TokenType.AssignmentOperator,
    "^=": TokenType.AssignmentOperator,
    "&&=": TokenType.AssignmentOperator,
    "||=": TokenType.AssignmentOperator,
    "??=": TokenType.AssignmentOperator,

    "&&": TokenType.LogicalOperator,
    "||": TokenType.LogicalOperator,
    "??": TokenType.LogicalOperator,

    "!": TokenType.LogicalNot,
    "~": TokenType.BitwiseNot,

    "&": TokenType.BitwiseOperator,
    "|": TokenType.BitwiseOperator,
    "^": TokenType.BitwiseOperator,
    "<<": TokenType.BitwiseOperator,
    ">>": TokenType.BitwiseOperator,
    ">>>": TokenType.BitwiseOperator,

    ";": TokenType.TypeOf,
    "@": TokenType.InstanceOf,

    "#": TokenType.Import,

    "->": TokenType.Await,
    ">>-": TokenType.AsyncFunction,
    ">-": TokenType.Function,

    "<-": TokenType.Return,

    "\"": TokenType.QuotationMark,
    "'": TokenType.QuotationMark,

    "::": TokenType.Class,
    "*>": TokenType.Static,
    "@@": TokenType.New,

    ";;": TokenType.Throw
}
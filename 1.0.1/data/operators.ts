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
    "#?": TokenType.ShortIfOperator,
    "!?": TokenType.Unless,
    "#!": TokenType.ShortUnlessOperator,
    "-?": TokenType.Loop,
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

    "<~": TokenType.In,
    "<:": TokenType.Of,
    "..": TokenType.To,
    "^^": TokenType.Increment,

    "#": TokenType.Import,

    "->": TokenType.Await,
    ">>-": TokenType.AsyncFunction,
    ">-": TokenType.Function,

    ";?": TokenType.Try,
    ";:": TokenType.Catch,
    ";>": TokenType.Finally,

    "~>": TokenType.Continue,
    "!;": TokenType.Break,
    "<-": TokenType.Return,

    "\"": TokenType.QuotationMark,
    "'": TokenType.QuotationMark,
    ",,": TokenType.RegularExpressionMark,

    "::": TokenType.Class,
    "*>": TokenType.Static,
    "@@": TokenType.New,
    "/\\": TokenType.Void,

    ";;": TokenType.Throw
}
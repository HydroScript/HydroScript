export enum TokenType {
    Number,
    String,
    Identifier,

    OpenParenthesis,
    CloseParenthesis,
    QuestionMark,
    While,
    Colon,

    Comma,
    Dot,

    AssignmentOperator,
    BinaryOperator,

    ArithmeticAssignment,

    OpenSquareBracket,
    CloseSquareBracket,
    OpenCurlyBracket,
    CloseCurlyBracket,

    LogicalOperator,
    LogicalNot,
    BitwiseNot,
    BitwiseOperator,

    ComparisonOperator,
    BinaryOperationAssignment,

    TypeOf,
    InstanceOf,

    Import,
    Export,
    ExportDefault,

    Await,
    AsyncFunction,
    Function,

    QuotationMark,

    Class,
    Extends,
    Static,

    LineComment,

    FileEnd
}
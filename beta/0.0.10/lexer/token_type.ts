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

    Await,
    AsyncFunction,
    Function,
    
    Return,

    QuotationMark,

    Class,
    Static,
    New,

    Throw,

    FileEnd
}
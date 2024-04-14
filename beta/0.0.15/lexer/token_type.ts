export enum TokenType {
    Number,
    String,
    Identifier,

    OpenParenthesis,
    CloseParenthesis,
    QuestionMark,
    ShortIfOperator,
    Unless,
    ShortUnlessOperator,
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

    Void,

    Throw,

    FileEnd
}
export enum TokenType {
    Number,
    String,
    RegularExpression,
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

    Try,
    Catch,
    Finally,
    
    Return,

    QuotationMark,
    RegularExpressionMark,

    Class,
    Static,
    New,

    Void,

    Throw,

    FileEnd
}
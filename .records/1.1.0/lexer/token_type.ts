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
    Loop,
    Colon,

    Comma,
    Dot,

    Declarator,
    Local,

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

    In,
    Of,
    To,
    Increment,

    Call,

    Import,
    Export,

    Await,
    AsyncFunction,
    Function,

    Try,
    Catch,
    Finally,
    
    Continue,
    Break,
    Return,

    QuotationMark,
    RegularExpressionMark,

    Class,
    Static,
    Get,
    Set,
    New,

    Void,

    Throw,

    FileEnd
}
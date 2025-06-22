// grammar

program         -> declaration* EOF ;
declaration     -> funDecl | varDecl | statement ;
funDecl         -> "fun" function ;
function        -> "IDENTIFIER" "(" parametes? ")" block;
statement       -> exprStmt | forStmt | ifStmt | printStmt | returnStmt | whileStmt | block ;
returnStmt      -> "return" expression? ";" ;
forStmt         -> "for" "("  ( varDecl | exprStmt | ";" ) expression?  ";"  expression? ")" statement ;
whileStmt       -> "while" "(" expression ")" statement ;
ifStmt          -> "if" "(" expression ")" statement ( "else" statement )? ;
block           -> "{" declaration  "}"
varDecl         -> "var" IDENTIFIER ( "=" expression )? ";" ;
exprStmt        -> expression ";" ;
printStmt       -> "print" expression ";" ;
expression      -> assignment ;
assignment      -> IDENTIFIER "=" assignment | logic_or ;
logic_or        -> logic_and ( "or" logic_and )* ;
logic_and       -> equality ( "and"  equality )* ;
equality        -> comparision ( ( "!=" | "==" ) comparision )* ;
comparision     -> term ( ( ">" | ">=" | "<" | "<=" ) term )* ;
term            -> factor ( ( "-" | "+" ) factor )* ;
factor          -> unary ( ( "/" | "**" ) unary )* ;
unary           -> ( "!" | "-" ) unary | call ;
call            -> primary ( "(" arguments? ")" )* ;
arguments       -> expression ( "," expression )* ;
primary         -> NUMBER | STRING | "true" | "false" | "nil" | "(" expression ")" | IDENTIFIER ;
 
 

// base

expression      -> literal | unary | binary | grouping ;
literal         -> NUMBER | STRING | "true" | "false" | "nil" ;
grouping        -> "(" expression ")" ;
unary           -> ( "-" | "!" ) expression ;
binary          -> expression operator expression ;
operator        -> "==" | "!=" | "<" | "<=" | ">" | ">=" | "+" | "-" | "*" | "/" ;


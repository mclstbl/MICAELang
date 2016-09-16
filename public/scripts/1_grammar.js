// #### The MICAELang Grammar
// Before moving on to the other modules, here is the MICAELang grammar explained. Not all of the productions defined here are compiled correctly as of now, but they are all
// syntactically parse-able.

// ```LEX``` is a hash table that defines the tokens and regular expression patterns for the grammar's keywords.
// There are only 3 data types accepted and they are inferred by the parser: Number, String and Boolean. Everything else that is not an operand or keyword is interpreted
// as an identifier.
var LEX = 
{
'START':          /\:D/,
'EOF':            /\:\(/,
'PROGRAM':        /^[A-Z]+([A-Za-z]*\d*)*/,
'ELSEIF':         /\:\?\?/,
'IF':             /\:\?/,
'ELSE':           /\?/,
'LBRACKET':       /\\_/,
'RBRACKET':       /_\//,
'PRINT':          /\:O/,
'AND':            /<3/,
'OR':             /\:\*/,
'FI':             /\*/,
'EQ':             /={2}/,
'IS':             /={1}/,
'PLUS':           /\+/,
'MINUS':          /-/,
'MULT':           /\*/,
'DIV':            /\//,
'POW':            /\^/,
'LT':             /</,
'GT':             />/,
'NUMBER':         /^\d*$/,
'STRING':         /^".*"$/,
'BOOLEAN':        /true|false/,
'COMMENT':        /\#/,
'EOL':            /\~/,
'IDENTIFIER':     /^[a-z]*([0-9]*[A-Za-z]*)*/,
'UNDEFINED':      /.*/
};

exports.LEX = LEX;

// The ```RULES``` hash table contains key-value pairs containing the token and a list of acceptable right-hand side tokens.
// The grammar is left-recursive which means that the operators or functions are on the left-hand side and the operands are on the right. The parser supports
// unlimited operands, but they have to be of the same type.
var RULES =
{
'NUMBER':       ['NUMBER','EOL','EOF'],
'BOOLEAN':      ['BOOLEAN','EOL','EOF'],
'STRING':       ['STRING','EOL','EOF'],
'IDENTIFIER':   ['IS','NUMBER','STRING','BOOLEAN','EOL'],
'PROGRAM':      ['EOL','EOF'],
'PLUS':         ['NUMBER','IDENTIFIER'],
'MINUS':        ['NUMBER','IDENTIFIER'],
'MULT':         ['NUMBER','IDENTIFIER'],
'DIV':          ['NUMBER','IDENTIFIER'],
'POW':          ['NUMBER','IDENTIFIER'],
'LT':           ['NUMBER','IDENTIFIER'],
'GT':           ['NUMBER','IDENTIFIER'],
'IS':           ['NUMBER','STRING','BOOLEAN','IDENTIFIER','POW','MULT','DIV','PLUS','MINUS','LT','GT','AND','OR','EQ'],
'EQ':           ['NUMBER','STRING','BOOLEAN','IDENTIFIER'],
'AND':          ['BOOL','IDENTIFIER'],
'OR':           ['BOOL','IDENTIFIER'], 
'PRINT':        ['STRING','IDENTIFIER','BOOLEAN'],
'EOL':          ['ELSEIF','IF','ELSE','FI','IDENTIFIER','PRINT','COMMENT'],
'START':        ['PROGRAM'],

// There are three syntax subdivisions which are also accessable as part of the rules: math operators, bool operators and expressions.
'OPERATORS':    ['POW','MULT','DIV','PLUS','MINUS'],
'BOOL_OPS':     ['LT','GT','AND','OR','EQ'],
'EXPRESSIONS':  ['NUMBER','STRING','BOOLEAN','IDENTIFIER'],

// The following rules for comments, parentheses, and conditionals are not implemented in the parsing yet. 
// Although their syntax can be verified when used as input, the semantics are not interpretable by the parser as of now.
'COMMENT':      ['ELSEIF','IF','ELSE','FI','STRING','COMMENT','EOL'],
'LBRACKET':     ['NUMBER','STRING','BOOLEAN','IDENTIFIER','COMMENT'],
'RBRACKET':     ['NUMBER','STRING','BOOLEAN','IDENTIFIER','COMMENT','EOL'],
'IF':           ['BOOLEAN','IDENTIFIER','LT','GT','EQ','AND','OR','LBRACKET'],
'ELSEIF':       ['BOOLEAN','IDENTIFIER','LT','GT','EQ','AND','OR','LBRACKET'],
'ELSE':         ['POW','MULT','DIV','PLUS','MINUS','IF','PRINT','COMMENT','FI'],
'FI':           ['EOL','COMMENT']
};

exports.RULES = RULES;


(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// #### STAGE 1: USER I/O ####
// There are three components in the web Graphical User Interface (GUI): the editable textarea, clickable "Compile" button, and the read-only output textarea.
// Together, they emulate an Integrated Development Environment (IDE) where users can edit, run and view their programs.

// The button triggers the compilation when it is clicked so whenever the main HTML page loads, an EventListener is created in order to detect mouseclicks.
// Also, ```textarea``` elements have read/write access by default so read-only mode is activated for the output box whenever the page is loaded.
window.onload = function() 
{
  btn = document.getElementById('submitArea');
  btn.addEventListener('click', compile);

  document.getElementById("outputArea").readOnly = true;
}

// The next function prints the results of evaluating the target code generated using the MICAELang input, and is called after compilation is finished. 
// The results of a compilation are posted on the right hand side of the browser (in the read-only textarea) as user output.
var PROGNAME = "";

function stdout(RESULT)
{
  str = RESULT;
  date = new Date();
  time = date.toLocaleTimeString().concat(" $ "); 
  document.getElementById('outputArea').innerHTML += " " + PROGNAME + "\n" + "\n" + time;
  document.getElementById('outputArea').scrollTop = document.getElementById('outputArea').scrollHeight;
}

// Due to the maximum stack call limits in client-side browser applications, the compilation steps have to be separated into smaller stages.
// The compilation sequence begins here. While not explicitly imported, the tokenize module is crucial to compilation but is called from the parse module.
var SYM = require('./2_symbol');
var PARSER = require('./4_parser');
var CODEGEN = require('./5_codegen');

var compile = function() 
{
  obj = document.getElementById("input");
  var CODE = obj.value.toString().trim();
  if (CODE == '') { console.log("no"); return true;}
  
// The ```ALL``` variable is a hash containing information about this system's state after each stage of compilation. It is a record containing the tokens, string inputs, symbol table
// and error pertaining to the source code. It is passed from module to module so that the state is available at any time. If an error is thrown at any stage, the compilation
// is aborted and an error is presented to the user.
  var ALL = PARSER.parse(CODE); 

  for(var key in ALL.ST)
  {
    str = "id: " + ALL.ST[key].identifier + " type: " + ALL.ST[key].type + " value: " + ALL.ST[key].value;
    console.log(str);
    key ++;
  }
  
  l = SYM.getValue('PROGNAME',ALL);
  PROGNAME = l == undefined ? "" : l;

  if (ALL.E != "")
  {
    stdout(ALL.E);
  }

// The code generator only returns 2 entities in a record: an evaluation of generated JavaScript (using built-in JS function ```eval```) and the error string.
  else
  {
    OUTPUT = CODEGEN.generate(ALL);
    str = OUTPUT.E == "" ? OUTPUT.JS : OUTPUT.E;
    stdout(str);
  }

  return ALL;
}

exports.compile = compile;

// As mentioned in the _Analysis_, Browserify adds some lines to the output code before each module so here is another one.

},{"./2_symbol":3,"./4_parser":5,"./5_codegen":6}],2:[function(require,module,exports){
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


},{}],3:[function(require,module,exports){
// <div style="page-break-after: always;"></div>

// #### The Symbol Table ####
// The ```symbol.js``` module defines a structure for containing the identifier, type, and value of variables (```IDENTIFIER```) in MICAELang. The actual table
// is a hash table of identifiers and their associated ```SYMBOL``` objects as key-value pairs.

// This module defines three methods
// * ```lookup```
// * ```update```
// * ```insert```

// During the tokenization and parsing of a program, this module maintains a symbol table containing 0 or more instances of ```SYMBOL```. The three methods
// are designed such that duplicate symbols are not allowed in the language, and type mismatches cause a compilation error.

// The SYMBOL object has three fields: type, identifier and value.
var SYMBOL = function(t,i,v)
{
  this.type = t;
  this.identifier = i;
  this.value = v;
}

SYMBOL.prototype = {
  doX : function () {}
}

exports.SYMBOL = SYMBOL;

// The ```update``` function attempts to modify the value of an existing symbol table entry.
// It returns the new status of the symbol table, and the ```ERROR``` string, which is empty unless there is a type mismatch.
var update = function(SYM,ALL)
{
  i = SYM.identifier;  
  if (ALL.ST[i] != undefined && (ALL.ST[i].type == SYM.type || ALL.ST[i].type == undefined))
  {
    eval("ALL.ST." + i + " = SYM");  
  }
  else
  {
    ALL.E = "ERROR: Type mismatch in inserting '" + SYM.identifier + "' into symbol table (" + ALL.ST[i].type + ")"
  }
  return ALL;
}

exports.update = update;

// The ```insert``` function adds a new entry to the symbol table if it does not exist yet; otherwise, it tries to update the symbol associated with the identifier.
// It returns an array containing the new status of the symbol table and the ```ERROR``` string. Note that if the identifier exists in the symbol table, the error
// depends on the return value of the ```update``` function.
var insert = function(SYM,ALL)
{
  i = SYM.identifier;
  if (ALL.ST[i] == undefined)
  {
    console.log("insert")
    ALL.ST.i = SYM;
  }
  else
  {
    ALL = update(SYM,ALL);
  }
  return ALL;
}

exports.insert = insert;

// The following function returns the type of an identifier if it exists in the table, and returns undefined if lookup fails to find the entry.
exports.getType = function(ID,ALL)
{
  if (isEmpty(ALL.ST))
  {
    return undefined;
  }
  for (var key in ALL.ST)
  {
    if (ALL.ST[key].identifier == ID)
    {
      return ALL.ST[key].type;
    }
  }
  return undefined;
}

// The ```getValue``` function returns the current value of the identifier in the symbol table if it exists, and returns ```undefined``` otherwise.
var getValue = function(ID,ALL)
{
  if (isEmpty(ALL.ST))
  {
    return undefined;
  }
  for (var key in ALL.ST)
  {
    if (ALL.ST[key].identifier == ID)
    {
      return ALL.ST[key].value;
    }
  }
  return undefined;
}

exports.getValue = getValue;

// The ```lookup``` function returns the index of the identifier in the symbol table if it exists, and returns ```undefined``` otherwise.
var lookup = function(ID,ALL)
{
  if (isEmpty(ALL.ST))
  {
    return undefined;
  }
  for (var key in ALL.ST)
  {
    if (ALL.ST[key].identifier == ID)
    {
      return i;
    }
  }
  return undefined;
}

exports.lookup = lookup;

var isEmpty = function(object) {
  for(var key in object) {
    if(object.hasOwnProperty(key)){
      return false;
    }
  }
  return true;
}

exports.isEmpty = isEmpty;
},{}],4:[function(require,module,exports){
// #### STAGE 2: TOKENIZATION ####
// Tokenization serves as an intermediate step of compilation in order to make parsing simpler. In this process, the raw input code is split into an array. The array contents
// are assigned tokens according to the grammar rules and this will make it easier for the parser to check patterns later.

var GRAMMAR = require('./1_grammar');
var SYM = require('./2_symbol');

// The ```tokenize``` function takes an array of strings as input and returns the state of the system.
// This function scans every word in the ```CODE``` string and determines the appropriate token to represent it. The meaning behind the program is not meant to be
// interpreted at this point. Instead, individual words (strings) are checked to see if they are a member of the grammar.

// Since this is the first compilation stage after I/O, the symbol table, tokenized code and error are initialized here.
exports.tokenize = function(CODE)
{
  var ALL = {"T":[],"W":[],"ST":{},"E":""};

  var TOKENS = GRAMMAR.LEX;

// When ```tokenize``` is invoked, CODE contains a string so it needs to be split by whitespace to form ```WORDS```, which is an array.
  CODE = CODE.replace(/(\r\n|\n|\r|\t)/gm," ");
  var WORDS = CODE.split(/ +/);

  ALL.W = WORDS;

// The regular expressions which are in the hash table ```TOKENS``` are tested against each element of ```WORD``` to determine which token fits best.
  for (i = 0; i < ALL.W.length; i ++) 
  {
    console.log(ALL.W.length);
    for (var key in TOKENS)
    {
      var re = new RegExp(TOKENS[key]);
      if (re.exec(ALL.W[i]) != null)
      {

// The application crashes if the word is not found in the hash table at all so the token ```UNDEFINED``` is assigned to those which do not fit anywhere else and an error is thrown.
        if (key == 'UNDEFINED')
        {
          ALL.E = "ERROR: '" + ALL.W[i] + "' is unrecognized ";
          return ALL;
        }
        
// If the word is an identifier or is the program's name, it needs to be recorded in the symbol table.
        if (key == 'PROGRAM')
        {
          sym = new SYM.SYMBOL('PROGRAM','PROGNAME',ALL.W[i]);
          ALL = SYM.insert(sym,ALL);
        }
        else if (key == 'IDENTIFIER')
        {
          sym = new SYM.SYMBOL(undefined,ALL.W[i],undefined);
          ALL = SYM.insert(sym,ALL);
        }
        
        ALL.T[i] = key;
        console.log(ALL.T);
       // break;
      }
    }
  }

// After scanning the code for tokens, the tokenized code and words arrays, symbol table hash, and the ```ERROR``` string are returned to the
// parse function for further processing.
  return ALL;
}
},{"./1_grammar":2,"./2_symbol":3}],5:[function(require,module,exports){
// #### STAGE 3: PARSING ####
// After tokenizing, the parser performs a few checks in order to verify that the source code is syntactically correct and is ready for code generation.
// Since the grammar is left-recursive, the more commonly used recursive descent parsing method is not used here. Moreover, due to JavaScript stack call limits,
// the initially planned one-pass parsing is not implemented here. Instead, there are 3 main functions executed within the main ```parse``` sequence
// * ```checkSyntax```
// * ```simplifyExpressions```
// * ```typeCheck```

var GRAMMAR = require('./1_grammar');
var SYM = require('./2_symbol');
var TOKENIZER = require('./3_tokenizer');

exports.parse = function(CODE) 
{ 
  ALL = TOKENIZER.tokenize(CODE);

// If an error is detected at any parsing stage, compilation is aborted. The ```ALL.E``` value contains the error string and is empty if there are no errors.

// The ```checkSyntax``` checks if the source code tokens satisfy MICAELang's grammar rules.
// Aside from the error string, the ```checkSyntax``` call also checks if the MICAELang starting header is included. Otherwise, an error is returned.
  ALL = ALL.T[0] == 'START' && ALL.T.length >= 2 && ALL.E == "" ? checkSyntax(1,ALL) 
      : {"T" : ALL.T, "W" : ALL.W, "ST" : ALL.ST, "E" : "ERROR: Program entry point not found"};

// Mathematical expressions are simplified here as much as possible and their values are stored in the symbol table.
// Similar to the previous check, ```simplifyExpressions``` only runs if there is no error. Otherwise, it does nothing, which causes the error to propagate 
// to the main compilation sequence and abort the process.
  ALL = ALL.E == "" ? simplifyExpressions(ALL) : ALL;

// The tokens, source code, symbol table and error are returned back to the compiler module. But really, the arguably most important effect of this module is
// the populated symbol table.
  return ALL;
}

// The ```checkSyntax``` function recursively checks the next token to see if the productions in the form of ```[CURRENT,NEXT]``` are accepted by the grammar.
// It returns the state of the system upon completion. ```ALL.E``` would contain an error string if an illegal token is found.
var checkSyntax = function(n,ALL)
{
  if (n == ALL.T.length || ALL.E != "")
  {
    return ALL;
  }
  else
  {
    var G = GRAMMAR.RULES;
    var NEXT = ALL.T[n];
    var CUR = ALL.T[n - 1];

    if(G[CUR].indexOf(NEXT) != -1)
    {
      return checkSyntax(n + 1,ALL);
    }
    else
    {
      ALL.E = "ERROR: '" + NEXT + "' is not accepted by the grammar";
    }
  }
  return ALL;
}

// The ```simplifyExpressions``` function looks for assignment statements involving Mathematical operations. It simplifies by processing constants
// and storing the result in the symbol table.
var simplifyExpressions = function(ALL)
{
  G = GRAMMAR.RULES;
  o = 0; n = 0;
  cur = ALL.T[n];

  while(cur != 'EOF' && ALL.E == "")
  {
    OPERANDS = [];
    if(G['OPERATORS'].indexOf(cur) != -1 && ALL.T[n - 2] == 'IDENTIFIER' && ALL.T[n - 1] == 'IS')
    {
      ID = ALL.W[n-2];
      OP = ALL.W[n];
      o = n + 1;
      while (cur != 'EOL')
      {
        n ++;
        cur = ALL.T[n];
      }
      OPERANDS = ALL.W.slice(o,n);
      if (!typeCheck(ALL.T.slice(o,n)))
      {
        ALL.E = "ERROR: Incompatible types"
        break;
      }
      
      type = ALL.T[o];
      value = apply(OP,OPERANDS);
      sym = new SYM.SYMBOL(type,ID,value);
      ALL = SYM.insert(sym,ALL);      
      
      console.log("done");
    }
    n ++;
    cur = ALL.T[n]; 
  }
  return ALL;
}

// Given that unlimited number of operands are allowed in MICAELang, the type is checked before the data is passed on to the ```apply``` function for evaluation.
// The ```typeCheck``` function returns true if all operands are of same types and false if they are not.
var typeCheck = function(OPERANDS)
{
  l = OPERANDS.length;
  if (l > 0)
  {
    o = OPERANDS[0];
    for(i = 0; i < l; i ++)
    {
      if(OPERANDS[i] != o)
      {
        return false
      }
    }
  }
  return true;
}

// The ```apply``` function indirectly uses the principle of currying. The input is an operator and its list of operands. The function iterates through the
// list until it reaches the end, and then computes the result. This is indirect currying because while intermediate values are not computed, the traversal
// and formation of the evaluated string is similar to what happens in the method.
var apply = function(OP,OPERANDS)
{
  n = 0;
  str = "";
  ctr = 0;
  l = OPERANDS.length;
  while (n < l)
  {
    str = str.concat(OP,OPERANDS[n]);
  }
  
  return eval(str);
}
//
},{"./1_grammar":2,"./2_symbol":3,"./3_tokenizer":4}],6:[function(require,module,exports){
// #### STAGE 4: CODE GENERATION ####

// The last layer of compilation is code generation where symbol table values are substituted into expressions and function applications.
// This module is simple because the grammar only has assignments, arithmetic operations and print statements. Moreover, most arithmetic
// expressions are simplified in the parsing phase.

// The ```generate``` function iterates through the list of tokens and uses ```eval``` to interpret the generated JavaScript code. The output is 
// appended to a string value which is returned to the main compile module as program output.

var SYM = require('./2_symbol');
var TOKENIZER = require('./3_tokenizer');

exports.generate = function(ALL) 
{ 
  console.log("CODEGEN:generate")
  n = 0;
  JS = "";
  err = "";

  while(ALL.T[n] != 'EOF')
  {
// MICAELang's print statement can only print strings so an error is thrown if a number or boolean value is passed in. If the argument to ```!!!``` (print)
// is an identifier, the symbol table is looked up to find the value.
    if(ALL.T[n] == 'PRINT')
    {
      t = n + 1; 
      if(ALL.T[t] == 'STRING' || (ALL.T[t] == 'IDENTIFIER' && SYM.getTYPE(ALL.W,ALL.ST) == 'STRING'))
      {
        str = "\"" + ALL.W[t] + "\"";
        JS += "\n" + eval(str);
      }
      else
      {
        err = "ERROR: Non-string token not recognized for stdout"; 
        return {"JS":JS,"E":err};
      }      
    }
  }

  JS = "\"hello\"";
  return {"JS":JS, "E":err};
}
},{"./2_symbol":3,"./3_tokenizer":4}]},{},[1]);

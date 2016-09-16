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
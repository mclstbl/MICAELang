// #### STAGE 4: CODE GENERATION ####

var SYM = require('./4_symbol');
var TOKENIZER = require('./2_tokenizer');

exports.generate = function(ALL) 
{ 
// The productions that are allowed in the language is be defined by EXPRESSIONS.

// return {"TOKENIZED" : TOKENIZED_CODE, "SYMBOLS" : SYMBOL_TABLE, "ERROR" : error};

  WORDS = ALL.W;

  JS = "\"hello\"";
  return {"JS":JS, "E":""};
}
//
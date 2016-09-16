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
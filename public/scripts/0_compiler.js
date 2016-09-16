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

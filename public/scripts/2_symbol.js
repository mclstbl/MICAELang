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
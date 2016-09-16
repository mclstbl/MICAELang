// <div style="page-break-after: always;"></div>
// ### APPENDIX ###
// #### *Testing: Tokenizer* ####
// To test the tokenizer, a MICAELang script containing all possible members of the grammar is used as input. The following code was used as input and did not register
// any errors.
// <pre><code>
// = + - * / < ^ > == :* <3 1314213  "hello" "hi" true     ashka
// # # hello # # :O
// [          ] :D :( ~ 121kjn
// </code></pre>
// At this stage of testing, the parser and codegen functions had not been written so the focus was on verifying that the resulting tokens produced from this source code
// was accurate. The verification was done by manually checking if each one is correct.

// To check if the tokenizer throws the right errors, deliberate syntax errors such as unterminated strings, comments and random symbols were used in the input. Errors were
// reported as expected.

// #### *Testing: Parser* ####
// The parser testing checks whether the structure of the source code complies with the specification given by the MICAELang grammar. The parse module has three stages of
// syntax, type and expression checking, and each one was tested separately.

// The first test case was a minimal working MICAELang parse which was tested for structural/grammatical correctness. Here, it is verified that input words satisfy the order
// specified by the grammar. The following code snippet is a minimal MICAELang program which does not really do anything because it exits right after the program entry.
// <pre><code>
// :D Hello 
// :(
// </code></pre>
// As expected, the parser did not throw any errors here. To further the parser testing, random text and deliberate grammatical errors were inserted into the input. The
// parser threw the appropriate errors.

// The second test was designed to verify that type-checking works. In assignment statements, the operands all need to be of the same type before they are
// evaluated. The following program was used to check types.
// <pre><code>
// :D Hello ~
// i = + 1 1 1 1
// :(
// </code></pre>
// This program did not result in an error. However, if, for example one of the ```1```'s is replaced with a string, compilation fails because it is not the
// same type as the other operands.

// The last test incorporated expressions into the source code. In the grammar, expressions can only be used when they are assigned to a variable so the following
// is a minimal working example.
// <pre><code>
// :D Hello ~
// i = + 1 1 1 1
// :(
// </code></pre>
// Two things that were used to verify the expression parsing were the symbol table's state and the error messages. After execution of this program, the symbol table must be
// populated with the program name and ```NUMBER i = 4```, and it was. Similar to what was done in the previous tests, deliberate syntax and type errors were introduced into 
// the input, thereby causing parsing errors.

// #### *Testing: Code Generator* ####
// Testing the code generator is as easy as checking the input and output fields of the application. If the output field produces an expected result, then the
// code generator is functional. The following program is run:
// <pre><code>
// :D Hello ~
// i = + 1 1 1 1 ~
// j = "Hello World" ~
// :O j
// :(
// </code></pre>
// This returns the expected output which is "Hello World."

// The parser resolves most grammatical errors involving the print statement and literals. Only strings or identifiers containing strings can be used as
// input to the ```!!!```. However, if the value of an identifier is an integer, it will not be caught by the parser. Thus, the following code produces
// an error when run, as expected.
// <pre><code>
// :D Hello ~
// i = + 1 1 1 1 ~
// j = "Hello World" ~
// :O i 
// :(
// </code></pre>

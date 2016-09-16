// # MICAELang: Multiplatform Illustrated Context-Free ASCII Emoji Language
// ## By Micaela E. Estabillo
// ## April 2016

// ### Introduction
// MICAELang is an esoteric context-free language which is compiled to JavaScript using the browser.
// The source language is comprised of emojis, numbers, strings and mathematical operators. The compiler runs solely in the browser and 
// was written in "vanilla" JavaScript, which means that no servers, external APIs 
// or frameworks were used. The source code can be found in https://github.com/mclstbl/MICAELang.

// ### Problem ###
// The creation of MICAELang was inspired by two current situations.
// First, there are a total of 845 emojis supported across all smartphone and computer platforms (Emojipedia), and each one has an associated meaning. These graphical characters
// are often used in messaging in order to communicate, but there are not many programming languages that utilize them. 
// Secondly, mainstream compilers require installation on a local computer; most popular online compilers such as Ideone connect to a 
// remote server on which the input code is compiled then return the results to the browser. 
// The purpose of MICAELang is to create an emoji and symbol-based language which can be parsed and executed purely within a browser.

// ### History and Background
// The MICAELang project's purpose is to use emojis as keywords and minimize amount of computation in the background so that compilation can run in the browser.
// A similar idea is implemented in Skulpt, which is an in-browser implementation of Python. The main selling point of Skulpt is the fact that it is compiled on the client
// side so there is no risk of throttling a remote server, and also that there is no installation required to use it. 

// The main differences between MICAELang and Skulpt are:
// * MICAELang currently only supports arithmetic expression assignments and print statements so the grammar is not very complex.
// * MICAELang is context-free - the syntax of expressions are a bit different from Python because there is no support for parentheses.
// * MICAELang uses symbols and emojis as keywords.

// ### Analysis and Design
// MICAELang is an application written in JavaScript, which is a programming language commonly used to control the behaviour of web browsers. It follows that the application
// runs on a web platform since most browsers are capable of running JavaScript; no installation is required on the user's end.

// Initially, the project was designed to use meteor.js in order to use a preexisting parser generator called Jison. However, since the MICAELang grammar is very simple and writing
// a parser was not very complicated, external frameworks proved to be of little use. Instead, a tool called Browserify is utilized in the app's build process in order to 
// bundle up all the smaller modules into one script which is loaded onto the HTML web interface. The most obvious effect of Browserify is the enablement of 
// the ```require```, ```module```, and ```exports``` keywords which typically do not run on the client side of a web application. 

// Overall, each MICAELang compilation has 4 stages: user I/O, tokenization, parsing and code generation. Each step is contained in a separate module, and modifies the system's state.
// In a typical execution,the user enters MICAELang code into an HTML interface, which is forwarded to the tokenization module to prepare the code for parsing. 
// It is important to mention that all identifiers found in the source code are recorded in a symbol table, which is used during code generation. 
// Finally, after the code is generated, the resulting action (or error) is displayed back to the browser.

// The documentation, including this report, was generated using literate programming with the open-source tool Docco and some shell scripting. 
// Generating this report required some maneuvering using a shell build script in order to make it look pretty - Browserify adds extra lines to the generated script which does
// not display well using only Docco.

// ### Documentation
// The following function header starts off the Browserify-generated script bundle. It enables the ```exports```, ```require``` and ```module``` JavaScript keywords.  

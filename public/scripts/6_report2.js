// ### Testing
// The MICAELang project was tested using white-box unit tests. Each module builds on top of previous ones so each one was verified incrementally before moving on to write the next
// module. Since there are no testing frameworks currently available for this language (MICAELang), testing was done manually by writing snippets of code and compiling
// to see the output. Each one of these units were tested:
// * Tokenizer
// * Parser
// * Code Generator

// The details of testing each module are available in the Appendix section of this paper.

// ### Conclusion, Evaluation and Further Work
// In conclusion, this application proves that emojis and symbols can be defined in a grammar for programming purposes. Also, it shows that 
// programs can be compiled using JavaScript in the browser.

// The tests that were run were successful and helpful in ensuring that the the MICAELang compiler works. There were no other problems, except for the
// fact that it took longer to realize what was essential to the project so plenty of time was wasted weeding out unnecessary parts and restarting.

// In the future, other constructs of the MICAELang language should be implemented in the parse module so that they can be interpreted as well. Moreover, more complicated
// programming concepts such as loops and user-defined functions can be added to the grammar.

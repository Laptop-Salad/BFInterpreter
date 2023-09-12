class BFInterpreter {
    constructor(code) {
        this.code = code.split("");
        this.brackets;
        this.result = "";

        this.main();
    }

    main() {
        const parser = new Parser();
        this.brackets = parser.findBrackets([...this.code], 0, false);

        const interpreter = new Interpreter([...this.code], this.brackets);
        this.result = interpreter.interpret();

        const io = new IO;
        io.output(this.result);
    }
}

class Parser {
    constructor() {
        this.brackets = {}
    }

    findBrackets(line, startPos, recur) {
        var start = null;
        var end = null;
        var bracketCount = 0;
        var char = startPos;

        while (char < line.length) {
            if (start === null) {
                if (line[char] === "[") {
                    start = new Bracket(bracketCount, char);
                    this.brackets[char] = start;
                    line[char] = "x";
                    bracketCount++;
                } else if (line[char] === "]") {
                    new Error(char, line, null, null, "SYNTAX ERROR: Unmatched bracket");
                }
            } else if (end === null) {
                // It means there might be another set of brackets within the current one
                if (line[char] == "[") {
                    line = this.findBrackets(line, char, true);
                } else if (line[char] == "]") {
                    end = new Bracket(bracketCount, char);
                    this.brackets[char] = end;
                    start.cores = end;
                    end.cores = start;
                    line[char] = "x";
                    bracketCount++;

                    start = null
                    end = null

                    if (recur) {
                        return line;
                    }
                }
            }

            char += 1
        }

        if (start === null && end === null) {
            return this.brackets;
        } else if (start === null || end === null) {
            new Error(char, line, null, null, "SYNTAX ERROR: Unmatched bracket");
        }

        return this.brackets;
    }
}

class Interpreter {
    constructor(code, brackets) {
        this.code = code;
        this.arr = Array(30_000).fill(0);
        this.pointer = 0;
        this.brackets = brackets;
    }

    interpret() {
        var output = ""
        var char = 0;
        var code = this.code;
        const io = new IO;

        while (char < code.length) {
            switch (code[char]) {
                case ">":
                    this.pointer += 1
                    this.#checkPointer();
                    break;
                case "<":
                    this.pointer -= 1;
                    this.#checkPointer()
                    break;
                case "+":
                    this.arr[this.pointer] += 1;
                    this.#checkArr();
                    break;
                case "-":
                    this.arr[this.pointer] -= 1;
                    this.#checkArr();
                    break;
                case ".":
                    output += String.fromCharCode(this.arr[this.pointer]);
                    break;
                case ",":
                    this.arr[this.pointer] = io.getInput();
                    this.#checkArr();
                    break;
                case "[":
                    char = this.#handleBrackets(char);
                    this.#checkArr();
                    break;
                case "]":
                    char = this.#handleBrackets(char);
                    this.#checkArr();
                    break;
            }

            char += 1
        }

        return output;
    }

    #handleBrackets(char) {
        var bracket = this.brackets[char];

        // Find corresponding bracket
        if (this.code[char] == "[" && this.arr[this.pointer] == 0) {
            var coresBracket = bracket.cores;
            return coresBracket.pos;
        } else if (this.code[char] == "]" && this.arr[this.pointer] != 0) {
            var coresBracket = bracket.cores;
            return coresBracket.pos;
        }

        return char;
    }
    
    #checkArr() {
        if (this.arr[this.pointer] > 255 || this.arr[this.pointer] < 0) {
            new Error(null, null, this.pointer, this.arr, "INCORRECT VALUE: Value must be between 0 and 255");
        }
    }

    #checkPointer() {
        if (this.pointer > (30_000 - 1) || this.pointer < 0) {
            new Error(null, null, this.pointer, null, "POINTER OUT OF BOUNDS:");
        }
    }
}

class Bracket {    
    constructor(id, pos) {
        this.id = id;
        this.pos = pos;
        this.cores = null;
    }
}

class Error {
    constructor(position, code, pointer, arr, message) {
        const io = new IO;
        
        if (position !== null && code !== null) {
            io.output(
                message + " at position " + position);
            throw '';
        } else if (pointer !== null && arr !== null) {
            io.output(message + " at pointer in arr " + pointer);
            throw '';
        } else if (pointer !== null) {
            io.output(message + " at pointer in arr " + pointer);
            throw '';
        }
    }
}

class IO {
    output(message) {
        document.getElementById("result").innerHTML = message;
    }

    getInput() {
        return prompt("Enter Input: ");
    }
}

// Default exports
export default BFInterpreter;
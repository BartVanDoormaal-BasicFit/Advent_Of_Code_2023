//Character that doesn't count as a symbol
const nonSymbolChar = '.';

//Final anwser
let anwser = 0;

// Read data, Remove newlines and Append extra empty line for when data ends with a number
let lines = require("fs").readFileSync( './data.txt', { encoding : 'utf-8' } ).split('\n');

// Only used for debugging, but I like it and I'm keeping it
const debugPrintGear = (lineIdx, charIdx) => {
    console.log(`
${lineIdx == 0 ? '\u001b[31;1m^^^\u001b[0m' : lines[lineIdx-1].substring( charIdx-10, charIdx-1 )}\u001b[36;1m${lineIdx == 0 ? '\u001b[31;1m^^^\u001b[0m' : lines[lineIdx-1].substring( charIdx-1, charIdx+2 )}\u001b[0m${lineIdx == 0 ? '\u001b[31;1m^^^\u001b[0m' : lines[lineIdx-1].substring( charIdx+2, charIdx+11 )}
${lines[lineIdx].substring( charIdx-10, charIdx-1 )}\u001b[36;1m${lines[lineIdx].substring( charIdx-1, charIdx )}\u001b[0m\u001b[33;1m${lines[lineIdx].substring( charIdx, charIdx+1 )}\u001b[0m\u001b[36;1m${lines[lineIdx].substring( charIdx+1, charIdx+2 )}\u001b[0m${lines[lineIdx].substring( charIdx+2, charIdx+11 )}
${lineIdx == lines.length-1 ? '\u001b[31;1m˯˯˯\u001b[0m' : lines[lineIdx+1].substring( charIdx-10, charIdx-1 )}\u001b[36;1m${lineIdx == lines.length-1 ? '\u001b[31;1m˯˯˯\u001b[0m' : lines[lineIdx+1].substring( charIdx-1, charIdx+2 )}\u001b[0m${lineIdx == lines.length-1 ? '\u001b[31;1m˯˯˯\u001b[0m' : lines[lineIdx+1].substring( charIdx+2, charIdx+11 )}\u001b[0m
`);
}

// Loop the characters in the line, find & check numbers
lines.forEach( (line, lineIdx) => {
    line.split('').forEach( (char, charIdx) => {
        if( 
            char == "*"  //This is a gear
        ) {
            // Get the character around the gear
            let leftPart = line.substring( charIdx-1,charIdx);
            let rightPart = line.substring( charIdx+1, charIdx+2);
            let topPart = lineIdx == 0 ? '' : lines[lineIdx-1].substring( charIdx-1, charIdx+2);
            let bottomPart = lineIdx == lines.length-1 ? '' : lines[lineIdx+1].substring( charIdx-1, charIdx+2);

            // Determin the number of numbers in left, right, top and bottom parts
            let L = leftPart.replaceAll(nonSymbolChar,'').replaceAll( /[^0-9]/g, '' ).length == 0 ? 0 : 1;
            let R = rightPart.replaceAll(nonSymbolChar,'').replaceAll( /[^0-9]/g, '' ).length == 0 ? 0 : 1;
            let T = topPart.replaceAll(nonSymbolChar, '').replaceAll( /[^0-9]/g, '' ).length == 0 ? 0 : 1;
            T = topPart.match( new RegExp( `[0-9]\\${nonSymbolChar}[0-9]` ) ) ? 2 : T;  //Top can contain two numbers!
            let B = bottomPart.replaceAll(nonSymbolChar, '').replaceAll( /[^0-9]/g, '' ).length == 0 ? 0 : 1;
            B = bottomPart.match( new RegExp( `[0-9]\\${nonSymbolChar}[0-9]` ) ) ? 2 : B; //Bottom can also contain two numbers

            // When two numbers are found, this is a valid gear, find the full numbers
            if( L + R + T + B == 2 ) {
                //Multipliers for the final anwser
                let L_NR = 1;
                let R_NR = 1;
                let T_NR = 1;
                let B_NR = 1;

                if( L == 1 ) {
                    //Number on the left of the gear
                    L_NR = parseInt( line.substring( 0, charIdx ).match( /[0-9]+$/ )[0] );
                }
                if( R == 1 ) {
                    //Number on the right of the gear
                    R_NR = parseInt( line.substring( charIdx+1, line.length ).match( /^[0-9]+/ )[0] );
                }
                
                if( T == 1 ) {
                    if( topPart.substring(2,3) == nonSymbolChar ) {
                        // Number on the top-left
                        T_NR = parseInt( lines[lineIdx-1].substring( 0, charIdx+2).replaceAll( new RegExp(`[\\${nonSymbolChar}]+$`,'g' ),''  ).match(/[0-9]+$/)[0] );
                    }
                    else if( topPart.substring(0,1) == nonSymbolChar ) {
                        // Number on the top-right
                        T_NR = parseInt( lines[lineIdx-1].substring( charIdx-1, line.length).replaceAll( new RegExp(`^[\\${nonSymbolChar}]+`,'g' ),''  ).match(/^[0-9]+/)[0] );
                    }
                    else {
                        // Number fully above
                        T_NR = parseInt( `${lines[lineIdx-1].substring( 0, charIdx+1).replaceAll( new RegExp(`^[\\${nonSymbolChar}]+`,'g' ),''  ).match(/[0-9]+$/)[0]}${lines[lineIdx-1].substring( charIdx+1, line.length).replaceAll( new RegExp(`^[\\${nonSymbolChar}]+`,'g' ),''  ).match(/^[0-9]+/)[0]}` );
                    }
                }
                else if( T == 2 ) {
                    //Both numbers are above
                    T_NR = parseInt( lines[lineIdx-1].substring( 0, charIdx+1).replaceAll( new RegExp(`[\\${nonSymbolChar}]+$`,'g' ),''  ).match(/[0-9]+$/)[0] )
                           *
                           parseInt( lines[lineIdx-1].substring( charIdx+1, line.length).replaceAll( new RegExp(`^[\\${nonSymbolChar}]+`,'g' ),''  ).match(/^[0-9]+/)[0] )
                    ;
                }

                if( B == 1 ) {
                    //Left
                    if( bottomPart.substring(2,3) == nonSymbolChar ) {
                        B_NR = parseInt( lines[lineIdx+1].substring( 0, charIdx+2).replaceAll( new RegExp(`[\\${nonSymbolChar}]+$`,'g' ),''  ).match(/[0-9]+$/)[0] );
                    }
                    //Right
                    else if( bottomPart.substring(0,1) == nonSymbolChar ) {
                        B_NR = parseInt( lines[lineIdx+1].substring( charIdx-1, line.length).replaceAll( new RegExp(`^[\\${nonSymbolChar}]+`,'g' ),''  ).match(/^[0-9]+/)[0] );
                    }
                    //Below
                    else {
                        B_NR = parseInt( `${lines[lineIdx+1].substring( 0, charIdx+1).replaceAll( new RegExp(`^[\\${nonSymbolChar}]+`,'g' ),''  ).match(/[0-9]+$/)[0]}${lines[lineIdx+1].substring( charIdx+1, line.length).replaceAll( new RegExp(`^[\\${nonSymbolChar}]+`,'g' ),''  ).match(/^[0-9]+/)[0]}` );
                    }
                }
                else if( B == 2 ) {
                    //Both are below
                    B_NR = parseInt( lines[lineIdx+1].substring( 0, charIdx+1).replaceAll( new RegExp(`[\\${nonSymbolChar}]+$`,'g' ),''  ).match(/[0-9]+$/)[0] )
                           *
                           parseInt( lines[lineIdx+1].substring( charIdx+1, line.length).replaceAll( new RegExp(`^[\\${nonSymbolChar}]+`,'g' ),''  ).match(/^[0-9]+/)[0] )
                    ;
                }

                anwser += L_NR * R_NR * B_NR * T_NR;
            }
        }
    });
});

console.log("The anwser is: ", anwser);
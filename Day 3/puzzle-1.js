//Character that doesn't count as a symbol
const nonSymbolChar = '.';

//Final anwser
let anwser = 0;

// Read data, Remove newlines and Append extra empty line for when data ends with a number
let rawdata = require("fs").readFileSync( './data.txt', { encoding : 'utf-8' } );
const lineLength = rawdata.indexOf('\n');
rawdata = rawdata.replaceAll('\n', '').concat( ''.padEnd(lineLength, nonSymbolChar) );

// Loop the characters in the line, find & check numbers
let currentNumber = '';
rawdata.split('').forEach( (char, charIdx) => {
    //If this char is a number, append it to the currentNumber string
    if( !isNaN(parseInt( char ) ) ) {
        currentNumber = currentNumber.concat( char );
    }
    // If not, check if the currentNumber contais a value (if so, a number has been found)
    else if( currentNumber != "" ) {
        // Now check if this number is adjacent to a symbol
        const isLineStart = (charIdx - currentNumber.length) % lineLength == 0;
        const isLineEnd   = charIdx % lineLength == 0;

        if( ![ nonSymbolChar, '' ].includes( isLineStart ? '' : rawdata.substring( charIdx - currentNumber.length - 1, charIdx - currentNumber.length ) )   // Left
            || ![ nonSymbolChar, '' ].includes( isLineEnd ? '' : rawdata.substring( charIdx, charIdx + 1 ) ) //Right
            || rawdata.substring( charIdx  - currentNumber.length - lineLength - (isLineStart ? 0 : 1) , charIdx - lineLength + (isLineEnd ? 0 : 1) ).replaceAll( new RegExp(`\\d|\\${nonSymbolChar}`,'g'),'').length > 0 // Row above
            || rawdata.substring( charIdx  - currentNumber.length + lineLength - (isLineStart ? 0 : 1) , charIdx + lineLength + (isLineEnd ? 0 : 1) ).replaceAll( new RegExp(`\\d|\\${nonSymbolChar}`,'g'),'').length > 0 // Row below
        ) {
            // Valid number, add to anwser
            anwser += parseInt( currentNumber );
        }
        // Clear for a new number
        currentNumber = '';
    }
});

console.log("The anwser is ", anwser)

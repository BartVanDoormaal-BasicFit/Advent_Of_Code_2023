const fs = require( 'fs' );

//Variable to count the final anwser
let anwser = 0;

//Read the data
let rawdata = fs.readFileSync( './data-1.txt', { encoding : 'utf-8' } );

//Loop each line of the data
rawdata.split( '\n' ).forEach( line => {
    
    // The right calibration values for string "eighthree" is 83 and for "sevenine" is 79. 
    // Instead of a complicated indices lookup and replacement loop, just replace all possible occurances (words that share last/first) with the correct numbers
    line = line.replace( /oneight/gi    , "18");
    line = line.replace( /threeight/gi  , "38");
    line = line.replace( /fiveight/gi   , "58");
    line = line.replace( /nineight/gi   , "98");
    line = line.replace( /twone/gi      , "21");
    line = line.replace( /sevenine/gi   , "79");
    line = line.replace( /eightwo/gi    , "82");
    
    // Replace the normal words with numbers
    [ 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight','nine' ].forEach( ( replacement, count ) => { line = line.replaceAll( replacement, (count+1) ) });
    
    // Split line into characters, filter and only keep numeric characters
    let nrs = line.split('').filter( c => c.charCodeAt(0) > 47 && c.charCodeAt(0) < 58 );

    // If there are characters left, parse the first and last into a new int and count
    if( nrs.length > 0 ) anwser += parseInt(`${nrs[0]}${nrs[nrs.length-1]}`);
});

console.log(`The anwser is ${anwser}`);
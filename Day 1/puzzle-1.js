const fs = require( 'fs' );

//Variable to count the final anwser
let anwser = 0;

//Read the data
let rawdata = fs.readFileSync( './data-1.txt', { encoding : 'utf-8' } );

//Loop each line of the data
rawdata.split( '\n' ).forEach( line => {
    // Split line into characters, filter and only keep numeric characters
    let nrs = line.split('').filter( c => c.charCodeAt(0) > 47 && c.charCodeAt(0) < 58 );
    // If there are characters left, parse the first and last into a new int and count
    if( nrs.length > 0 ) anwser += parseInt(`${nrs[0]}${nrs[nrs.length-1]}`);
});

//Output result
console.log(`The anwser is ${anwser}`);
// Get the data from the data file
const rawdata = require( 'fs' ).readFileSync( './data.txt', { encoding : 'utf-8' } ).split('\n');
const times     = rawdata[0].split(':')[1].trim().split(' ').filter( e => e != '' ).map( e => parseInt(e) );
const distances = rawdata[1].split(':')[1].trim().split(' ').filter( e => e != '' ).map( e => parseInt(e) );

let anwser = 1;

// Loop times
for (let idx = 0; idx < times.length; idx++) {
    
    // Start at ( TIME - (TIME/2) ) * TIME / 2 (this is the best possible distance), from their go down and check if the previous index
    // still beats the distance, if so continue, if not, the index/count needed is found
    let count = 0;
    for (let i = Math.ceil( times[idx] / 2 ) - 1, cnt = 1; i > 0 ; i--) {
        let loopResult = Math.floor( (times[idx] - i ) * ( i ) );
        if( loopResult > distances[idx] ) count = cnt;
        else break;
        cnt++;
    }
    // Multiply the index by 2 (only checked down, but the same applies to up), add one for even numbers
    count = ( count * 2 ) + ( times[idx] % 2 == 0 ? 1 : 0 )
    
    // Multiply for the final anwser
    anwser *= count;
    
};
console.log('The anwser is :', anwser );
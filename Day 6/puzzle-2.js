// Get the data from the data file
const rawdata  = require( 'fs' ).readFileSync( './data.txt', { encoding : 'utf-8' } ).split('\n');
const time     = parseInt( rawdata[0].replaceAll(' ','').split(':')[1] ); 
const distance = parseInt( rawdata[1].replaceAll(' ','').split(':')[1] );

// See day 1, this is the same, only with no loop
let anwser = 1;
for (let i = Math.ceil( time / 2 ) - 1, cnt = 1; i > 0 ; i--) {
    let loopResult = Math.floor( (time - i ) * ( i ) );
    if( loopResult > distance ) anwser = cnt;
    else break;
    cnt++;
}
anwser = ( anwser * 2 ) + ( time % 2 == 0 ? 1 : 0 )
  
console.log('The anwser is :', anwser );
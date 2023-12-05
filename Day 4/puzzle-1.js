// Read the data, split into lines, map each line to an array (winning/own), map each element in an array of numbers and filter that array to only contain numbers
// Then reduce each line to a count of occurances, calculate Math.floor( Math.pow(2,N) ) with that number and finally reduce that down to a final sum 
console.log('The anwser is ', 
    require( 'fs' ).readFileSync( './data.txt', { encoding : 'utf-8' } )
        .split('\n')
        .map( ( card ) => card.substring( card.indexOf(':') + 1, card.length )
                              .split('|')
                              .map( ( numbers ) => numbers.split(' ') 
                                  .filter( ( number ) => number != '' )
                                  .map( ( number ) => parseInt(number)  )
                              ) 
        )
        .reduce( (crdAcc, crdVal) => crdAcc + Math.floor( Math.pow( 2, crdVal[1].reduce( (nrAcc, nrVal) => nrAcc + ( crdVal[0].includes( nrVal ) ? 1 : 0), 0 ) - 1 ) ), 0)
);

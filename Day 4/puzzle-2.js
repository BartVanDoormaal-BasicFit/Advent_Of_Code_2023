// Same split into cards array with each element being its an array of winning/own numbers
// Only this time, after that is is mapped to an object
let cards = require( 'fs' ).readFileSync( './data.txt', { encoding : 'utf-8' } )
    .split('\n')
    .map( ( card ) => card.substring( card.indexOf(':') + 1, card.length )
                            .split('|')
                            .map( ( numbers ) => numbers.split(' ') 
                                .filter( ( number ) => number != '' )
                                .map( ( number ) => parseInt(number)  )
                            ) 
    )
    .map( (card,idx) => Object.assign( {}, { number : idx+1, winning : card[0], own : card[1], multiplier : 1 } ) )
;

// Loop all cards and set multiplier for each card
cards.forEach( (card,listIndex) => { 
    // Get the number of wins for this card
    let nrOfWins = card.own.reduce( (nrAcc, nrVal) => nrAcc + ( card.winning.includes( nrVal ) ? 1 : 0), 0 );
    // For every card after this one, increment it's multiplier with the current card multiplier
    for (let i = card.number+1; i <= card.number + nrOfWins; i++) {
        cards.forEach( (rCard,rIdx) => { if( rCard.number == i ) rCard.multiplier += 1 * card.multiplier } )
    }
})

// Sum up the multipliers for the final anwser
console.log(' The anwser is :', cards.reduce( (a,v) => a + v.multiplier, 0) );
